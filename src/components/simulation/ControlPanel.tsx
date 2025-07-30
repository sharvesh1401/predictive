import React from 'react';

const ControlPanel: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Controls</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="start" className="block text-sm font-medium text-muted-foreground">
            Start Location
          </label>
          <input type="text" id="start" className="w-full bg-input border border-border rounded-md px-3 py-2" />
        </div>
        <div>
          <label htmlFor="end" className="block text-sm font-medium text-muted-foreground">
            End Location
          </label>
          <input type="text" id="end" className="w-full bg-input border border-border rounded-md px-3 py-2" />
        </div>
        <div>
          <label htmlFor="algorithm" className="block text-sm font-medium text-muted-foreground">
            Routing Algorithm
          </label>
          <select id="algorithm" className="w-full bg-input border border-border rounded-md px-3 py-2">
            <option>Dijkstra</option>
            <option>A*</option>
            <option>AI-powered</option>
          </select>
        </div>
        <button className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold">
          Simulate Route
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
