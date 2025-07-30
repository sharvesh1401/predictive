import React from 'react';
import MapPanel from '../components/simulation/MapPanel';
import ControlPanel from '../components/simulation/ControlPanel';
import { motion } from 'framer-motion';

const SimulationPage: React.FC = () => {
  return (
    <div className="flex h-full">
      <div className="w-2/3 h-full">
        <MapPanel />
      </div>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-1/3 h-full bg-card p-4"
      >
        <ControlPanel />
      </motion.div>
    </div>
  );
};

export default SimulationPage;
