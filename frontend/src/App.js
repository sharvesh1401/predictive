import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useSimulationStore } from './store/simulationStore';
import SecurityProvider, { SecurityStatus, SecurityMonitor } from './components/SecurityProvider';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Simulation from './pages/Simulation';
import Results from './pages/Results';

// Placeholder pages
const Playground = () => (
  <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-foreground mb-4">Model Playground</h1>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  </div>
);

const Docs = () => (
  <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-foreground mb-4">Documentation</h1>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  </div>
);

function App() {
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
    <SecurityProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <SecurityStatus />
          <SecurityMonitor />
          
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/" 
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Home />
                  </motion.div>
                } 
              />
              <Route 
                path="/simulation" 
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Simulation />
                  </motion.div>
                } 
              />
              <Route 
                path="/results" 
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Results />
                  </motion.div>
                } 
              />
              <Route 
                path="/playground" 
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Playground />
                  </motion.div>
                } 
              />
              <Route 
                path="/docs" 
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Docs />
                  </motion.div>
                } 
              />
            </Routes>
          </AnimatePresence>

          <Footer />
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: isDarkMode ? '#1F2937' : '#FFFFFF',
                color: isDarkMode ? '#F9FAFB' : '#111827',
                border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
              },
            }}
          />
        </div>
      </Router>
    </SecurityProvider>
  );
}

export default App; 