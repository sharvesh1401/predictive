import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSimulationStore } from '../store/simulationStore';
import MapPanel from '../components/MapPanel';
import ControlPanel from '../components/ControlPanel';

const Simulation = () => {
  const { isDarkMode } = useSimulationStore();

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="h-[calc(100vh-4rem)] p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Map Panel - Takes 2/3 of the space on large screens */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 h-full"
          >
            <MapPanel />
          </motion.div>

          {/* Control Panel - Takes 1/3 of the space on large screens */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full"
          >
            <ControlPanel />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Simulation; 