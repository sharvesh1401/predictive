import { secureAPIService } from './secureAPI';
import toast from 'react-hot-toast';

// Create secure API instance
const api = {
  // Use secure API service for all requests
  get: (url, config) => secureAPIService.callBackendAPI(url, 'GET', null),
  post: (url, data, config) => secureAPIService.callBackendAPI(url, 'POST', data),
  put: (url, data, config) => secureAPIService.callBackendAPI(url, 'PUT', data),
  delete: (url, config) => secureAPIService.callBackendAPI(url, 'DELETE', null),
  
  // Security utilities
  getSecurityReport: () => secureAPIService.getSecurityReport(),
  validateAPIKeys: () => secureAPIService.validateAPIKeys(),
  getRateLimitInfo: (key) => secureAPIService.getRateLimitInfo(key)
};

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

// AI Navigation Service using Secure API
export const aiNavigationService = {
  // Try DeepSeek first, then Groq as fallback
  getAINavigation: async (params) => {
    const { origin, destination, userProfile, batteryCapacity, currentBattery } = params;

    const prompt = `You are an AI navigation assistant for electric vehicles. 
    
    Route Request:
    - Origin: ${origin}
    - Destination: ${destination}
    - User Profile: ${userProfile}
    - Battery Capacity: ${batteryCapacity} kWh
    - Current Battery: ${currentBattery}%
    
    Please provide an optimized route considering:
    1. Battery efficiency and charging stops
    2. User preferences (${userProfile})
    3. Traffic conditions
    4. Charging station availability
    
    Return a JSON response with:
    {
      "route": {
        "distance": number,
        "duration": number,
        "energy": number,
        "cost": number,
        "coordinates": [[lat, lng], ...],
        "chargingStops": [{"lat": number, "lng": number, "duration": number, "cost": number}],
        "reasoning": "string"
      }
    }`;

    // Check if AI services are available
    const availableKeys = secureAPIService.validateAPIKeys();
    const hasDeepSeek = availableKeys.deepseek?.valid;
    const hasGroq = availableKeys.groq?.valid;

    if (!hasDeepSeek && !hasGroq) {
      throw new Error('AI navigation services not configured. Please set API keys for DeepSeek or Groq.');
    }

    // Try DeepSeek API first using secure service
    if (hasDeepSeek) {
      try {
        const deepseekResponse = await secureAPIService.callDeepSeekAPI(prompt);
        const content = deepseekResponse.choices[0].message.content;
        
        try {
          const routeData = JSON.parse(content);
          return {
            ...routeData,
            aiProvider: 'deepseek',
            success: true
          };
        } catch (parseError) {
          console.warn('Failed to parse DeepSeek response:', parseError);
          throw new Error('Invalid response format from DeepSeek');
        }
      } catch (deepseekError) {
        console.warn('DeepSeek failed, trying Groq:', deepseekError);
      }
    }
    
    // Fallback to Groq API using secure service
    if (hasGroq) {
      try {
        const groqResponse = await secureAPIService.callGroqAPI(prompt);
        const content = groqResponse.choices[0].message.content;
        
        try {
          const routeData = JSON.parse(content);
          return {
            ...routeData,
            aiProvider: 'groq',
            success: true
          };
        } catch (parseError) {
          console.warn('Failed to parse Groq response:', parseError);
          throw new Error('Invalid response format from Groq');
        }
      } catch (groqError) {
        console.error('Groq API failed:', groqError);
        throw new Error('AI navigation services are currently unavailable');
      }
    }

    throw new Error('No AI navigation services available. Please configure API keys.');
  }
};

// Mock data for development
export const mockAPI = {
  calculateRoutes: async (params) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // If AI algorithm is selected, try AI navigation
    if (params.algorithm === 'ai') {
      try {
        const aiRoute = await aiNavigationService.getAINavigation(params);
        return {
          routes: [
            {
              id: 1,
              algorithm: 'ai',
              aiProvider: aiRoute.aiProvider,
              distance: aiRoute.route.distance || 13.1,
              duration: aiRoute.route.duration || 20,
              energy: aiRoute.route.energy || 7.8,
              cost: aiRoute.route.cost || 14.5,
              coordinates: aiRoute.route.coordinates || [
                [4.9041, 52.3676],
                [4.9141, 52.3776],
                [4.9241, 52.3876]
              ],
              chargingStops: aiRoute.route.chargingStops || [
                { lat: 4.9141, lng: 52.3776, duration: 15, cost: 8.50 }
              ],
              reasoning: aiRoute.route.reasoning || 'AI-optimized route considering battery efficiency and user preferences'
            }
          ],
          summary: {
            totalRoutes: 1,
            bestRoute: 1,
            averageDistance: aiRoute.route.distance || 13.1,
            averageDuration: aiRoute.route.duration || 20,
            averageEnergy: aiRoute.route.energy || 7.8,
            averageCost: aiRoute.route.cost || 14.5
          }
        };
      } catch (aiError) {
        console.warn('AI navigation failed, falling back to mock data:', aiError.message);
        // Fall back to mock data with AI provider info
        return {
          routes: [
            {
              id: 1,
              algorithm: 'ai',
              aiProvider: 'mock',
              distance: 13.1,
              duration: 20,
              energy: 7.8,
              cost: 14.5,
              coordinates: [
                [4.9041, 52.3676],
                [4.9141, 52.3776],
                [4.9241, 52.3876]
              ],
              chargingStops: [
                { lat: 4.9141, lng: 52.3776, duration: 15, cost: 8.50 }
              ],
              reasoning: `Mock AI route (${aiError.message})`
            }
          ],
          summary: {
            totalRoutes: 1,
            bestRoute: 1,
            averageDistance: 13.1,
            averageDuration: 20,
            averageEnergy: 7.8,
            averageCost: 14.5
          }
        };
      }
    }
    
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