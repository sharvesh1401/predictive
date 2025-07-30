import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import L from 'leaflet';

const MapContainer = styled.div`
  height: 500px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
`;

const MapPlaceholder = styled.div`
  height: 500px;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #666;
  font-size: 1.1rem;
`;

const RouteMap = ({ routeData, comparisonData, showComparison }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      clearMap();
      if (showComparison && comparisonData) {
        displayComparisonRoutes();
      } else if (routeData) {
        displaySingleRoute();
      } else {
        displayDefaultMap();
      }
    }
  }, [routeData, comparisonData, showComparison]);

  const initializeMap = () => {
    // Amsterdam center coordinates
    const amsterdamCenter = [52.3676, 4.9041];
    
    mapInstanceRef.current = L.map(mapRef.current).setView(amsterdamCenter, 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(mapInstanceRef.current);
  };

  const clearMap = () => {
    // Clear existing markers and polylines
    markersRef.current.forEach(marker => marker.remove());
    polylinesRef.current.forEach(polyline => polyline.remove());
    markersRef.current = [];
    polylinesRef.current = [];
  };

  const displayDefaultMap = () => {
    if (!mapInstanceRef.current) return;
    
    // Add some default markers for Amsterdam landmarks
    const landmarks = [
      { name: 'Amsterdam Central', coords: [52.3791, 4.9003], type: 'station' },
      { name: 'Dam Square', coords: [52.3730, 4.8926], type: 'landmark' },
      { name: 'Museumplein', coords: [52.3579, 4.8816], type: 'landmark' },
      { name: 'Vondelpark', coords: [52.3567, 4.8687], type: 'park' }
    ];

    landmarks.forEach(landmark => {
      const icon = getMarkerIcon(landmark.type);
      const marker = L.marker(landmark.coords, { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(landmark.name);
      markersRef.current.push(marker);
    });
  };

  const displaySingleRoute = () => {
    if (!routeData || !routeData.route_coordinates || routeData.route_coordinates.length < 2) {
      displayDefaultMap();
      return;
    }

    const coordinates = routeData.route_coordinates.map(coord => [coord[0], coord[1]]);
    
    // Add route polyline
    const routeColor = getRouteColor(routeData.routing_model);
    const polyline = L.polyline(coordinates, {
      color: routeColor,
      weight: 6,
      opacity: 0.8
    }).addTo(mapInstanceRef.current);
    polylinesRef.current.push(polyline);

    // Add start and end markers
    if (coordinates.length > 0) {
      const startIcon = L.divIcon({
        className: 'custom-div-icon',
        html: '<div style="background-color: #28a745; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const endIcon = L.divIcon({
        className: 'custom-div-icon',
        html: '<div style="background-color: #dc3545; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const startMarker = L.marker(coordinates[0], { icon: startIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('Start');
      markersRef.current.push(startMarker);

      const endMarker = L.marker(coordinates[coordinates.length - 1], { icon: endIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('Destination');
      markersRef.current.push(endMarker);
    }

    // Add charging station markers
    routeData.charging_stops.forEach(stop => {
      const chargingIcon = L.divIcon({
        className: 'custom-div-icon',
        html: '<div style="background-color: #ffc107; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker([stop.location[0], stop.location[1]], { icon: chargingIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`Charging Station: ${stop.station_id}<br>Power: ${stop.power_kw} kW<br>Type: ${stop.type}`);
      markersRef.current.push(marker);
    });

    // Fit map to route bounds
    mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [20, 20] });
  };

  const displayComparisonRoutes = () => {
    if (!comparisonData || !comparisonData.routes) {
      displayDefaultMap();
      return;
    }

    const routeColors = {
      dijkstra: '#667eea',
      astar: '#28a745',
      multi_objective: '#ffc107'
    };

    Object.entries(comparisonData.routes).forEach(([model, route]) => {
      if (route.route_coordinates && route.route_coordinates.length >= 2) {
        const coordinates = route.route_coordinates.map(coord => [coord[0], coord[1]]);
        const color = routeColors[model] || '#666';
        
        const polyline = L.polyline(coordinates, {
          color: color,
          weight: 4,
          opacity: 0.7,
          dashArray: model === 'multi_objective' ? '10, 5' : null
        }).addTo(mapInstanceRef.current);
        polylinesRef.current.push(polyline);

        // Add legend
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = function() {
          const div = L.DomUtil.create('div', 'info legend');
          div.style.backgroundColor = 'white';
          div.style.padding = '10px';
          div.style.borderRadius = '5px';
          div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
          
          let legendHTML = '<h4>Route Comparison</h4>';
          Object.entries(routeColors).forEach(([modelName, color]) => {
            legendHTML += `<div style="margin: 5px 0;">
              <span style="display: inline-block; width: 20px; height: 4px; background: ${color}; margin-right: 8px;"></span>
              ${modelName.charAt(0).toUpperCase() + modelName.slice(1)}
            </div>`;
          });
          div.innerHTML = legendHTML;
          return div;
        };
        legend.addTo(mapInstanceRef.current);
      }
    });

    // Fit map to show all routes
    if (polylinesRef.current.length > 0) {
      const group = new L.featureGroup(polylinesRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
    }
  };

  const getMarkerIcon = (type) => {
    const colors = {
      station: '#007bff',
      landmark: '#6c757d',
      park: '#28a745'
    };
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${colors[type] || '#666'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

  const getRouteColor = (model) => {
    const colors = {
      dijkstra: '#667eea',
      astar: '#28a745',
      multi_objective: '#ffc107'
    };
    return colors[model] || '#666';
  };

  if (!routeData && !comparisonData) {
    return (
      <MapPlaceholder>
        <div>
          <h3>Amsterdam Route Map</h3>
          <p>Select route parameters to view the optimized path</p>
        </div>
      </MapPlaceholder>
    );
  }

  return <MapContainer ref={mapRef} />;
};

export default RouteMap; 