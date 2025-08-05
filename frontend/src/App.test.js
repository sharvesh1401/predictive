import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

// Mock the security utilities
jest.mock('./utils/security', () => ({
  initializeSecurity: () => ({
    secretKey: 'test-key',
    secureStorage: {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    rateLimiter: {
      isAllowed: jest.fn(() => true),
      getRemaining: jest.fn(() => 100),
      reset: jest.fn(),
    },
    apiKeyManager: {
      addKey: jest.fn(),
      getKey: jest.fn(),
      validateAllKeys: jest.fn(),
      rotateKey: jest.fn(),
    },
    securityMonitor: {
      logEvent: jest.fn(),
      getSecurityReport: jest.fn(() => ({
        totalEvents: 0,
        recentEvents: 0,
        highSeverityEvents: 0,
        lastEvent: null,
      })),
    },
    config: {},
  }),
}));

// Mock the secure API service
jest.mock('./services/secureAPI', () => ({
  secureAPIService: {
    validateAPIKeys: () => ({}),
    getSecurityReport: () => ({
      totalEvents: 0,
      recentEvents: 0,
      highSeverityEvents: 0,
      lastEvent: null,
    }),
    getRateLimitInfo: () => ({ remaining: 100, limit: 100 }),
  },
}));

// Mock the components that might cause issues in tests
jest.mock('./components/SecurityProvider', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="security-provider">{children}</div>,
  SecurityStatus: () => <div data-testid="security-status">Security Status</div>,
  SecurityMonitor: () => <div data-testid="security-monitor">Security Monitor</div>,
}));

jest.mock('./store/simulationStore', () => ({
  useSimulationStore: () => ({
    isDarkMode: false,
    routes: [],
    selectedRoute: null,
    aiProvider: null,
  }),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <div>{children}</div>,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

test('renders app without crashing', () => {
  renderWithRouter(<App />);
  expect(screen.getByTestId('security-provider')).toBeInTheDocument();
});

test('renders security components', () => {
  renderWithRouter(<App />);
  expect(screen.getByTestId('security-status')).toBeInTheDocument();
  expect(screen.getByTestId('security-monitor')).toBeInTheDocument();
});

test('renders toaster component', () => {
  renderWithRouter(<App />);
  expect(screen.getByTestId('toaster')).toBeInTheDocument();
}); 