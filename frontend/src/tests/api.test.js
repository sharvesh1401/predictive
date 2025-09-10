import { simulationAPI } from '../services/api';

describe('API Integration Tests', () => {
  // Test the route calculation endpoint
  test('should calculate route between two points', async () => {
    const params = {
      origin: 'Amsterdam_Central',
      destination: 'Utrecht',
      driver_profile: 'EFFICIENT',
      routing_model: 'dijkstra',
      battery_capacity_kwh: 60.0,
      current_charge_kwh: 45.0,
      use_ai_enhancement: true
    };

    try {
      const response = await simulationAPI.calculateRoutes(params);
      
      // Basic response validation
      expect(response).toBeDefined();
      expect(response.route).toBeDefined();
      expect(Array.isArray(response.route)).toBe(true);
      expect(response.total_distance_km).toBeGreaterThan(0);
      expect(response.estimated_time_min).toBeGreaterThan(0);
      
      console.log('✅ Route calculation test passed');
      return true;
    } catch (error) {
      console.error('❌ Route calculation test failed:', error);
      throw error;
    }
  });

  // Test the charging stations endpoint
  test('should fetch charging stations', async () => {
    const bounds = {
      north: 52.5,
      south: 52.0,
      east: 5.2,
      west: 4.8
    };

    try {
      const response = await simulationAPI.getChargingStations(bounds);
      
      // Basic response validation
      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
      
      console.log('✅ Charging stations test passed');
      return true;
    } catch (error) {
      console.error('❌ Charging stations test failed:', error);
      throw error;
    }
  });
});
