import config from '../config/environment';

// Log levels
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class Logger {
  constructor() {
    this.isDevelopment = config.isDevelopment();
    this.isProduction = config.isProduction();
    this.enabledLevels = this.isDevelopment 
      ? [LOG_LEVELS.ERROR, LOG_LEVELS.WARN, LOG_LEVELS.INFO, LOG_LEVELS.DEBUG]
      : [LOG_LEVELS.ERROR, LOG_LEVELS.WARN, LOG_LEVELS.INFO];
  }

  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const sessionId = this.getSessionId();
    
    return {
      timestamp,
      level,
      message,
      sessionId,
      environment: config.ENVIRONMENT,
      version: config.APP_VERSION,
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context,
    };
  }

  getSessionId() {
    if (!sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', Date.now().toString(36) + Math.random().toString(36).substr(2));
    }
    return sessionStorage.getItem('sessionId');
  }

  log(level, message, context = {}) {
    if (!this.enabledLevels.includes(level)) {
      return;
    }

    const logEntry = this.formatMessage(level, message, context);

    // Console logging
    if (this.isDevelopment) {
      const consoleMethod = console[level] || console.log;
      consoleMethod(
        `[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`,
        context
      );
    }

    // Send to external logging service in production
    if (this.isProduction && config.FEATURES.ERROR_REPORTING) {
      this.sendToLogService(logEntry);
    }

    // Store critical logs locally for debugging
    if (level === LOG_LEVELS.ERROR || level === LOG_LEVELS.WARN) {
      this.storeLocalLog(logEntry);
    }
  }

  error(message, context = {}) {
    this.log(LOG_LEVELS.ERROR, message, context);
    
    // Also send to Sentry if available
    if (window.Sentry && config.FEATURES.ERROR_REPORTING) {
      window.Sentry.withScope((scope) => {
        Object.keys(context).forEach(key => {
          scope.setTag(key, context[key]);
        });
        window.Sentry.captureMessage(message, 'error');
      });
    }
  }

  warn(message, context = {}) {
    this.log(LOG_LEVELS.WARN, message, context);
  }

  info(message, context = {}) {
    this.log(LOG_LEVELS.INFO, message, context);
  }

  debug(message, context = {}) {
    if (config.FEATURES.DEBUG_MODE) {
      this.log(LOG_LEVELS.DEBUG, message, context);
    }
  }

  // Performance logging
  performance(name, duration, context = {}) {
    this.info(`Performance: ${name}`, {
      ...context,
      duration: `${duration}ms`,
      type: 'performance'
    });

    // Send to analytics if enabled
    if (config.FEATURES.ANALYTICS && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: name,
        value: duration,
        event_category: 'Performance'
      });
    }
  }

  // User interaction logging
  userAction(action, context = {}) {
    this.info(`User Action: ${action}`, {
      ...context,
      type: 'user_action'
    });

    // Send to analytics if enabled
    if (config.FEATURES.ANALYTICS && window.gtag) {
      window.gtag('event', action, {
        event_category: 'User Interaction',
        ...context
      });
    }
  }

  // Business logic logging
  business(event, context = {}) {
    this.info(`Business Event: ${event}`, {
      ...context,
      type: 'business'
    });
  }

  async sendToLogService(logEntry) {
    // Only attempt to send logs if a proper logging service URL is configured
    const loggingServiceUrl = process.env.REACT_APP_LOGGING_SERVICE_URL;
    if (!loggingServiceUrl || loggingServiceUrl === 'your_logging_service_url') {
      return; // Skip sending logs if no proper endpoint is configured
    }

    try {
      await fetch(loggingServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      // Fail silently to avoid infinite loops
      if (this.isDevelopment) {
        console.error('Failed to send log to service:', error);
      }
    }
  }

  storeLocalLog(logEntry) {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      const maxLogs = 100; // Keep only last 100 logs
      
      existingLogs.push(logEntry);
      
      // Keep only the most recent logs
      const trimmedLogs = existingLogs.slice(-maxLogs);
      
      localStorage.setItem('app_logs', JSON.stringify(trimmedLogs));
    } catch (error) {
      // Local storage might be full or unavailable
      if (this.isDevelopment) {
        console.error('Failed to store log locally:', error);
      }
    }
  }

  // Get stored logs for debugging
  getStoredLogs() {
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch {
      return [];
    }
  }

  // Clear stored logs
  clearStoredLogs() {
    try {
      localStorage.removeItem('app_logs');
    } catch {
      // Ignore errors
    }
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;