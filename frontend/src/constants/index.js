// Application constants and configuration

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [4.9041, 52.3676], // Amsterdam
  DEFAULT_ZOOM: 12,
  DEFAULT_PITCH: 45,
  DEFAULT_BEARING: 0,
  STYLE: 'mapbox://styles/mapbox/dark-v11',
  ACCESS_TOKEN: process.env.REACT_APP_MAPBOX_TOKEN,
};

// AI Configuration
export const AI_CONFIG = {
  DEEPSEEK_API_KEY: process.env.REACT_APP_DEEPSEEK_API_KEY,
  GROQ_API_KEY: process.env.REACT_APP_GROQ_API_KEY,
  DEEPSEEK_URL: 'https://api.deepseek.com/v1/chat/completions',
  GROQ_URL: 'https://api.groq.com/openai/v1/chat/completions',
  DEEPSEEK_MODEL: 'deepseek-chat',
  GROQ_MODEL: 'llama3-8b-8192',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.3,
};

// Routing Algorithms
export const ALGORITHMS = {
  DIJKSTRA: 'dijkstra',
  ASTAR: 'astar',
  AI: 'ai',
};

// User Profiles
export const USER_PROFILES = {
  ECO: 'eco',
  FAST: 'fast',
  BALANCED: 'balanced',
};

// Battery Configuration
export const BATTERY_CONFIG = {
  MIN_CAPACITY: 30,
  MAX_CAPACITY: 100,
  MIN_LEVEL: 0,
  MAX_LEVEL: 100,
  DEFAULT_CAPACITY: 75,
  DEFAULT_LEVEL: 100,
};

// Animation Configuration
export const ANIMATION_CONFIG = {
  DURATION: 0.4,
  EASE: 'easeInOut',
  SPRING_STIFFNESS: 120,
  SPRING_DAMPING: 20,
};

// Theme Configuration
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: '#BA68ED',
    SECONDARY: '#10B981',
    ACCENT: '#F59E0B',
    DESTRUCTIVE: '#EF4444',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
  },
  DARK: {
    BACKGROUND: '#172144',
    CARD: '#1e2a4a',
    BORDER: '#2d3a5a',
  },
  LIGHT: {
    BACKGROUND: '#FFFFFF',
    CARD: '#FFFFFF',
    BORDER: '#E5E7EB',
  },
};

// Route Configuration
export const ROUTE_CONFIG = {
  DEFAULT_COORDINATES: [
    [4.9041, 52.3676],
    [4.9241, 52.3876]
  ],
  LINE_COLOR: '#BA68ED',
  LINE_WIDTH: 4,
  LINE_OPACITY: 0.8,
  ANIMATION_SPEED: 0.1,
};

// Charging Station Configuration
export const CHARGING_STATION_CONFIG = {
  MARKER_SIZE: 24,
  PULSE_ANIMATION: 'pulse-glow',
  POPUP_OFFSET: 25,
};

// Validation Rules
export const VALIDATION_RULES = {
  MIN_BATTERY_LEVEL: 0,
  MAX_BATTERY_LEVEL: 100,
  MIN_BATTERY_CAPACITY: 30,
  MAX_BATTERY_CAPACITY: 100,
  REQUIRED_FIELDS: ['origin', 'destination'],
};

// Error Messages
export const ERROR_MESSAGES = {
  ORIGIN_REQUIRED: 'Please select an origin point',
  DESTINATION_REQUIRED: 'Please select a destination point',
  BATTERY_LEVEL_INVALID: 'Battery level must be between 0% and 100%',
  BATTERY_CAPACITY_INVALID: 'Battery capacity must be between 30 kWh and 100 kWh',
  API_ERROR: 'Failed to connect to the server',
  AI_SERVICE_UNAVAILABLE: 'AI navigation services are currently unavailable',
  MAP_LOAD_ERROR: 'Failed to load the map',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SIMULATION_COMPLETED: 'Route calculation completed!',
  AI_SIMULATION_COMPLETED: 'AI-powered route optimization completed!',
  SIMULATION_RESET: 'Simulation reset successfully',
  AI_ROUTE_CALCULATED: 'AI route calculated using',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  SIMULATION_STATE: 'ev-simulation-storage',
  THEME_PREFERENCE: 'theme-preference',
  USER_SETTINGS: 'user-settings',
};

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_LIMIT: 100,
  LAZY_LOAD_THRESHOLD: 0.1,
  MEMORY_CLEANUP_INTERVAL: 300000, // 5 minutes
};

// Export all constants
export default {
  API_CONFIG,
  MAP_CONFIG,
  AI_CONFIG,
  ALGORITHMS,
  USER_PROFILES,
  BATTERY_CONFIG,
  ANIMATION_CONFIG,
  THEME_CONFIG,
  ROUTE_CONFIG,
  CHARGING_STATION_CONFIG,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  PERFORMANCE_CONFIG,
}; 