// 🔒 Secure API Service for EV Routing Simulation
// Implements maximum security for API communications

import axios from 'axios';
import { 
  initializeSecurity, 
  validateAPIKey, 
  sanitizeInput,
  generateCSRFToken,
  validateCSRFToken,
  SECURITY_CONFIG 
} from '../utils/security';

// Initialize security components
const security = initializeSecurity();

// Secure API Configuration
const API_CONFIG = {
  // Base URLs with fallbacks
  BASE_URLS: {
    MAPBOX: 'https://api.mapbox.com',
    DEEPSEEK: 'https://api.deepseek.com',
    GROQ: 'https://api.groq.com',
    BACKEND: process.env.REACT_APP_API_URL || 'https://ev-routing-backend.vercel.app'
  },
  
  // Request timeouts
  TIMEOUTS: {
    SHORT: 10000,    // 10 seconds
    MEDIUM: 30000,   // 30 seconds
    LONG: 60000      // 60 seconds
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
    BACKOFF_MULTIPLIER: 2
  }
};

// Secure API Key Management
class SecureAPIKeyManager {
  constructor() {
    this.keys = new Map();
    this.encryptedKeys = new Map();
    this.initializeKeys();
  }

  // Initialize API keys with encryption
  initializeKeys() {
    try {
      let keysInitialized = 0;

      // Mapbox API Key
      const mapboxKey = process.env.REACT_APP_MAPBOX_TOKEN;
      if (mapboxKey && mapboxKey !== 'your_mapbox_token_here') {
        this.addKey('mapbox', mapboxKey, 'MAPBOX');
        keysInitialized++;
      } else {
        console.warn('Mapbox API key not configured. Map functionality will be limited.');
      }

      // DeepSeek API Key
      const deepseekKey = process.env.REACT_APP_DEEPSEEK_API_KEY;
      if (deepseekKey && deepseekKey !== 'your_deepseek_api_key_here') {
        this.addKey('deepseek', deepseekKey, 'DEEPSEEK');
        keysInitialized++;
      } else {
        console.warn('DeepSeek API key not configured. AI navigation will use fallback.');
      }

      // Groq API Key
      const groqKey = process.env.REACT_APP_GROQ_API_KEY;
      if (groqKey && groqKey !== 'your_groq_api_key_here') {
        this.addKey('groq', groqKey, 'GROQ');
        keysInitialized++;
      } else {
        console.warn('Groq API key not configured. AI navigation will use fallback.');
      }

      security.securityMonitor.logEvent('api_keys_initialized', {
        keysCount: keysInitialized,
        timestamp: Date.now()
      }, 'info');

      // Log configuration status
      if (keysInitialized === 0) {
        console.warn('No API keys configured. Please set environment variables for full functionality.');
      } else {
        console.log(`Successfully initialized ${keysInitialized} API keys.`);
      }

    } catch (error) {
      security.securityMonitor.logEvent('api_key_initialization_failed', {
        error: error.message,
        timestamp: Date.now()
      }, 'high');
      console.error('API key initialization failed:', error.message);
    }
  }

  // Add API key with validation and encryption
  addKey(name, key, type) {
    try {
      // Validate API key format
      const validation = validateAPIKey(key, type);
      if (!validation.valid) {
        throw new Error(`Invalid API key for ${name}: ${validation.error}`);
      }

      // Store encrypted key
      const encryptedKey = security.secureStorage.setItem(`api_key_${name}`, key);
      if (!encryptedKey) {
        throw new Error(`Failed to encrypt API key for ${name}`);
      }

      // Store key metadata
      this.keys.set(name, {
        type,
        added: Date.now(),
        lastUsed: null,
        usageCount: 0,
        isValid: true
      });

      security.securityMonitor.logEvent('api_key_added', {
        name,
        type,
        timestamp: Date.now()
      }, 'info');

    } catch (error) {
      security.securityMonitor.logEvent('api_key_add_failed', {
        name,
        error: error.message,
        timestamp: Date.now()
      }, 'high');
      throw error;
    }
  }

  // Get API key with usage tracking
  getKey(name) {
    try {
      // Check if key exists
      const keyData = this.keys.get(name);
      if (!keyData) {
        throw new Error(`API key '${name}' not configured. Please set the environment variable.`);
      }

      // Check rate limiting
      const rateLimitKey = `api_key_${name}`;
      if (!security.rateLimiter.isAllowed(rateLimitKey, SECURITY_CONFIG.RATE_LIMITS.API_CALLS)) {
        throw new Error(`Rate limit exceeded for API key: ${name}`);
      }

      // Retrieve encrypted key
      const key = security.secureStorage.getItem(`api_key_${name}`);
      if (!key) {
        throw new Error(`API key not found: ${name}`);
      }

      // Update usage statistics
      if (keyData) {
        keyData.lastUsed = Date.now();
        keyData.usageCount++;
      }

      security.securityMonitor.logEvent('api_key_used', {
        name,
        timestamp: Date.now()
      }, 'info');

      return key;

    } catch (error) {
      security.securityMonitor.logEvent('api_key_retrieval_failed', {
        name,
        error: error.message,
        timestamp: Date.now()
      }, 'high');
      throw error;
    }
  }

  // Validate all API keys
  validateAllKeys() {
    const results = {};
    
    for (const [name, keyData] of this.keys) {
      try {
        const key = this.getKey(name);
        const validation = validateAPIKey(key, keyData.type);
        results[name] = {
          valid: validation.valid,
          error: validation.error || null,
          lastUsed: keyData.lastUsed,
          usageCount: keyData.usageCount
        };
      } catch (error) {
        results[name] = {
          valid: false,
          error: error.message,
          lastUsed: keyData.lastUsed,
          usageCount: keyData.usageCount
        };
      }
    }

    return results;
  }

  // Rotate API keys
  rotateKey(name, newKey, type) {
    try {
      // Validate new key
      const validation = validateAPIKey(newKey, type);
      if (!validation.valid) {
        throw new Error(`Invalid new API key: ${validation.error}`);
      }

      // Store new encrypted key
      const encryptedKey = security.secureStorage.setItem(`api_key_${name}`, newKey);
      if (!encryptedKey) {
        throw new Error(`Failed to encrypt new API key for ${name}`);
      }

      // Update key metadata
      const keyData = this.keys.get(name);
      if (keyData) {
        keyData.added = Date.now();
        keyData.lastUsed = null;
        keyData.usageCount = 0;
        keyData.type = type;
      }

      security.securityMonitor.logEvent('api_key_rotated', {
        name,
        type,
        timestamp: Date.now()
      }, 'info');

      return true;

    } catch (error) {
      security.securityMonitor.logEvent('api_key_rotation_failed', {
        name,
        error: error.message,
        timestamp: Date.now()
      }, 'high');
      throw error;
    }
  }
}

// Secure HTTP Client
class SecureHTTPClient {
  constructor() {
    this.client = axios.create({
      timeout: API_CONFIG.TIMEOUTS.MEDIUM,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    this.setupInterceptors();
  }

  // Setup request/response interceptors
  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add CSRF token
        const csrfToken = generateCSRFToken();
        config.headers['X-CSRF-Token'] = csrfToken;

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Sanitize request data
        if (config.data) {
          config.data = this.sanitizeRequestData(config.data);
        }

        // Log request
        security.securityMonitor.logEvent('api_request', {
          url: config.url,
          method: config.method,
          timestamp: Date.now()
        }, 'info');

        return config;
      },
      (error) => {
        security.securityMonitor.logEvent('api_request_error', {
          error: error.message,
          timestamp: Date.now()
        }, 'high');
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Validate CSRF token
        const csrfToken = response.headers['x-csrf-token'];
        if (csrfToken && !validateCSRFToken(csrfToken, response.config.headers['X-CSRF-Token'])) {
          throw new Error('CSRF token validation failed');
        }

        // Log successful response
        security.securityMonitor.logEvent('api_response', {
          url: response.config.url,
          status: response.status,
          timestamp: Date.now()
        }, 'info');

        return response;
      },
      (error) => {
        // Handle different types of errors
        if (error.response) {
          // Server responded with error status
          security.securityMonitor.logEvent('api_response_error', {
            url: error.config?.url,
            status: error.response.status,
            error: error.response.data,
            timestamp: Date.now()
          }, 'medium');
        } else if (error.request) {
          // Request was made but no response received
          security.securityMonitor.logEvent('api_timeout_error', {
            url: error.config?.url,
            error: 'Request timeout',
            timestamp: Date.now()
          }, 'medium');
        } else {
          // Something else happened
          security.securityMonitor.logEvent('api_unknown_error', {
            error: error.message,
            timestamp: Date.now()
          }, 'high');
        }

        return Promise.reject(error);
      }
    );
  }

  // Generate unique request ID
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Sanitize request data
  sanitizeRequestData(data) {
    if (typeof data === 'string') {
      return sanitizeInput(data);
    }
    
    if (typeof data === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[sanitizeInput(key)] = this.sanitizeRequestData(value);
      }
      return sanitized;
    }
    
    return data;
  }

  // Make secure API request
  async makeRequest(config) {
    try {
      // Check rate limiting
      const rateLimitKey = `api_request_${config.url}`;
      if (!security.rateLimiter.isAllowed(rateLimitKey, SECURITY_CONFIG.RATE_LIMITS.API_CALLS)) {
        throw new Error('API rate limit exceeded');
      }

      // Add security headers
      config.headers = {
        ...config.headers,
        'X-Security-Token': security.secretKey,
        'X-Client-Version': '1.0.0',
        'X-Request-Timestamp': Date.now().toString()
      };

      // Make request with retry logic
      return await this.retryRequest(config);

    } catch (error) {
      security.securityMonitor.logEvent('secure_request_failed', {
        url: config.url,
        error: error.message,
        timestamp: Date.now()
      }, 'high');
      throw error;
    }
  }

  // Retry request with exponential backoff
  async retryRequest(config, attempt = 1) {
    try {
      return await this.client(config);
    } catch (error) {
      if (attempt >= API_CONFIG.RETRY.MAX_ATTEMPTS) {
        throw error;
      }

      // Wait before retry
      const delay = API_CONFIG.RETRY.DELAY * Math.pow(API_CONFIG.RETRY.BACKOFF_MULTIPLIER, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));

      return this.retryRequest(config, attempt + 1);
    }
  }
}

// Initialize secure components
const secureAPIKeyManager = new SecureAPIKeyManager();
const secureHTTPClient = new SecureHTTPClient();

// Secure API Service
export const secureAPIService = {
  // Mapbox API
  async getMapboxData(endpoint, params = {}) {
    try {
      const apiKey = secureAPIKeyManager.getKey('mapbox');
      
      const response = await secureHTTPClient.makeRequest({
        url: `${API_CONFIG.BASE_URLS.MAPBOX}${endpoint}`,
        method: 'GET',
        params: {
          ...params,
          access_token: apiKey
        }
      });

      return response.data;
    } catch (error) {
      security.securityMonitor.logEvent('mapbox_api_error', {
        endpoint,
        error: error.message,
        timestamp: Date.now()
      }, 'high');
      throw error;
    }
  },

  // DeepSeek AI API
  async callDeepSeekAPI(prompt, options = {}) {
    try {
      const apiKey = secureAPIKeyManager.getKey('deepseek');
      
      const response = await secureHTTPClient.makeRequest({
        url: `${API_CONFIG.BASE_URLS.DEEPSEEK}/v1/chat/completions`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are an expert EV navigation assistant. Provide accurate, practical routing advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
          ...options
        }
      });

      return response.data;
    } catch (error) {
      security.securityMonitor.logEvent('deepseek_api_error', {
        error: error.message,
        timestamp: Date.now()
      }, 'high');
      throw error;
    }
  },

  // Groq AI API
  async callGroqAPI(prompt, options = {}) {
    try {
      const apiKey = secureAPIKeyManager.getKey('groq');
      
      const response = await secureHTTPClient.makeRequest({
        url: `${API_CONFIG.BASE_URLS.GROQ}/openai/v1/chat/completions`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are an expert EV navigation assistant. Provide accurate, practical routing advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
          ...options
        }
      });

      return response.data;
    } catch (error) {
      security.securityMonitor.logEvent('groq_api_error', {
        error: error.message,
        timestamp: Date.now()
      }, 'high');
      throw error;
    }
  },

  // Backend API
  async callBackendAPI(endpoint, method = 'GET', data = null) {
    try {
      const response = await secureHTTPClient.makeRequest({
        url: `${API_CONFIG.BASE_URLS.BACKEND}${endpoint}`,
        method,
        data,
        headers: {
          'X-API-Version': '1.0',
          'X-Client-ID': 'ev-routing-frontend'
        }
      });

      return response.data;
    } catch (error) {
      security.securityMonitor.logEvent('backend_api_error', {
        endpoint,
        method,
        error: error.message,
        timestamp: Date.now()
      }, 'high');
      throw error;
    }
  },

  // Security utilities
  getSecurityReport() {
    return security.securityMonitor.getSecurityReport();
  },

  validateAPIKeys() {
    return secureAPIKeyManager.validateAllKeys();
  },

  rotateAPIKey(name, newKey, type) {
    return secureAPIKeyManager.rotateKey(name, newKey, type);
  },

  getRateLimitInfo(key) {
    return {
      remaining: security.rateLimiter.getRemaining(key, SECURITY_CONFIG.RATE_LIMITS.API_CALLS),
      limit: SECURITY_CONFIG.RATE_LIMITS.API_CALLS
    };
  }
};

// Export security components for external use
export { security, secureAPIKeyManager, secureHTTPClient }; 