import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

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