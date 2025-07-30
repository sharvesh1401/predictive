import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  MapPin, 
  Battery, 
  Zap, 
  Navigation,
  Layers,
  Settings
} from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';
import { useMap } from '../hooks/useMap';
import { Card } from './ui/Card';
import { mockAPI } from '../services/api';
import { MAP_CONFIG } from '../constants';

// Set Mapbox access token from environment variable
if (MAP_CONFIG.ACCESS_TOKEN) {
  mapboxgl.accessToken = MAP_CONFIG.ACCESS_TOKEN;
} else {
  console.error('Mapbox access token not found. Please set REACT_APP_MAPBOX_TOKEN environment variable.');
}

const MapPanel = () => {
  const mapContainer = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    origin, 
    destination, 
    routes, 
    selectedRoute
  } = useSimulationStore();

  const {
    mapInstance,
    initializeMap,
    addMapControls,
    addChargingStations,
    addRouteLayer,
    fitMapToRoute,
    handleMapClick,
    cleanup
  } = useMap();

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMapAsync = async () => {
      try {
        setIsLoading(true);
        
        // Initialize map
        const map = initializeMap(mapContainer.current);
        
        // Add controls
        addMapControls(map);
        
        // Load charging stations
        const { stations } = await mockAPI.getChargingStations();
        addChargingStations(map, stations);
        
        // Add click handler
        map.on('click', handleMapClick);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize map:', error);
        setIsLoading(false);
      }
    };

    initializeMapAsync();

    return cleanup;
  }, [initializeMap, addMapControls, addChargingStations, handleMapClick, cleanup]);

  // Update map when routes change
  useEffect(() => {
    if (mapInstance && selectedRoute?.coordinates) {
      addRouteLayer(mapInstance, selectedRoute);
      fitMapToRoute(mapInstance, selectedRoute.coordinates);
    }
  }, [mapInstance, selectedRoute, addRouteLayer, fitMapToRoute]);

  return (
    <Card className="relative h-full overflow-hidden p-0">
      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg text-foreground hover:bg-card transition-colors"
          title="Layer Settings"
        >
          <Layers className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg text-foreground hover:bg-card transition-colors"
          title="Map Settings"
        >
          <Settings className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Route Info Overlay */}
      {selectedRoute && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 z-10"
        >
          <Card className="max-w-xs">
            <h3 className="font-semibold text-foreground mb-2">Selected Route</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Distance:</span>
                <span className="text-foreground">{selectedRoute.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="text-foreground">{selectedRoute.duration} min</span>
              </div>
              <div className="flex justify-between">
                <span>Energy:</span>
                <span className="text-foreground">{selectedRoute.energy} kWh</span>
              </div>
              <div className="flex justify-between">
                <span>Cost:</span>
                <span className="text-foreground">€{selectedRoute.cost}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-2xl"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-foreground">Loading map...</span>
          </div>
        </motion.div>
      )}
    </Card>
  );
};

export default MapPanel; 