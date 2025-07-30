import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  NavigationControl, 
  FullscreenControl, 
  GeolocateControl 
} from 'mapbox-gl';
import { 
  MapPin, 
  Battery, 
  Zap, 
  Navigation,
  Layers,
  Settings
} from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';

// Set your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhcnZlc2gxNDAxIiwiYSI6ImNrc2Z6Z2Z6Z2Z6Z2Z6Z2Z6Z2Z6Z2Z6Z2Z6In0.example';

const MapPanel = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(4.9041); // Amsterdam coordinates
  const [lat] = useState(52.3676);
  const [zoom] = useState(12);
  
  const { 
    origin, 
    destination, 
    routes, 
    selectedRoute,
    setOrigin,
    setDestination 
  } = useSimulationStore();

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: zoom,
      pitch: 45,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(new NavigationControl(), 'top-right');
    map.current.addControl(new FullscreenControl(), 'top-right');
    map.current.addControl(new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }), 'top-right');

    // Add custom markers for origin and destination
    const originMarker = new mapboxgl.Marker({
      color: '#10B981',
      scale: 1.2
    }).setLngLat([lng, lat]);

    const destinationMarker = new mapboxgl.Marker({
      color: '#EF4444',
      scale: 1.2
    }).setLngLat([lng + 0.02, lat + 0.02]);

    // Add charging station markers
    const chargingStations = [
      { lng: lng + 0.01, lat: lat + 0.01, name: 'Central Station', available: true },
      { lng: lng - 0.01, lat: lat - 0.01, name: 'Shopping Center', available: true },
      { lng: lng + 0.015, lat: lat - 0.005, name: 'University', available: false },
      { lng: lng - 0.005, lat: lat + 0.015, name: 'Airport', available: true },
    ];

    chargingStations.forEach(station => {
      const el = document.createElement('div');
      el.className = 'charging-station-marker';
      el.innerHTML = `
        <div class="w-6 h-6 rounded-full flex items-center justify-center ${
          station.available 
            ? 'bg-green-500 animate-pulse-glow' 
            : 'bg-gray-500'
        }">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-1.667-3.93l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L11 3.323V3a1 1 0 011-1z"/>
          </svg>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([station.lng, station.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${station.name}</h3>
                <p class="text-sm ${station.available ? 'text-green-600' : 'text-red-600'}">
                  ${station.available ? 'Available' : 'Occupied'}
                </p>
              </div>
            `)
        )
        .addTo(map.current);

      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });
    });

    // Add route visualization
    if (routes.length > 0 && selectedRoute) {
      const route = selectedRoute;
      
      // Add route line
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route.coordinates || [
              [lng, lat],
              [lng + 0.02, lat + 0.02]
            ]
          }
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#BA68ED',
          'line-width': 4,
          'line-dasharray': [0, 4],
          'line-opacity': 0.8
        }
      });

      // Animate the route line
      let phase = 0;
      const animate = () => {
        phase = (phase + 0.1) % 1;
        map.current.setPaintProperty('route', 'line-dasharray', [phase * 4, 4]);
        requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [lng, lat, zoom, routes, selectedRoute]);

  // Update map when routes change
  useEffect(() => {
    if (map.current && routes.length > 0) {
      // Fit map to route bounds
      const coordinates = routes[0].coordinates || [
        [lng, lat],
        [lng + 0.02, lat + 0.02]
      ];
      
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      map.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000
      });
    }
  }, [routes, lng, lat]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-full rounded-2xl overflow-hidden bg-card border border-border"
    >
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
          className="absolute top-4 right-4 z-10 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 max-w-xs"
        >
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
        </motion.div>
      )}

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full"
      />

      {/* Loading Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center"
        style={{ display: 'none' }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-foreground">Loading map...</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MapPanel; 