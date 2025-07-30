import React from 'react';
import ResultCards from '../components/results/ResultCards';
import Chart from '../components/results/Chart';
import { motion } from 'framer-motion';

const ResultsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-4">Simulation Results</h1>
      <ResultCards />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 bg-card p-4 rounded-lg shadow-lg"
      >
        <Chart />
      </motion.div>
    </motion.div>
  );
};

export default ResultsPage;
