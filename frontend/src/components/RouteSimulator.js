import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import RouteForm from './RouteForm';
import RouteMap from './RouteMap';
import RouteResults from './RouteResults';
import RouteComparison from './RouteComparison';
import { fetchDriverProfiles, fetchLocations, calculateRoute, compareRoutes } from '../services/api';

const SimulatorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  min-height: calc(100vh - 200px);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: fit-content;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MapContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ResultsContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s ease-in-out infinite;
`;

const RouteSimulator = () => {
  const [driverProfiles, setDriverProfiles] = useState({});
  const [locations, setLocations] = useState({});
  const [routeData, setRouteData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [profilesResponse, locationsResponse] = await Promise.all([
        fetchDriverProfiles(),
        fetchLocations()
      ]);
      
      setDriverProfiles(profilesResponse.profiles);
      setLocations(locationsResponse.locations);
    } catch (err) {
      setError('Failed to load initial data. Please refresh the page.');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteCalculation = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (formData.compareRoutes) {
        const comparison = await compareRoutes(formData);
        setComparisonData(comparison);
        setShowComparison(true);
        setRouteData(null);
      } else {
        const route = await calculateRoute(formData);
        setRouteData(route);
        setShowComparison(false);
        setComparisonData(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to calculate route. Please try again.');
      console.error('Error calculating route:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRouteData(null);
    setComparisonData(null);
    setShowComparison(false);
    setError(null);
  };

  if (loading && !routeData && !comparisonData) {
    return (
      <LoadingOverlay>
        <LoadingSpinner />
      </LoadingOverlay>
    );
  }

  return (
    <SimulatorContainer>
      <Sidebar>
        <RouteForm
          driverProfiles={driverProfiles}
          locations={locations}
          onSubmit={handleRouteCalculation}
          onReset={handleReset}
          loading={loading}
          error={error}
        />
      </Sidebar>
      
      <MainContent>
        <MapContainer>
          <RouteMap
            routeData={routeData}
            comparisonData={comparisonData}
            showComparison={showComparison}
          />
        </MapContainer>
        
        <ResultsContainer>
          {showComparison && comparisonData ? (
            <RouteComparison data={comparisonData} />
          ) : routeData ? (
            <RouteResults data={routeData} />
          ) : (
            <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
              <h3>Route Simulator</h3>
              <p>Configure your route parameters in the sidebar and click "Calculate Route" to get started.</p>
            </div>
          )}
        </ResultsContainer>
      </MainContent>
    </SimulatorContainer>
  );
};

export default RouteSimulator; 