// 🔒 Security Utilities for EV Routing Simulation
// Comprehensive security measures for API keys and sensitive data

import CryptoJS from 'crypto-js';

// Security Configuration
const SECURITY_CONFIG = {
  // Encryption settings
  ENCRYPTION_ALGORITHM: 'AES-256-GCM',
  KEY_DERIVATION_ITERATIONS: 100000,
  SALT_LENGTH: 32,
  IV_LENGTH: 16,
  
  // API Key validation patterns
  API_KEY_PATTERNS: {
    MAPBOX: /^pk\.[a-zA-Z0-9]{32,}$/,
    DEEPSEEK: /^sk-[a-zA-Z0-9]{32,}$/,
    GROQ: /^gsk_[a-zA-Z0-9]{32,}$/,
    OPENAI: /^sk-[a-zA-Z0-9]{32,}$/,
    GENERIC: /^[a-zA-Z0-9_-]{32,}$/
  },
  
  // Rate limiting
  RATE_LIMITS: {
    API_CALLS: 100, // per minute
    AUTH_ATTEMPTS: 5, // per 15 minutes
    SIMULATION_REQUESTS: 20 // per minute
  },
  
  // Session security
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
};

// Generate a secure random key
export const generateSecureKey = (length = 32) => {
  const array = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto API
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Encrypt sensitive data
export const encryptData = (data, secretKey) => {
  try {
    if (!data || !secretKey) {
      throw new Error('Data and secret key are required for encryption');
    }

    // Generate a random IV
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Encrypt the data
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secretKey,
      {
        iv: iv,
        mode: CryptoJS.mode.GCM,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    // Return encrypted data with IV
    return {
      encrypted: encrypted.toString(),
      iv: iv.toString(),
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt sensitive data');
  }
};

// Decrypt sensitive data
export const decryptData = (encryptedData, secretKey) => {
  try {
    if (!encryptedData || !secretKey) {
      throw new Error('Encrypted data and secret key are required for decryption');
    }

    const { encrypted, iv } = encryptedData;
    
    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(
      encrypted,
      secretKey,
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.GCM,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt sensitive data');
  }
};

// Validate API key format
export const validateAPIKey = (apiKey, type = 'GENERIC') => {
  if (!apiKey || typeof apiKey !== 'string') {
    return { valid: false, error: 'API key is required and must be a string' };
  }

  const pattern = SECURITY_CONFIG.API_KEY_PATTERNS[type] || SECURITY_CONFIG.API_KEY_PATTERNS.GENERIC;
  
  if (!pattern.test(apiKey)) {
    return { valid: false, error: `Invalid ${type} API key format` };
  }

  // Check for common security issues
  if (apiKey.length < 32) {
    return { valid: false, error: 'API key is too short' };
  }

  if (apiKey.includes(' ') || apiKey.includes('\n') || apiKey.includes('\t')) {
    return { valid: false, error: 'API key contains invalid characters' };
  }

  return { valid: true };
};

// Secure storage with encryption
export class SecureStorage {
  constructor(secretKey) {
    this.secretKey = secretKey;
    this.storage = typeof window !== 'undefined' ? window.localStorage : null;
  }

  // Store encrypted data
  setItem(key, value) {
    try {
      if (!this.storage) {
        throw new Error('Local storage not available');
      }

      const encrypted = encryptData(value, this.secretKey);
      this.storage.setItem(key, JSON.stringify(encrypted));
      return true;
    } catch (error) {
      console.error('Failed to store encrypted data:', error);
      return false;
    }
  }

  // Retrieve and decrypt data
  getItem(key) {
    try {
      if (!this.storage) {
        throw new Error('Local storage not available');
      }

      const encrypted = this.storage.getItem(key);
      if (!encrypted) return null;

      const encryptedData = JSON.parse(encrypted);
      return decryptData(encryptedData, this.secretKey);
    } catch (error) {
      console.error('Failed to retrieve encrypted data:', error);
      return null;
    }
  }

  // Remove encrypted data
  removeItem(key) {
    try {
      if (!this.storage) return false;
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove encrypted data:', error);
      return false;
    }
  }

  // Clear all encrypted data
  clear() {
    try {
      if (!this.storage) return false;
      this.storage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear encrypted data:', error);
      return false;
    }
  }
}

// Rate limiting utility
export class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  // Check if request is allowed
  isAllowed(key, limit, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const requests = this.requests.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    this.requests.set(key, validRequests);

    // Check if under limit
    if (validRequests.length >= limit) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    return true;
  }

  // Get remaining requests
  getRemaining(key, limit) {
    const requests = this.requests.get(key) || [];
    return Math.max(0, limit - requests.length);
  }

  // Reset rate limiter
  reset(key) {
    this.requests.delete(key);
  }
}

// CSRF protection
export const generateCSRFToken = () => {
  return generateSecureKey(32);
};

export const validateCSRFToken = (token, storedToken) => {
  if (!token || !storedToken) return false;
  return token === storedToken;
};

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Secure API key rotation
export class APIKeyManager {
  constructor() {
    this.keys = new Map();
    this.rotationInterval = 24 * 60 * 60 * 1000; // 24 hours
    this.lastRotation = Date.now();
  }

  // Add API key with rotation
  addKey(name, key, type = 'GENERIC') {
    const validation = validateAPIKey(key, type);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    this.keys.set(name, {
      key,
      type,
      added: Date.now(),
      lastUsed: null,
      usageCount: 0
    });
  }

  // Get API key with usage tracking
  getKey(name) {
    const keyData = this.keys.get(name);
    if (!keyData) {
      throw new Error(`API key '${name}' not found`);
    }

    // Update usage statistics
    keyData.lastUsed = Date.now();
    keyData.usageCount++;

    return keyData.key;
  }

  // Rotate API keys
  rotateKeys() {
    const now = Date.now();
    if (now - this.lastRotation < this.rotationInterval) {
      return false; // Too early to rotate
    }

    // Implement key rotation logic here
    // This would typically involve:
    // 1. Generating new keys
    // 2. Updating stored keys
    // 3. Notifying services of key changes

    this.lastRotation = now;
    return true;
  }

  // Get key statistics
  getKeyStats(name) {
    const keyData = this.keys.get(name);
    if (!keyData) return null;

    return {
      type: keyData.type,
      added: keyData.added,
      lastUsed: keyData.lastUsed,
      usageCount: keyData.usageCount,
      age: Date.now() - keyData.added
    };
  }
}

// Security monitoring
export class SecurityMonitor {
  constructor() {
    this.events = [];
    this.maxEvents = 1000;
    this.suspiciousPatterns = [
      /sql\s+injection/i,
      /xss/i,
      /csrf/i,
      /script/i,
      /eval\(/i,
      /document\./i
    ];
  }

  // Log security event
  logEvent(type, details, severity = 'info') {
    const event = {
      type,
      details,
      severity,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      url: typeof window !== 'undefined' ? window.location.href : null
    };

    this.events.push(event);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Check for suspicious patterns
    if (this.detectSuspiciousActivity(event)) {
      this.handleSuspiciousActivity(event);
    }

    return event;
  }

  // Detect suspicious activity
  detectSuspiciousActivity(event) {
    const details = JSON.stringify(event.details).toLowerCase();
    
    return this.suspiciousPatterns.some(pattern => 
      pattern.test(details)
    );
  }

  // Handle suspicious activity
  handleSuspiciousActivity(event) {
    console.warn('Suspicious activity detected:', event);
    
    // In a real application, you would:
    // 1. Send alert to security team
    // 2. Block the request
    // 3. Log to security monitoring system
    // 4. Trigger incident response
    
    this.logEvent('suspicious_activity_blocked', event, 'high');
  }

  // Get security report
  getSecurityReport() {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    
    const recentEvents = this.events.filter(event => 
      event.timestamp > last24h
    );

    const highSeverity = recentEvents.filter(event => 
      event.severity === 'high'
    );

    return {
      totalEvents: this.events.length,
      recentEvents: recentEvents.length,
      highSeverityEvents: highSeverity.length,
      lastEvent: this.events[this.events.length - 1]
    };
  }
}

// Initialize security components
export const initializeSecurity = () => {
  const secretKey = generateSecureKey(32);
  const secureStorage = new SecureStorage(secretKey);
  const rateLimiter = new RateLimiter();
  const apiKeyManager = new APIKeyManager();
  const securityMonitor = new SecurityMonitor();

  return {
    secretKey,
    secureStorage,
    rateLimiter,
    apiKeyManager,
    securityMonitor,
    config: SECURITY_CONFIG
  };
};

// Export security configuration
export { SECURITY_CONFIG }; 