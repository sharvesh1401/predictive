import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center">
      <AnimatedBackground />
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold"
      >
        Ultimate EV Charge-Routing
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-4 text-lg text-muted-foreground"
      >
        Simulating electric vehicle routing and charging strategies in real urban environments.
      </motion.p>
      <div className="mt-8 flex space-x-4">
        <Link to="/simulation">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0px 0px 8px rgb(255,255,255)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold"
          >
            🚀 Start Simulation
          </motion.button>
        </Link>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0px 0px 8px rgb(255,255,255)' }}
          whileTap={{ scale: 0.95 }}
          className="bg-secondary text-secondary-foreground px-6 py-3 rounded-md font-semibold"
        >
          📖 Learn How It Works
        </motion.button>
      </div>
    </div>
  );
};

export default HomePage;
