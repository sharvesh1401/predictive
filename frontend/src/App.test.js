import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock all external dependencies
jest.mock('react-hot-toast', () => ({
  Toaster: () => <div>Toaster</div>,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

jest.mock('./utils/security', () => ({
  initializeSecurity: () => ({
    secretKey: 'test-key',
    secureStorage: { setItem: jest.fn(), getItem: jest.fn(), removeItem: jest.fn(), clear: jest.fn() },
    rateLimiter: { isAllowed: jest.fn(() => true), getRemaining: jest.fn(() => 100), reset: jest.fn() },
    apiKeyManager: { addKey: jest.fn(), getKey: jest.fn(), validateAllKeys: jest.fn(), rotateKey: jest.fn() },
    securityMonitor: { logEvent: jest.fn(), getSecurityReport: jest.fn(() => ({ totalEvents: 0, recentEvents: 0, highSeverityEvents: 0, lastEvent: null })) },
    config: {},
  }),
}));

jest.mock('./services/secureAPI', () => ({
  secureAPIService: {
    validateAPIKeys: () => ({}),
    getSecurityReport: () => ({ totalEvents: 0, recentEvents: 0, highSeverityEvents: 0, lastEvent: null }),
    getRateLimitInfo: () => ({ remaining: 100, limit: 100 }),
  },
}));

jest.mock('./components/SecurityProvider', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
  SecurityStatus: () => <div>Security Status</div>,
  SecurityMonitor: () => <div>Security Monitor</div>,
}));

jest.mock('./store/simulationStore', () => ({
  useSimulationStore: () => ({ isDarkMode: false, routes: [], selectedRoute: null, aiProvider: null }),
}));

jest.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }) => <div>{children}</div>,
}));

jest.mock('./pages/Home', () => () => <div>Home Page</div>);
jest.mock('./pages/Simulation', () => () => <div>Simulation Page</div>);
jest.mock('./pages/Results', () => () => <div>Results Page</div>);
jest.mock('./components/Header', () => () => <div>Header</div>);
jest.mock('./components/Footer', () => () => <div>Footer</div>);
jest.mock('./components/AnimatedBackground', () => () => <div>Animated Background</div>);

test('App component can be rendered without crashing', () => {
  expect(() => {
    render(<App />);
  }).not.toThrow();
}); 