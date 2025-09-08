// API Configuration based on environment
const config = {
  development: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
    API_TIMEOUT: 10000,
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://www.bluecascadeceramics.com/api',
    API_TIMEOUT: 15000,
  },
};

const currentConfig = config[process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || 'development'];

export const API_BASE_URL = currentConfig.API_BASE_URL;
export const API_TIMEOUT = currentConfig.API_TIMEOUT;

export default currentConfig;