import { useCallback } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { mockAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useSimulation = () => {
  const {
    origin,
    destination,
    algorithm,
    userProfile,
    batteryCapacity,
    currentBattery,
    isLoading,
    aiProvider,
    setLoading,
    setAIProvider,
    setRoutes,
    setSelectedRoute,
    setError
  } = useSimulationStore();

  const validateSimulationParams = useCallback(() => {
    if (!origin || !destination) {
      toast.error('Please select origin and destination points');
      return false;
    }
    
    if (currentBattery <= 0) {
      toast.error('Battery level must be greater than 0%');
      return false;
    }
    
    if (batteryCapacity <= 0) {
      toast.error('Battery capacity must be greater than 0 kWh');
      return false;
    }
    
    return true;
  }, [origin, destination, currentBattery, batteryCapacity]);

  const runSimulation = useCallback(async () => {
    if (!validateSimulationParams()) {
      return;
    }

    setLoading(true);
    setAIProvider(null);
    setError(null);
    
    try {
      const simulationParams = {
        origin,
        destination,
        algorithm,
        userProfile,
        batteryCapacity,
        currentBattery
      };

      const result = await mockAPI.calculateRoutes(simulationParams);
      
      // Check if AI was used and set provider
      if (algorithm === 'ai' && result.routes[0]?.aiProvider) {
        setAIProvider(result.routes[0].aiProvider);
        toast.success(`AI route calculated using ${result.routes[0].aiProvider.toUpperCase()}`);
      }
      
      setRoutes(result.routes);
      setSelectedRoute(result.routes[0]);
      
      if (algorithm === 'ai') {
        toast.success('AI-powered route optimization completed!');
      } else {
        toast.success('Route calculation completed!');
      }
      
      return result;
    } catch (error) {
      console.error('Simulation error:', error);
      const errorMessage = error.message || 'Failed to calculate routes';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [
    origin,
    destination,
    algorithm,
    userProfile,
    batteryCapacity,
    currentBattery,
    validateSimulationParams,
    setLoading,
    setAIProvider,
    setError,
    setRoutes,
    setSelectedRoute
  ]);

  const resetSimulation = useCallback(() => {
    useSimulationStore.getState().resetSimulation();
    toast.success('Simulation reset successfully');
  }, []);

  return {
    runSimulation,
    resetSimulation,
    validateSimulationParams,
    isLoading,
    aiProvider,
    canRunSimulation: validateSimulationParams()
  };
}; 