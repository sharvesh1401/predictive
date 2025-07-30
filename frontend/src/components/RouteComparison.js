import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ComparisonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ComparisonHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const SummarySection = styled.div`
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%);
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SummaryTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const SummaryCard = styled.div`
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
`;

const BestLabel = styled.div`
  background: #28a745;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: inline-block;
`;

const AlgorithmName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const MetricValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #667eea;
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RoutesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const RouteCard = styled.div`
  border: 2px solid ${props => props.isBest ? '#28a745' : '#e1e5e9'};
  border-radius: 8px;
  padding: 1rem;
  background: ${props => props.isBest ? '#f8fff8' : 'white'};
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const RouteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const RouteName = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
`;

const RouteColor = styled.div`
  width: 20px;
  height: 4px;
  background: ${props => props.color};
  border-radius: 2px;
`;

const RouteMetrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const RouteMetric = styled.div`
  text-align: center;
`;

const RouteMetricValue = styled.div`
  font-weight: 600;
  color: #667eea;
  font-size: 1rem;
`;

const RouteMetricLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const RouteComparison = ({ data }) => {
  if (!data || !data.routes) return null;

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDistance = (km) => {
    return `${km.toFixed(1)} km`;
  };

  const formatEnergy = (kwh) => {
    return `${kwh.toFixed(1)} kWh`;
  };

  const formatCost = (euros) => {
    return `€${euros.toFixed(2)}`;
  };

  const formatEmissions = (grams) => {
    return `${grams.toFixed(0)} g`;
  };

  // Prepare data for comparison charts
  const chartData = Object.entries(data.routes).map(([model, route]) => ({
    name: model.charAt(0).toUpperCase() + model.slice(1),
    distance: route.total_distance_km,
    time: route.estimated_time_min,
    energy: route.energy_used_kWh,
    cost: route.cost_euros,
    emissions: route.emissions_grams
  }));

  const routeColors = {
    dijkstra: '#667eea',
    astar: '#28a745',
    multi_objective: '#ffc107'
  };

  const getBestRoute = (metric) => {
    return Object.entries(data.routes).reduce((best, [model, route]) => {
      const currentValue = route[metric];
      const bestValue = best ? data.routes[best][metric] : Infinity;
      return currentValue < bestValue ? model : best;
    }, null);
  };

  const bestTime = getBestRoute('estimated_time_min');
  const bestDistance = getBestRoute('total_distance_km');
  const bestEnergy = getBestRoute('energy_used_kWh');
  const bestCost = getBestRoute('cost_euros');

  return (
    <ComparisonContainer>
      <ComparisonHeader>
        <Title>Route Comparison</Title>
        <Subtitle>Comparing different routing algorithms for your journey</Subtitle>
      </ComparisonHeader>

      <SummarySection>
        <SummaryTitle>🏆 Best Routes by Category</SummaryTitle>
        <SummaryGrid>
          <SummaryCard>
            <BestLabel>Fastest</BestLabel>
            <AlgorithmName>{bestTime?.charAt(0).toUpperCase() + bestTime?.slice(1)}</AlgorithmName>
            <MetricValue>{formatTime(data.routes[bestTime]?.estimated_time_min)}</MetricValue>
          </SummaryCard>
          
          <SummaryCard>
            <BestLabel>Shortest</BestLabel>
            <AlgorithmName>{bestDistance?.charAt(0).toUpperCase() + bestDistance?.slice(1)}</AlgorithmName>
            <MetricValue>{formatDistance(data.routes[bestDistance]?.total_distance_km)}</MetricValue>
          </SummaryCard>
          
          <SummaryCard>
            <BestLabel>Most Efficient</BestLabel>
            <AlgorithmName>{bestEnergy?.charAt(0).toUpperCase() + bestEnergy?.slice(1)}</AlgorithmName>
            <MetricValue>{formatEnergy(data.routes[bestEnergy]?.energy_used_kWh)}</MetricValue>
          </SummaryCard>
          
          <SummaryCard>
            <BestLabel>Cheapest</BestLabel>
            <AlgorithmName>{bestCost?.charAt(0).toUpperCase() + bestCost?.slice(1)}</AlgorithmName>
            <MetricValue>{formatCost(data.routes[bestCost]?.cost_euros)}</MetricValue>
          </SummaryCard>
        </SummaryGrid>
      </SummarySection>

      <Section>
        <SectionTitle>📊 Performance Comparison</SectionTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => {
                const formatters = {
                  distance: (v) => `${v.toFixed(1)} km`,
                  time: (v) => formatTime(v),
                  energy: (v) => `${v.toFixed(1)} kWh`,
                  cost: (v) => `€${v.toFixed(2)}`,
                  emissions: (v) => `${v.toFixed(0)} g CO₂`
                };
                return [formatters[name] ? formatters[name](value) : value, name.charAt(0).toUpperCase() + name.slice(1)];
              }}
            />
            <Legend />
            <Bar dataKey="distance" fill="#667eea" name="distance" />
            <Bar dataKey="time" fill="#28a745" name="time" />
            <Bar dataKey="energy" fill="#ffc107" name="energy" />
            <Bar dataKey="cost" fill="#dc3545" name="cost" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      <Section>
        <SectionTitle>🛣️ Route Details</SectionTitle>
        <RoutesGrid>
          {Object.entries(data.routes).map(([model, route]) => (
            <RouteCard 
              key={model} 
              isBest={model === bestTime || model === bestDistance || model === bestEnergy || model === bestCost}
            >
              <RouteHeader>
                <RouteName>{model.charAt(0).toUpperCase() + model.slice(1)}</RouteName>
                <RouteColor color={routeColors[model]} />
              </RouteHeader>
              
              <RouteMetrics>
                <RouteMetric>
                  <RouteMetricValue>{formatDistance(route.total_distance_km)}</RouteMetricValue>
                  <RouteMetricLabel>Distance</RouteMetricLabel>
                </RouteMetric>
                
                <RouteMetric>
                  <RouteMetricValue>{formatTime(route.estimated_time_min)}</RouteMetricValue>
                  <RouteMetricLabel>Time</RouteMetricLabel>
                </RouteMetric>
                
                <RouteMetric>
                  <RouteMetricValue>{formatEnergy(route.energy_used_kWh)}</RouteMetricValue>
                  <RouteMetricLabel>Energy</RouteMetricLabel>
                </RouteMetric>
                
                <RouteMetric>
                  <RouteMetricValue>{formatCost(route.cost_euros)}</RouteMetricValue>
                  <RouteMetricLabel>Cost</RouteMetricLabel>
                </RouteMetric>
              </RouteMetrics>
              
              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                <div><strong>Charging Stops:</strong> {route.charging_stops.length}</div>
                <div><strong>Emissions:</strong> {formatEmissions(route.emissions_grams)} CO₂</div>
              </div>
            </RouteCard>
          ))}
        </RoutesGrid>
      </Section>

      <Section>
        <SectionTitle>📈 Emissions Comparison</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value.toFixed(0)} g CO₂`, 'Emissions']}
            />
            <Bar dataKey="emissions" fill="#6c757d" />
          </BarChart>
        </ResponsiveContainer>
      </Section>
    </ComparisonContainer>
  );
};

export default RouteComparison; 