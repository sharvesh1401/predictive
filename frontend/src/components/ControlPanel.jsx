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
  AlertCircle
} from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';
import { useSimulation } from '../hooks/useSimulation';
import { cn } from '../lib/utils';
import Card, { CardHeader, CardContent } from './ui/Card';
import Button from './ui/Button';
import Slider from './ui/Slider';

const ControlPanel = () => {
  const {
    algorithm,
    userProfile,
    batteryCapacity,
    currentBattery,
    setAlgorithm,
    setUserProfile,
    setBatteryCapacity,
    setCurrentBattery
  } = useSimulationStore();

  const { runSimulation, resetSimulation, isLoading, aiProvider, canRunSimulation } = useSimulation();

  const [expandedSections, setExpandedSections] = useState({
    routing: true,
    vehicle: true,
    preferences: true
  });

  const algorithms = [
    { id: 'dijkstra', name: 'Dijkstra', description: 'Shortest path algorithm' },
    { id: 'astar', name: 'A*', description: 'Heuristic-based pathfinding' },
    { id: 'ai', name: 'AI-Powered', description: 'DeepSeek + Groq fallback optimization' }
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
    await runSimulation();
  };

  return (
    <Card className="h-full overflow-y-auto">
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
                        aria-label={`Select ${algo.name} algorithm`}
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
                <Slider
                  label="Battery Capacity (kWh)"
                  value={batteryCapacity}
                  onChange={setBatteryCapacity}
                  min={30}
                  max={100}
                  unit=" kWh"
                />

                {/* Current Battery */}
                <Slider
                  label="Current Battery Level (%)"
                  value={currentBattery}
                  onChange={setCurrentBattery}
                  min={0}
                  max={100}
                  unit="%"
                />
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
                        aria-label={`Select ${profile.name} profile`}
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
          <Button
            onClick={handleSimulate}
            disabled={!canRunSimulation}
            loading={isLoading}
            icon={Play}
            size="lg"
            className="w-full"
          >
            {isLoading ? 'Calculating Routes...' : 'Start Simulation'}
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="secondary"
              icon={Download}
              size="md"
              className="flex-1"
            >
              Export
            </Button>
            
            <Button
              variant="secondary"
              icon={Share2}
              size="md"
              className="flex-1"
            >
              Share
            </Button>
          </div>
        </div>

        {/* AI Provider Status */}
        <AnimatePresence>
          {aiProvider && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <Zap className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">
                AI route optimized using <strong>{aiProvider.toUpperCase()}</strong>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Validation Messages */}
        <AnimatePresence>
          {!canRunSimulation && (
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
    </Card>
  );
};

export default ControlPanel; 