import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-center text-muted-foreground">
            © 2025 Sharvesh Selvakumar
          </p>
          <div className="flex space-x-4">
            <a
              href="https://github.com/sharvesh1401"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://sharveshfolio.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              Portfolio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
