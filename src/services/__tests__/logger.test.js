import logger from '../logger';
import config from '../../config/environment';

// Mock config
jest.mock('../../config/environment', () => ({
  isDevelopment: jest.fn(() => true),
  isProduction: jest.fn(() => false),
  ENVIRONMENT: 'test',
  APP_VERSION: '1.0.0',
  FEATURES: {
    ERROR_REPORTING: false,
    DEBUG_MODE: true,
    ANALYTICS: false
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

describe('Logger Service', () => {
  let consoleSpy;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    consoleSpy = {
      error: jest.spyOn(console, 'error').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      info: jest.spyOn(console, 'info').mockImplementation(() => {}),
      log: jest.spyOn(console, 'log').mockImplementation(() => {}),
    };

    // Setup localStorage mock behavior
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'app_logs') {
        return localStorageMock._storage || '[]';
      }
      return null;
    });
    
    localStorageMock.setItem.mockImplementation((key, value) => {
      if (key === 'app_logs') {
        localStorageMock._storage = value;
      }
    });
    
    localStorageMock.removeItem.mockImplementation((key) => {
      if (key === 'app_logs') {
        delete localStorageMock._storage;
      }
    });

    // Setup sessionStorage mock behavior
    sessionStorageMock.getItem.mockImplementation((key) => {
      if (key === 'sessionId') {
        return sessionStorageMock._sessionId || null;
      }
      return null;
    });
    
    sessionStorageMock.setItem.mockImplementation((key, value) => {
      if (key === 'sessionId') {
        sessionStorageMock._sessionId = value;
      }
    });
  });

  afterEach(() => {
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
    delete localStorageMock._storage;
    delete sessionStorageMock._sessionId;
  });

  describe('basic logging', () => {
    test('logs error messages', () => {
      logger.error('Test error message');
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('logs warning messages', () => {
      logger.warn('Test warning message');
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    test('logs info messages', () => {
      logger.info('Test info message');
      expect(consoleSpy.info).toHaveBeenCalled();
    });

    test('logs debug messages when debug mode is enabled', () => {
      // Ensure debug mode is enabled in the mock config
      config.FEATURES.DEBUG_MODE = true;
      
      // eslint-disable-next-line testing-library/no-debugging-utils
      logger.debug('Test debug message');
      expect(consoleSpy.log).toHaveBeenCalled();
    });
  });

  describe('context logging', () => {
    test('includes context in log messages', () => {
      const context = { userId: '123', action: 'test' };
      logger.info('Test message', context);
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('Test message'),
        context
      );
    });
  });

  describe('performance logging', () => {
    test('logs performance metrics', () => {
      logger.performance('Test Operation', 150);
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('Performance: Test Operation'),
        expect.objectContaining({
          duration: '150ms',
          type: 'performance'
        })
      );
    });
  });

  describe('user action logging', () => {
    test('logs user actions', () => {
      logger.userAction('Button Click', { button: 'submit' });
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('User Action: Button Click'),
        expect.objectContaining({
          button: 'submit',
          type: 'user_action'
        })
      );
    });
  });

  describe('local storage', () => {
    test('stores critical logs locally', () => {
      logger.error('Critical error');
      
      const storedLogs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      expect(storedLogs).toHaveLength(1);
      expect(storedLogs[0]).toMatchObject({
        level: 'error',
        message: 'Critical error'
      });
    });

    test('limits stored logs to maximum count', () => {
      // Generate more than 100 logs
      for (let i = 0; i < 105; i++) {
        logger.error(`Error ${i}`);
      }
      
      const storedLogs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      expect(storedLogs).toHaveLength(100);
    });
  });

  describe('session management', () => {
    test('generates and maintains session ID', () => {
      const firstSessionId = logger.getSessionId();
      const secondSessionId = logger.getSessionId();
      
      expect(firstSessionId).toBe(secondSessionId);
      expect(typeof firstSessionId).toBe('string');
      expect(firstSessionId.length).toBeGreaterThan(0);
    });
  });

  describe('stored logs management', () => {
    test('retrieves stored logs', () => {
      logger.error('Test error for retrieval');
      const logs = logger.getStoredLogs();
      
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe('Test error for retrieval');
    });

    test('clears stored logs', () => {
      logger.error('Test error to be cleared');
      logger.clearStoredLogs();
      
      const logs = logger.getStoredLogs();
      expect(logs).toHaveLength(0);
    });
  });

  describe('Sentry integration', () => {
    test('calls Sentry when available and enabled', () => {
      window.Sentry = {
        withScope: jest.fn((callback) => callback({
          setTag: jest.fn()
        })),
        captureMessage: jest.fn()
      };
      
      config.FEATURES.ERROR_REPORTING = true;
      
      logger.error('Test Sentry error');
      
      expect(window.Sentry.withScope).toHaveBeenCalled();
      expect(window.Sentry.captureMessage).toHaveBeenCalledWith('Test Sentry error', 'error');
    });
  });
});