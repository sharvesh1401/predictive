import { useCallback, useRef, useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';

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

    stations.forEach(station => {
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

      const marker = new window.mapboxgl.Marker(el)
        .setLngLat([station.lng, station.lat])
        .setPopup(
          new window.mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${station.name}</h3>
                <p class="text-sm ${station.available ? 'text-green-600' : 'text-red-600'}">
                  ${station.available ? 'Available' : 'Occupied'}
                </p>
              </div>
            `)
        )
        .addTo(map);

      // Add hover effects
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });
    });
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

    // Animate the route line
    let phase = 0;
    const animate = () => {
      phase = (phase + 0.1) % 1;
      map.setPaintProperty(layerId, 'line-dasharray', [phase * 4, 4]);
      requestAnimationFrame(animate);
    };
    animate();
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