import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Map, 
  Battery, 
  Settings, 
  Play, 
  RotateCcw,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle
} from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';
import { cn } from '../lib/utils';

const ControlPanel = () => {
  const {
    origin,
    destination,
    algorithm,
    userProfile,
    batteryCapacity,
    currentBattery,
    isLoading,
    setAlgorithm,
    setUserProfile,
    setBatteryCapacity,
    setCurrentBattery,
    setLoading,
    resetSimulation
  } = useSimulationStore();

  const [expandedSections, setExpandedSections] = useState({
    routing: true,
    vehicle: true,
    preferences: true
  });

  const algorithms = [
    { id: 'dijkstra', name: 'Dijkstra', description: 'Shortest path algorithm' },
    { id: 'astar', name: 'A*', description: 'Heuristic-based pathfinding' },
    { id: 'ai', name: 'AI-Powered', description: 'Machine learning optimization' }
  ];

  const userProfiles = [
    { id: 'eco', name: 'Eco-Friendly', description: 'Minimize energy consumption' },
    { id: 'fast', name: 'Fast Route', description: 'Minimize travel time' },
    { id: 'balanced', name: 'Balanced', description: 'Balance time and energy' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSimulate = async () => {
    if (!origin || !destination) {
      // Show error toast
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock route data
      const mockRoutes = [
        {
          id: 1,
          algorithm: algorithm,
          distance: 12.5,
          duration: 25,
          energy: 8.2,
          cost: 15.30,
          coordinates: [[4.9041, 52.3676], [4.9241, 52.3876]]
        },
        {
          id: 2,
          algorithm: algorithm,
          distance: 14.2,
          duration: 22,
          energy: 9.1,
          cost: 16.80,
          coordinates: [[4.9041, 52.3676], [4.9241, 52.3876]]
        }
      ];
      
      useSimulationStore.getState().setRoutes(mockRoutes);
      useSimulationStore.getState().setSelectedRoute(mockRoutes[0]);
      setLoading(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-card border border-border rounded-2xl p-6 overflow-y-auto"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Simulation Controls</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetSimulation}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Routing Algorithm Section */}
        <motion.div
          initial={false}
          animate={{ height: expandedSections.routing ? 'auto' : '60px' }}
          className="border border-border rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleSection('routing')}
            className="w-full px-4 py-3 flex items-center justify-between bg-accent/50 hover:bg-accent transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Map className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Routing Algorithm</span>
            </div>
            {expandedSections.routing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <AnimatePresence>
            {expandedSections.routing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 space-y-3"
              >
                {algorithms.map((algo) => (
                  <motion.div
                    key={algo.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="algorithm"
                        value={algo.id}
                        checked={algorithm === algo.id}
                        onChange={(e) => setAlgorithm(e.target.value)}
                        className="w-4 h-4 text-primary border-border focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{algo.name}</div>
                        <div className="text-sm text-muted-foreground">{algo.description}</div>
                      </div>
                    </label>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Vehicle Settings Section */}
        <motion.div
          initial={false}
          animate={{ height: expandedSections.vehicle ? 'auto' : '60px' }}
          className="border border-border rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleSection('vehicle')}
            className="w-full px-4 py-3 flex items-center justify-between bg-accent/50 hover:bg-accent transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Battery className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Vehicle Settings</span>
            </div>
            {expandedSections.vehicle ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <AnimatePresence>
            {expandedSections.vehicle && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 space-y-4"
              >
                {/* Battery Capacity */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Battery Capacity (kWh)
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={batteryCapacity}
                    onChange={(e) => setBatteryCapacity(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>30 kWh</span>
                    <span className="text-primary font-medium">{batteryCapacity} kWh</span>
                    <span>100 kWh</span>
                  </div>
                </div>

                {/* Current Battery */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Battery Level (%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentBattery}
                    onChange={(e) => setCurrentBattery(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span className={cn(
                      "font-medium",
                      currentBattery > 50 ? "text-green-500" : 
                      currentBattery > 20 ? "text-yellow-500" : "text-red-500"
                    )}>
                      {currentBattery}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* User Preferences Section */}
        <motion.div
          initial={false}
          animate={{ height: expandedSections.preferences ? 'auto' : '60px' }}
          className="border border-border rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleSection('preferences')}
            className="w-full px-4 py-3 flex items-center justify-between bg-accent/50 hover:bg-accent transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">User Preferences</span>
            </div>
            {expandedSections.preferences ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <AnimatePresence>
            {expandedSections.preferences && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 space-y-3"
              >
                {userProfiles.map((profile) => (
                  <motion.div
                    key={profile.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="userProfile"
                        value={profile.id}
                        checked={userProfile === profile.id}
                        onChange={(e) => setUserProfile(e.target.value)}
                        className="w-4 h-4 text-primary border-border focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{profile.name}</div>
                        <div className="text-sm text-muted-foreground">{profile.description}</div>
                      </div>
                    </label>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSimulate}
            disabled={isLoading || !origin || !destination}
            className={cn(
              "w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2",
              isLoading || !origin || !destination
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg hover:shadow-primary/25"
            )}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Calculating Routes...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Simulation</span>
              </>
            )}
          </motion.button>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2 px-3 bg-accent hover:bg-accent/80 text-foreground rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2 px-3 bg-accent hover:bg-accent/80 text-foreground rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </motion.button>
          </div>
        </div>

        {/* Validation Messages */}
        <AnimatePresence>
          {(!origin || !destination) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-600">
                Please select origin and destination points on the map
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ControlPanel; 