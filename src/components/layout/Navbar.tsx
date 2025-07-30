import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-background/75 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              EV Charge-Routing
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/simulation"
              className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium"
            >
              Simulation
            </Link>
            <Link
              to="/results"
              className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium"
            >
              Results
            </Link>
            <a
              href="https://github.com/sharvesh1401"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium"
            >
              GitHub
            </a>
            <a
              href="https://sharveshfolio.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium"
            >
              Portfolio
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
