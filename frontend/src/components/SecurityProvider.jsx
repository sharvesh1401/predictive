import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeSecurity } from '../utils/security';
import { secureAPIService } from '../services/secureAPI';
import toast from 'react-hot-toast';

// Security Context
const SecurityContext = createContext();

// Security Provider Component
export const SecurityProvider = ({ children }) => {
  const [security, setSecurity] = useState(null);
  const [securityStatus, setSecurityStatus] = useState({
    initialized: false,
    apiKeysValid: false,
    rateLimitStatus: 'ok',
    lastSecurityCheck: null
  });

  // Initialize security on component mount
  useEffect(() => {
    const initSecurity = async () => {
      try {
        // Initialize security components
        const securityComponents = initializeSecurity();
        setSecurity(securityComponents);

        // Validate API keys
        const apiKeyValidation = secureAPIService.validateAPIKeys();
        const allKeysValid = Object.values(apiKeyValidation).every(key => key.valid);

        setSecurityStatus(prev => ({
          ...prev,
          initialized: true,
          apiKeysValid: allKeysValid,
          lastSecurityCheck: Date.now()
        }));

        // Log security initialization
        securityComponents.securityMonitor.logEvent('security_provider_initialized', {
          apiKeysValid: allKeysValid,
          timestamp: Date.now()
        }, 'info');

        // Show security status
        if (allKeysValid) {
          toast.success('🔒 Security system initialized successfully');
        } else {
          toast.error('⚠️ Some API keys are invalid. Please check configuration.');
        }

      } catch (error) {
        console.error('Security initialization failed:', error);
        toast.error('❌ Security system initialization failed');
        
        security?.securityMonitor?.logEvent('security_initialization_failed', {
          error: error.message,
          timestamp: Date.now()
        }, 'high');
      }
    };

    initSecurity();
  }, []);

  // Periodic security checks
  useEffect(() => {
    if (!security) return;

    const securityCheckInterval = setInterval(async () => {
      try {
        // Get security report
        const securityReport = secureAPIService.getSecurityReport();
        
        // Check for high severity events
        if (securityReport.highSeverityEvents > 0) {
          toast.error(`🚨 ${securityReport.highSeverityEvents} security events detected`);
        }

        // Validate API keys periodically
        const apiKeyValidation = secureAPIService.validateAPIKeys();
        const allKeysValid = Object.values(apiKeyValidation).every(key => key.valid);

        setSecurityStatus(prev => ({
          ...prev,
          apiKeysValid: allKeysValid,
          lastSecurityCheck: Date.now()
        }));

        // Log security check
        security.securityMonitor.logEvent('periodic_security_check', {
          highSeverityEvents: securityReport.highSeverityEvents,
          apiKeysValid: allKeysValid,
          timestamp: Date.now()
        }, 'info');

      } catch (error) {
        console.error('Periodic security check failed:', error);
        security.securityMonitor.logEvent('periodic_security_check_failed', {
          error: error.message,
          timestamp: Date.now()
        }, 'high');
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(securityCheckInterval);
  }, [security]);

  // Monitor for suspicious activity
  useEffect(() => {
    if (!security) return;

    const handleBeforeUnload = () => {
      security.securityMonitor.logEvent('user_session_ended', {
        timestamp: Date.now()
      }, 'info');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        security.securityMonitor.logEvent('user_session_paused', {
          timestamp: Date.now()
        }, 'info');
      } else {
        security.securityMonitor.logEvent('user_session_resumed', {
          timestamp: Date.now()
        }, 'info');
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [security]);

  // Security context value
  const securityContextValue = {
    security,
    securityStatus,
    validateAPIKeys: () => secureAPIService.validateAPIKeys(),
    getSecurityReport: () => secureAPIService.getSecurityReport(),
    getRateLimitInfo: (key) => secureAPIService.getRateLimitInfo(key),
    logSecurityEvent: (type, details, severity = 'info') => {
      security?.securityMonitor?.logEvent(type, details, severity);
    }
  };

  return (
    <SecurityContext.Provider value={securityContextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

// Security Hook
export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

// Security Status Component
export const SecurityStatus = () => {
  const { securityStatus } = useSecurity();

  if (!securityStatus.initialized) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm">
          🔒 Initializing Security...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-3 py-1 rounded-lg text-sm ${
        securityStatus.apiKeysValid 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        {securityStatus.apiKeysValid ? '🔒 Secure' : '⚠️ Security Issue'}
      </div>
    </div>
  );
};

// Security Monitor Component (for development)
export const SecurityMonitor = () => {
  const { getSecurityReport, validateAPIKeys } = useSecurity();
  const [showMonitor, setShowMonitor] = useState(false);
  const [securityData, setSecurityData] = useState(null);

  const refreshData = () => {
    const report = getSecurityReport();
    const apiKeys = validateAPIKeys();
    setSecurityData({ report, apiKeys });
  };

  useEffect(() => {
    if (showMonitor) {
      refreshData();
      const interval = setInterval(refreshData, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [showMonitor]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowMonitor(!showMonitor)}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
      >
        🔒 Security Monitor
      </button>

      {showMonitor && (
        <div className="fixed bottom-16 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg max-w-md text-xs">
          <h3 className="font-bold mb-2">Security Monitor</h3>
          {securityData && (
            <div className="space-y-2">
              <div>
                <strong>Events (24h):</strong> {securityData.report.recentEvents}
              </div>
              <div>
                <strong>High Severity:</strong> {securityData.report.highSeverityEvents}
              </div>
              <div>
                <strong>API Keys Valid:</strong> {
                  Object.values(securityData.apiKeys).every(key => key.valid) ? 'Yes' : 'No'
                }
              </div>
              <button
                onClick={refreshData}
                className="bg-blue-500 px-2 py-1 rounded text-xs"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SecurityProvider; 