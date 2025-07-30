import { useCallback, useRef, useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { sanitizeInput } from '../utils/security';

export const useMap = () => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const { setOrigin, setDestination } = useSimulationStore();

  const initializeMap = useCallback((container, options = {}) => {
    if (mapRef.current) return mapRef.current;

    const defaultOptions = {
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [4.9041, 52.3676], // Amsterdam
      zoom: 12,
      pitch: 45,
      bearing: 0,
      ...options
    };

    const map = new window.mapboxgl.Map({
      container,
      ...defaultOptions
    });

    mapRef.current = map;
    setMapInstance(map);
    return map;
  }, []);

  const addMapControls = useCallback((map) => {
    if (!map) return;

    // Navigation controls
    map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new window.mapboxgl.FullscreenControl(), 'top-right');
    
    // Geolocation control
    map.addControl(new window.mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }), 'top-right');
  }, []);

  const addChargingStations = useCallback((map, stations = []) => {
    if (!map || !stations.length) return;

    const markers = [];
    const eventListeners = [];

    stations.forEach(station => {
      const el = document.createElement('div');
      el.className = 'charging-station-marker';
      
      // Create marker content safely without innerHTML
      const markerContent = document.createElement('div');
      markerContent.className = `w-6 h-6 rounded-full flex items-center justify-center ${
        station.available 
          ? 'bg-green-500 animate-pulse-glow' 
          : 'bg-gray-500'
      }`;
      
      // Create SVG element safely
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'w-4 h-4 text-white');
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('viewBox', '0 0 20 20');
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-1.667-3.93l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L11 3.323V3a1 1 0 011-1z');
      
      svg.appendChild(path);
      markerContent.appendChild(svg);
      el.appendChild(markerContent);

      // Create popup content safely
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2';
      
      const title = document.createElement('h3');
      title.className = 'font-semibold';
      title.textContent = sanitizeInput(station.name || 'Unknown Station');
      
      const status = document.createElement('p');
      status.className = `text-sm ${station.available ? 'text-green-600' : 'text-red-600'}`;
      status.textContent = station.available ? 'Available' : 'Occupied';
      
      popupContent.appendChild(title);
      popupContent.appendChild(status);

      const marker = new window.mapboxgl.Marker(el)
        .setLngLat([station.lng, station.lat])
        .setPopup(
          new window.mapboxgl.Popup({ offset: 25 })
            .setDOMContent(popupContent)
        )
        .addTo(map);

      markers.push(marker);

      // Add hover effects with proper cleanup tracking
      const mouseEnterHandler = () => {
        el.style.transform = 'scale(1.2)';
      };
      const mouseLeaveHandler = () => {
        el.style.transform = 'scale(1)';
      };

      el.addEventListener('mouseenter', mouseEnterHandler);
      el.addEventListener('mouseleave', mouseLeaveHandler);

      eventListeners.push({
        element: el,
        type: 'mouseenter',
        handler: mouseEnterHandler
      });
      eventListeners.push({
        element: el,
        type: 'mouseleave',
        handler: mouseLeaveHandler
      });
    });

    // Return cleanup function
    return () => {
      markers.forEach(marker => marker.remove());
      eventListeners.forEach(({ element, type, handler }) => {
        element.removeEventListener(type, handler);
      });
    };
  }, []);

  const addRouteLayer = useCallback((map, route) => {
    if (!map || !route?.coordinates) return;

    const sourceId = 'route';
    const layerId = 'route';

    // Remove existing route if present
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    // Add new route source
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.coordinates
        }
      }
    });

    // Add route layer
    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
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

    // Animate the route line with proper cleanup
    let phase = 0;
    let animationId = null;
    let isAnimating = true;
    
    const animate = () => {
      if (!isAnimating || !map.getLayer(layerId)) return;
      
      phase = (phase + 0.1) % 1;
      try {
        map.setPaintProperty(layerId, 'line-dasharray', [phase * 4, 4]);
        animationId = requestAnimationFrame(animate);
      } catch (error) {
        console.warn('Animation stopped due to layer removal:', error);
        isAnimating = false;
      }
    };
    
    animate();
    
    // Return cleanup function
    return () => {
      isAnimating = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const fitMapToRoute = useCallback((map, coordinates) => {
    if (!map || !coordinates?.length) return;

    const bounds = coordinates.reduce((bounds, coord) => {
      return bounds.extend(coord);
    }, new window.mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

    map.fitBounds(bounds, {
      padding: 50,
      duration: 1000
    });
  }, []);

  const handleMapClick = useCallback((event) => {
    const { lng, lat } = event.lngLat;
    const coordinates = [lng, lat];

    // For demo purposes, set first click as origin, second as destination
    // In a real app, you'd have UI to select which point is which
    setOrigin(coordinates);
    setDestination(coordinates);
  }, [setOrigin, setDestination]);

  const cleanup = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      setMapInstance(null);
    }
  }, []);

  return {
    mapInstance,
    initializeMap,
    addMapControls,
    addChargingStations,
    addRouteLayer,
    fitMapToRoute,
    handleMapClick,
    cleanup
  };
}; 