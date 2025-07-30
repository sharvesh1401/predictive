import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ResultsHeader = styled.div`
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

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetricCard = styled.div`
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%);
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const MetricValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const MetricUnit = styled.div`
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.25rem;
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

const ChargingStopsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ChargingStop = styled.div`
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StopInfo = styled.div`
  flex: 1;
`;

const StopName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const StopDetails = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const StopPower = styled.div`
  background: #ffc107;
  color: #333;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const AIEnhancementSection = styled.div`
  background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const AIHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const ConfidenceBadge = styled.span`
  background: ${props => props.confidence > 0.7 ? '#28a745' : props.confidence > 0.4 ? '#ffc107' : '#dc3545'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const RouteResults = ({ data }) => {
  if (!data) return null;

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
    return `${grams.toFixed(0)} g CO₂`;
  };

  // Prepare data for charts
  const chartData = [
    { name: 'Distance', value: data.total_distance_km, unit: 'km' },
    { name: 'Time', value: data.estimated_time_min, unit: 'min' },
    { name: 'Energy', value: data.energy_used_kWh, unit: 'kWh' },
    { name: 'Cost', value: data.cost_euros, unit: '€' },
  ];

  return (
    <ResultsContainer>
      <ResultsHeader>
        <Title>Route Results</Title>
        <Subtitle>
          {data.routing_model.charAt(0).toUpperCase() + data.routing_model.slice(1)} • {data.driver_profile.charAt(0).toUpperCase() + data.driver_profile.slice(1)} Driver
        </Subtitle>
      </ResultsHeader>

      <MetricsGrid>
        <MetricCard>
          <MetricValue>{formatDistance(data.total_distance_km)}</MetricValue>
          <MetricLabel>Total Distance</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{formatTime(data.estimated_time_min)}</MetricValue>
          <MetricLabel>Estimated Time</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{formatEnergy(data.energy_used_kWh)}</MetricValue>
          <MetricLabel>Energy Usage</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{formatCost(data.cost_euros)}</MetricValue>
          <MetricLabel>Total Cost</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{formatEmissions(data.emissions_grams)}</MetricValue>
          <MetricLabel>CO₂ Emissions</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{data.charging_stops.length}</MetricValue>
          <MetricLabel>Charging Stops</MetricLabel>
        </MetricCard>
      </MetricsGrid>

      <Section>
        <SectionTitle>📊 Route Metrics</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, name]}
              labelFormatter={(label) => `${label} (${chartData.find(d => d.name === label)?.unit})`}
            />
            <Bar dataKey="value" fill="#667eea" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {data.charging_stops.length > 0 && (
        <Section>
          <SectionTitle>🔌 Charging Stops</SectionTitle>
          <ChargingStopsList>
            {data.charging_stops.map((stop, index) => (
              <ChargingStop key={index}>
                <StopInfo>
                  <StopName>{stop.station_id}</StopName>
                  <StopDetails>
                    Type: {stop.type} • Location: {stop.location[0].toFixed(4)}, {stop.location[1].toFixed(4)}
                  </StopDetails>
                </StopInfo>
                <StopPower>{stop.power_kw} kW</StopPower>
              </ChargingStop>
            ))}
          </ChargingStopsList>
        </Section>
      )}

      {data.ai_enhancement && (
        <AIEnhancementSection>
          <AIHeader>
            <span>🤖 AI Enhancement</span>
            <ConfidenceBadge confidence={data.ai_enhancement.confidence_score}>
              {Math.round(data.ai_enhancement.confidence_score * 100)}% Confidence
            </ConfidenceBadge>
          </AIHeader>
          <p style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
            {data.ai_enhancement.reasoning}
          </p>
          {data.ai_enhancement.alternative_suggestions.length > 0 && (
            <div>
              <strong style={{ fontSize: '0.9rem' }}>Suggestions:</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                {data.ai_enhancement.alternative_suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <strong>{suggestion.type}:</strong> {suggestion.description} 
                    {suggestion.expected_improvement && ` (${suggestion.expected_improvement})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </AIEnhancementSection>
      )}

      <Section>
        <SectionTitle>📍 Route Details</SectionTitle>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          <p><strong>Route:</strong> {data.route.join(' → ')}</p>
          <p><strong>Algorithm:</strong> {data.routing_model.charAt(0).toUpperCase() + data.routing_model.slice(1)}</p>
          <p><strong>Driver Profile:</strong> {data.driver_profile.charAt(0).toUpperCase() + data.driver_profile.slice(1)}</p>
        </div>
      </Section>
    </ResultsContainer>
  );
};

export default RouteResults; 