import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    // Required for IntersectionObserver API
  }
  
  disconnect() {}
  
  observe() {}
  
  unobserve() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockStorage
});

Object.defineProperty(window, 'sessionStorage', {
  value: mockStorage
});

// Mock fetch
global.fetch = jest.fn();

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
  }
});

// Mock Sentry
window.Sentry = {
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  withScope: jest.fn((callback) => callback({
    setTag: jest.fn(),
    setContext: jest.fn(),
  })),
  setUser: jest.fn(),
  setContext: jest.fn(),
  addBreadcrumb: jest.fn(),
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Custom test utilities
export const mockTileData = [
  {
    series: 'Test Series',
    material: 'Test Material',
    size: '60X60',
    type: 'GP',
    surface: 'Matt',
    peiRating: 'Class 4',
    category: 'Test Category',
    application: ['Floor', 'Wall'],
    qty: 1000
  }
];

export const renderWithProviders = (ui, options = {}) => {
  const { render } = require('@testing-library/react');
  return render(ui, options);
};