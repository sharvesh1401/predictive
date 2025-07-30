import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('API Response Error:', error);
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    throw new Error(message);
  }
);

// API functions
export const fetchDriverProfiles = async () => {
  return await api.get('/api/driver-profiles');
};

export const fetchLocations = async () => {
  return await api.get('/api/locations');
};

export const calculateRoute = async (routeData) => {
  const payload = {
    origin: routeData.origin,
    destination: routeData.destination,
    driver_profile: routeData.driverProfile,
    routing_model: routeData.routingModel,
    battery_capacity_kwh: routeData.batteryCapacity,
    current_charge_kwh: routeData.currentCharge,
    use_ai_enhancement: routeData.useAIEnhancement,
    preferences: routeData.preferences || {},
  };
  
  return await api.post('/api/route', payload);
};

export const compareRoutes = async (routeData) => {
  const payload = {
    origin: routeData.origin,
    destination: routeData.destination,
    driver_profile: routeData.driverProfile,
    routing_model: routeData.routingModel,
    battery_capacity_kwh: routeData.batteryCapacity,
    current_charge_kwh: routeData.currentCharge,
    use_ai_enhancement: routeData.useAIEnhancement,
    preferences: routeData.preferences || {},
  };
  
  return await api.post('/api/compare-routes', payload);
};

export const enhanceRouteWithAI = async (routeData) => {
  const payload = {
    origin: routeData.origin,
    destination: routeData.destination,
    driver_profile: routeData.driverProfile,
    routing_model: routeData.routingModel,
    battery_capacity_kwh: routeData.batteryCapacity,
    current_charge_kwh: routeData.currentCharge,
    preferences: routeData.preferences || {},
  };
  
  return await api.post('/api/ai-enhance', payload);
};

export const checkHealth = async () => {
  return await api.get('/api/health');
};

// Utility function to test API connection
export const testAPIConnection = async () => {
  try {
    const health = await checkHealth();
    return health.status === 'healthy';
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

export default api; 