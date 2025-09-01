// Environment configuration with fallbacks
const config = {
  // App Configuration
  APP_NAME: process.env.REACT_APP_NAME || 'TileCraft Premium',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || 'development',
  
  // API Configuration
  API: {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
    TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  },
  
  // Monitoring and Analytics
  MONITORING: {
    SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN || '',
    GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || '',
    HOTJAR_ID: process.env.REACT_APP_HOTJAR_ID || '',
  },
  
  // Feature Flags
  FEATURES: {
    ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    ERROR_REPORTING: process.env.REACT_APP_ENABLE_ERROR_REPORTING === 'true',
    PERFORMANCE_MONITORING: process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true',
    DEBUG_MODE: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
    SERVICE_WORKER: process.env.REACT_APP_ENABLE_SERVICE_WORKER === 'true',
  },
  
  // Contact Information
  CONTACT: {
    SUPPORT_EMAIL: process.env.REACT_APP_SUPPORT_EMAIL || 'support@tilecraftpremium.com',
    SALES_EMAIL: process.env.REACT_APP_SALES_EMAIL || 'sales@tilecraftpremium.com',
    PHONE: process.env.REACT_APP_PHONE || '+1-555-123-4567',
  },
  
  // Social Media
  SOCIAL: {
    LINKEDIN_URL: process.env.REACT_APP_LINKEDIN_URL || 'https://linkedin.com/company/tilecraft-premium',
    INSTAGRAM_URL: process.env.REACT_APP_INSTAGRAM_URL || 'https://instagram.com/tilecraftpremium',
    FACEBOOK_URL: process.env.REACT_APP_FACEBOOK_URL || 'https://facebook.com/tilecraftpremium',
  },
  
  // Security
  SECURITY: {
    ENABLE_CSP: process.env.REACT_APP_ENABLE_CSP === 'true',
    ALLOWED_DOMAINS: (process.env.REACT_APP_ALLOWED_DOMAINS || 'localhost,127.0.0.1').split(','),
  },
  
  // Performance
  PERFORMANCE: {
    IMAGE_CDN_URL: process.env.REACT_APP_IMAGE_CDN_URL || '',
    CACHE_DURATION: parseInt(process.env.REACT_APP_CACHE_DURATION) || 0,
  },
  
  // Helper methods
  isDevelopment: () => config.ENVIRONMENT === 'development',
  isProduction: () => config.ENVIRONMENT === 'production',
  isStaging: () => config.ENVIRONMENT === 'staging',
};

// Validate required configuration in production
if (config.isProduction()) {
  const requiredVars = [
    'REACT_APP_API_BASE_URL',
    'REACT_APP_SENTRY_DSN',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables in production:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export default config;