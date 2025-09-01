import config from '../config/environment';
import logger from '../services/logger';

// Input sanitization utilities
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// XSS protection for dynamic content
export const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return unsafe;
  
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Content Security Policy helper
export const initCSP = () => {
  if (!config.SECURITY.ENABLE_CSP) return;

  const cspDirectives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for React in development
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://js.sentry-cdn.com',
      'https://browser.sentry-cdn.com'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for CSS-in-JS
      'https://fonts.googleapis.com'
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com'
    ],
    'img-src': [
      "'self'",
      'data:',
      'https:',
      'blob:'
    ],
    'connect-src': [
      "'self'",
      config.API.BASE_URL,
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://*.sentry.io'
    ],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
    'frame-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': []
  };

  const cspString = Object.entries(cspDirectives)
    .map(([directive, sources]) => {
      if (sources.length === 0) return directive;
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');

  // Create meta tag for CSP
  const metaTag = document.createElement('meta');
  metaTag.httpEquiv = 'Content-Security-Policy';
  metaTag.content = cspString;
  document.head.appendChild(metaTag);

  logger.info('Content Security Policy initialized', { csp: cspString });
};

// URL validation
export const isValidUrl = (url) => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    const allowedDomains = config.SECURITY.ALLOWED_DOMAINS;
    
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return false;
    }
    
    if (urlObj.protocol.startsWith('http') && allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(domain => {
        if (domain.startsWith('*.')) {
          const baseDomain = domain.substring(2);
          return urlObj.hostname.endsWith(baseDomain);
        }
        return urlObj.hostname === domain;
      });
      
      if (!isAllowed) {
        logger.warn('URL blocked by domain whitelist', { url, hostname: urlObj.hostname });
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
};

// Rate limiting for client-side actions
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  isAllowed(key, maxRequests = 100, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requests = this.requests.get(key);
    
    // Remove old requests
    const validRequests = requests.filter(time => time > windowStart);
    this.requests.set(key, validRequests);
    
    if (validRequests.length >= maxRequests) {
      logger.warn('Rate limit exceeded', { key, requests: validRequests.length });
      return false;
    }
    
    validRequests.push(now);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// Secure localStorage wrapper
export const secureStorage = {
  setItem: (key, value) => {
    try {
      const sanitizedKey = sanitizeInput(key);
      const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
      localStorage.setItem(sanitizedKey, JSON.stringify(sanitizedValue));
      return true;
    } catch (error) {
      logger.error('Secure storage set failed', { key, error: error.message });
      return false;
    }
  },
  
  getItem: (key) => {
    try {
      const sanitizedKey = sanitizeInput(key);
      const item = localStorage.getItem(sanitizedKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      logger.error('Secure storage get failed', { key, error: error.message });
      return null;
    }
  },
  
  removeItem: (key) => {
    try {
      const sanitizedKey = sanitizeInput(key);
      localStorage.removeItem(sanitizedKey);
      return true;
    } catch (error) {
      logger.error('Secure storage remove failed', { key, error: error.message });
      return false;
    }
  }
};

// Feature detection and security checks
export const performSecurityChecks = () => {
  const checks = {
    https: window.location.protocol === 'https:',
    localStorage: (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    })(),
    sessionStorage: (() => {
      try {
        sessionStorage.setItem('test', 'test');
        sessionStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    })(),
    cookies: navigator.cookieEnabled,
    referrerPolicy: document.referrerPolicy !== '',
    csp: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]')
  };

  const failedChecks = Object.entries(checks)
    .filter(([_, passed]) => !passed)
    .map(([check]) => check);

  if (failedChecks.length > 0) {
    logger.warn('Security checks failed', { failedChecks, checks });
  } else {
    logger.info('All security checks passed', checks);
  }

  return { checks, passed: failedChecks.length === 0 };
};

// Initialize security features
export const initSecurity = () => {
  // Initialize CSP
  initCSP();
  
  // Perform security checks
  performSecurityChecks();
  
  // Disable right-click context menu in production
  if (config.isProduction()) {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    
    // Disable text selection in production
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
    });
    
    // Disable drag and drop
    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
  }
  
  // Disable developer tools detection (basic)
  if (config.isProduction()) {
    let devtools = { open: false };
    const threshold = 160;
    
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          logger.warn('Developer tools detected');
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }
  
  logger.info('Security features initialized');
};