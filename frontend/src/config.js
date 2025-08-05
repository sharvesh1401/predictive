/**
 * Application configuration
 * Centralized configuration for API endpoints and other settings
 */

const config = {
  // API configuration
  api: {
    // Base URL for API requests
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    
    // External service base URLs
    baseURLs: {
      mapbox: 'https://api.mapbox.com',
      deepseek: 'https://api.deepseek.com',
      groq: 'https://api.groq.com'
    },
    
    // API endpoints
    endpoints: {
      route: '/api/route',
      aiEnhance: '/api/ai-enhance',
      compareRoutes: '/api/compare-routes',
      chargingStations: '/api/charging-stations',
      optimizeRoute: '/api/optimize-route',
      simulation: '/api/simulation'
    },
    
    // Request timeouts (in milliseconds)
    timeouts: {
      default: 10000,  // 10 seconds
      short: 5000,     // 5 seconds
      long: 30000      // 30 seconds
    },
    
    // Default request headers
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  
  // Map configuration
  map: {
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN || '',
    defaultCenter: [4.8952, 52.3676], // Amsterdam coordinates [lng, lat]
    defaultZoom: 12,
    minZoom: 4,
    maxZoom: 18,
    style: 'mapbox://styles/mapbox/streets-v11'
  },
  
  // EV Simulation defaults
  simulation: {
    defaultBatteryLevel: 85,  // Starting battery percentage
    minBatteryLevel: 5,      // Minimum battery level before warning
    maxBatteryLevel: 100,    // Maximum battery level
    defaultProfile: 'balanced', // Default driving profile
    
    // Available driving profiles
    profiles: {
      eco: {
        name: 'Eco',
        description: 'Maximize efficiency and range',
        speedFactor: 0.9,
        acceleration: 'gentle',
        climateControl: 'eco'
      },
      balanced: {
        name: 'Balanced',
        description: 'Balance between performance and efficiency',
        speedFactor: 1.0,
        acceleration: 'normal',
        climateControl: 'auto'
      },
      sport: {
        name: 'Sport',
        description: 'Prioritize performance over efficiency',
        speedFactor: 1.1,
        acceleration: 'aggressive',
        climateControl: 'comfort'
      }
    }
  },
  
  // Feature flags
  features: {
    enableAI: true,
    enableAnalytics: process.env.NODE_ENV === 'production',
    enableMockData: process.env.REACT_APP_USE_MOCK_DATA === 'true',
    enableOfflineMode: true,
    enableRouteOptimization: true
  },
  
  // Development settings
  dev: {
    logApiCalls: process.env.NODE_ENV === 'development',
    logReduxActions: false,
    mockDelay: 500 // Artificial delay for mock API responses in ms
  }
};

// Freeze the config object to prevent accidental modifications
Object.freeze(config);

export default config;
