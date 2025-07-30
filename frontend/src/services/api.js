import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add loading indicator or auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

// API endpoints
export const simulationAPI = {
  // Calculate routes
  calculateRoutes: async (params) => {
    try {
      const response = await api.post('/api/calculate-routes', params);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get charging stations
  getChargingStations: async (bounds) => {
    try {
      const response = await api.get('/api/charging-stations', {
        params: { bounds }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get route optimization
  optimizeRoute: async (params) => {
    try {
      const response = await api.post('/api/optimize-route', params);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get simulation results
  getSimulationResults: async (simulationId) => {
    try {
      const response = await api.get(`/api/simulation/${simulationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Save simulation
  saveSimulation: async (simulationData) => {
    try {
      const response = await api.post('/api/simulation', simulationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Export results
  exportResults: async (simulationId, format = 'pdf') => {
    try {
      const response = await api.get(`/api/export/${simulationId}`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Mock data for development
export const mockAPI = {
  calculateRoutes: async (params) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      routes: [
        {
          id: 1,
          algorithm: params.algorithm || 'dijkstra',
          distance: 12.5,
          duration: 25,
          energy: 8.2,
          cost: 15.30,
          coordinates: [
            [4.9041, 52.3676],
            [4.9141, 52.3776],
            [4.9241, 52.3876]
          ],
          chargingStops: [
            { lat: 4.9141, lng: 52.3776, duration: 15, cost: 8.50 }
          ]
        },
        {
          id: 2,
          algorithm: params.algorithm || 'dijkstra',
          distance: 14.2,
          duration: 22,
          energy: 9.1,
          cost: 16.80,
          coordinates: [
            [4.9041, 52.3676],
            [4.9191, 52.3826],
            [4.9241, 52.3876]
          ],
          chargingStops: [
            { lat: 4.9191, lng: 52.3826, duration: 20, cost: 10.20 }
          ]
        }
      ],
      summary: {
        totalRoutes: 2,
        bestRoute: 1,
        averageDistance: 13.35,
        averageDuration: 23.5,
        averageEnergy: 8.65,
        averageCost: 16.05
      }
    };
  },

  getChargingStations: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      stations: [
        {
          id: 1,
          name: 'Central Station',
          lat: 4.9141,
          lng: 52.3776,
          available: true,
          power: 50,
          cost: 0.35
        },
        {
          id: 2,
          name: 'Shopping Center',
          lat: 4.9191,
          lng: 52.3826,
          available: true,
          power: 22,
          cost: 0.30
        },
        {
          id: 3,
          name: 'University',
          lat: 4.9091,
          lng: 52.3726,
          available: false,
          power: 11,
          cost: 0.25
        }
      ]
    };
  }
};

export default api; 