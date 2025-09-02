const config = {
  APP_NAME: process.env.REACT_APP_NAME || 'Blue Cascade Ceramics',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development',

  API: {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://api.bluecascadeceramics.com',
    TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10),
  },

  FEATURES: {
    ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    ERROR_REPORTING: process.env.REACT_APP_ENABLE_ERROR_REPORTING === 'true',
    PERFORMANCE_MONITORING: process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true',
    DEBUG_MODE: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
  },

  MONITORING: {
    SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
    GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
  },

  SECURITY: {
    ENABLE_CSP: process.env.REACT_APP_ENABLE_CSP === 'true',
    ALLOWED_DOMAINS: process.env.REACT_APP_ALLOWED_DOMAINS ? process.env.REACT_APP_ALLOWED_DOMAINS.split(',') : [],
  },

  SOCIAL: {
    LINKEDIN_URL: process.env.REACT_APP_LINKEDIN_URL || 'https://linkedin.com/company/blue-cascade-ceramics',
    INSTAGRAM_URL: process.env.REACT_APP_INSTAGRAM_URL || 'https://instagram.com/bluecascadeceramics',
    FACEBOOK_URL: process.env.REACT_APP_FACEBOOK_URL || 'https://facebook.com/bluecascadeceramics',
  },

  CONTACT: {
    SUPPORT_EMAIL: process.env.REACT_APP_SUPPORT_EMAIL || 'support@bluecascadeceramics.com',
    SALES_EMAIL: process.env.REACT_APP_SALES_EMAIL || 'sales@bluecascadeceramics.com',
    PHONE: process.env.REACT_APP_PHONE || '+1-555-123-4567',
  },
};

// Add helper functions separately to prevent potential issues with 'this' context during build.
config.isDevelopment = () => config.ENVIRONMENT === 'development';
config.isProduction = () => config.ENVIRONMENT === 'production';
config.isTest = () => config.ENVIRONMENT === 'test';

export default config;