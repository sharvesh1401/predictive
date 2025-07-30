// 🔒 Security Configuration for EV Routing Simulation
// Comprehensive security settings and policies

export const SECURITY_CONFIG = {
  // API Key Security
  API_KEYS: {
    // Encryption settings
    ENCRYPTION_ALGORITHM: 'AES-256-GCM',
    KEY_DERIVATION_ITERATIONS: 100000,
    SALT_LENGTH: 32,
    IV_LENGTH: 16,
    
    // Validation patterns
    PATTERNS: {
      MAPBOX: /^pk\.[a-zA-Z0-9]{32,}$/,
      DEEPSEEK: /^sk-[a-zA-Z0-9]{32,}$/,
      GROQ: /^gsk_[a-zA-Z0-9]{32,}$/,
      OPENAI: /^sk-[a-zA-Z0-9]{32,}$/,
      GENERIC: /^[a-zA-Z0-9_-]{32,}$/
    },
    
    // Rotation settings
    ROTATION: {
      ENABLED: true,
      INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
      WARNING_THRESHOLD: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
  },

  // Rate Limiting
  RATE_LIMITS: {
    API_CALLS: {
      LIMIT: 100,
      WINDOW: 60 * 1000, // 1 minute
      BURST: 20
    },
    AUTH_ATTEMPTS: {
      LIMIT: 5,
      WINDOW: 15 * 60 * 1000, // 15 minutes
      BURST: 3
    },
    SIMULATION_REQUESTS: {
      LIMIT: 20,
      WINDOW: 60 * 1000, // 1 minute
      BURST: 5
    },
    AI_REQUESTS: {
      LIMIT: 50,
      WINDOW: 60 * 1000, // 1 minute
      BURST: 10
    }
  },

  // Session Security
  SESSION: {
    TIMEOUT: 30 * 60 * 1000, // 30 minutes
    REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
    MAX_SESSIONS: 5,
    CLEANUP_INTERVAL: 10 * 60 * 1000 // 10 minutes
  },

  // Input Validation
  VALIDATION: {
    // Sanitization patterns
    SANITIZATION: {
      HTML_TAGS: /<[^>]*>/g,
      SCRIPT_TAGS: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      JAVASCRIPT_PROTOCOL: /javascript:/gi,
      EVENT_HANDLERS: /on\w+=/gi,
      SQL_INJECTION: /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi,
      XSS_PATTERNS: /(alert|confirm|prompt|eval|document\.|window\.)/gi
    },
    
    // Input length limits
    LENGTH_LIMITS: {
      USER_INPUT: 1000,
      API_RESPONSE: 10000,
      LOG_MESSAGE: 500,
      ERROR_MESSAGE: 200
    },
    
    // Allowed characters
    ALLOWED_CHARS: {
      ALPHANUMERIC: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
      COORDINATES: /^-?\d+\.?\d*$/,
      API_KEY: /^[a-zA-Z0-9_-]+$/
    }
  },

  // Network Security
  NETWORK: {
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
      BACKOFF_MULTIPLIER: 2,
      MAX_DELAY: 10000
    },
    
    // CORS settings
    CORS: {
      ALLOWED_ORIGINS: [
        'https://ev-routing-simulation.vercel.app',
        'https://localhost:3000',
        'https://127.0.0.1:3000'
      ],
      ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE'],
      ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
      CREDENTIALS: true
    }
  },

  // Monitoring and Logging
  MONITORING: {
    // Event logging
    LOGGING: {
      ENABLED: true,
      MAX_EVENTS: 1000,
      RETENTION_PERIOD: 7 * 24 * 60 * 60 * 1000, // 7 days
      LOG_LEVELS: ['info', 'warning', 'error', 'critical']
    },
    
    // Suspicious activity patterns
    SUSPICIOUS_PATTERNS: [
      /sql\s+injection/i,
      /xss/i,
      /csrf/i,
      /script/i,
      /eval\(/i,
      /document\./i,
      /window\./i,
      /alert\(/i,
      /confirm\(/i,
      /prompt\(/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /javascript:/i,
      /vbscript:/i,
      /data:/i,
      /onload/i,
      /onerror/i,
      /onclick/i
    ],
    
    // Alert thresholds
    ALERTS: {
      HIGH_SEVERITY_THRESHOLD: 5,
      RATE_LIMIT_VIOLATIONS: 10,
      SUSPICIOUS_ACTIVITY: 3,
      API_KEY_ABUSE: 1
    }
  },

  // Content Security Policy
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://api.mapbox.com",
      "https://api.deepseek.com",
      "https://api.groq.com"
    ],
    STYLE_SRC: [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com",
      "https://api.mapbox.com"
    ],
    IMG_SRC: [
      "'self'",
      "data:",
      "https:",
      "https://api.mapbox.com"
    ],
    CONNECT_SRC: [
      "'self'",
      "https://api.mapbox.com",
      "https://api.deepseek.com",
      "https://api.groq.com",
      "https://ev-routing-backend.vercel.app"
    ],
    FONT_SRC: [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    OBJECT_SRC: ["'none'"],
    MEDIA_SRC: ["'self'"],
    FRAME_SRC: ["'none'"]
  },

  // Security Headers
  HEADERS: {
    X_FRAME_OPTIONS: 'DENY',
    X_CONTENT_TYPE_OPTIONS: 'nosniff',
    X_XSS_PROTECTION: '1; mode=block',
    REFERRER_POLICY: 'strict-origin-when-cross-origin',
    PERMISSIONS_POLICY: 'geolocation=(), microphone=(), camera=()',
    STRICT_TRANSPORT_SECURITY: 'max-age=31536000; includeSubDomains; preload'
  },

  // Error Handling
  ERROR_HANDLING: {
    // Error messages (generic to avoid information disclosure)
    MESSAGES: {
      GENERIC_ERROR: 'An error occurred. Please try again.',
      AUTH_ERROR: 'Authentication failed. Please check your credentials.',
      RATE_LIMIT_ERROR: 'Too many requests. Please wait before trying again.',
      VALIDATION_ERROR: 'Invalid input. Please check your data.',
      API_ERROR: 'Service temporarily unavailable. Please try again later.',
      SECURITY_ERROR: 'Security violation detected. Access denied.'
    },
    
    // Error logging
    LOGGING: {
      ENABLED: true,
      INCLUDE_STACK_TRACE: false,
      INCLUDE_USER_INFO: false,
      INCLUDE_REQUEST_DATA: false
    }
  },

  // Backup and Recovery
  BACKUP: {
    // API key backup
    API_KEYS: {
      ENABLED: true,
      ENCRYPTED: true,
      LOCATION: 'secure_storage',
      FREQUENCY: 'daily'
    },
    
    // Configuration backup
    CONFIG: {
      ENABLED: true,
      ENCRYPTED: true,
      LOCATION: 'secure_storage',
      FREQUENCY: 'weekly'
    }
  },

  // Compliance
  COMPLIANCE: {
    // GDPR compliance
    GDPR: {
      ENABLED: true,
      DATA_RETENTION: 30 * 24 * 60 * 60 * 1000, // 30 days
      RIGHT_TO_DELETE: true,
      RIGHT_TO_EXPORT: true,
      CONSENT_MANAGEMENT: true
    },
    
    // Privacy settings
    PRIVACY: {
      ANONYMIZE_LOGS: true,
      MINIMIZE_DATA_COLLECTION: true,
      SECURE_DATA_TRANSMISSION: true,
      REGULAR_AUDITS: true
    }
  }
};

// Security Policy Enforcement
export const SECURITY_POLICIES = {
  // API Key Policy
  API_KEY_POLICY: {
    validate: (key, type) => {
      const pattern = SECURITY_CONFIG.API_KEYS.PATTERNS[type] || SECURITY_CONFIG.API_KEYS.PATTERNS.GENERIC;
      return pattern.test(key) && key.length >= 32;
    },
    
    rotate: (key, type) => {
      // Implement key rotation logic
      return true;
    },
    
    encrypt: (key) => {
      // Implement encryption logic
      return key;
    }
  },

  // Rate Limiting Policy
  RATE_LIMIT_POLICY: {
    check: (key, limit, window) => {
      // Implement rate limiting logic
      return true;
    },
    
    reset: (key) => {
      // Implement reset logic
      return true;
    }
  },

  // Input Validation Policy
  INPUT_VALIDATION_POLICY: {
    sanitize: (input) => {
      if (typeof input !== 'string') return input;
      
      return input
        .replace(SECURITY_CONFIG.VALIDATION.SANITIZATION.HTML_TAGS, '')
        .replace(SECURITY_CONFIG.VALIDATION.SANITIZATION.SCRIPT_TAGS, '')
        .replace(SECURITY_CONFIG.VALIDATION.SANITIZATION.JAVASCRIPT_PROTOCOL, '')
        .replace(SECURITY_CONFIG.VALIDATION.SANITIZATION.EVENT_HANDLERS, '')
        .trim();
    },
    
    validate: (input, type) => {
      const limit = SECURITY_CONFIG.VALIDATION.LENGTH_LIMITS[type] || SECURITY_CONFIG.VALIDATION.LENGTH_LIMITS.USER_INPUT;
      return input.length <= limit;
    }
  },

  // Security Monitoring Policy
  MONITORING_POLICY: {
    log: (event, details, severity) => {
      // Implement logging logic
      console.log(`[${severity.toUpperCase()}] ${event}:`, details);
    },
    
    alert: (event, details) => {
      // Implement alerting logic
      console.warn(`[ALERT] ${event}:`, details);
    },
    
    block: (reason) => {
      // Implement blocking logic
      throw new Error(`Access blocked: ${reason}`);
    }
  }
};

// Export configuration
export default SECURITY_CONFIG; 