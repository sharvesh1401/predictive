import React, { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormSection = styled.div`
  border-bottom: 1px solid #e1e5e9;
  padding-bottom: 1rem;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
`;

const SelectContainer = styled.div`
  .react-select__control {
    border: 2px solid #e1e5e9;
    border-radius: 6px;
    min-height: 40px;
    box-shadow: none;
    
    &:hover {
      border-color: #667eea;
    }
    
    &.react-select__control--is-focused {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }
  
  .react-select__option {
    padding: 8px 12px;
    
    &.react-select__option--is-focused {
      background-color: #f8f9ff;
    }
    
    &.react-select__option--is-selected {
      background-color: #667eea;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
`;

const CheckboxLabel = styled.label`
  font-weight: 500;
  color: #333;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 14px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const SecondaryButton = styled(Button)`
  background: #6c757d;
  color: white;
  
  &:hover:not(:disabled) {
    background: #5a6268;
    transform: translateY(-1px);
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 1rem;
  font-size: 14px;
`;

const InfoText = styled.p`
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const RouteForm = ({ 
  driverProfiles, 
  locations, 
  onSubmit, 
  onReset, 
  loading, 
  error 
}) => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    driverProfile: 'balanced',
    routingModel: 'dijkstra',
    batteryCapacity: 60,
    currentCharge: 45,
    useAIEnhancement: false,
    compareRoutes: false,
    preferences: {}
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      origin: '',
      destination: '',
      driverProfile: 'balanced',
      routingModel: 'dijkstra',
      batteryCapacity: 60,
      currentCharge: 45,
      useAIEnhancement: false,
      compareRoutes: false,
      preferences: {}
    });
    onReset();
  };

  // Convert locations to select options
  const locationOptions = Object.entries(locations).map(([key, location]) => ({
    value: key,
    label: location.name
  }));

  // Convert driver profiles to select options
  const profileOptions = Object.entries(driverProfiles).map(([key, profile]) => ({
    value: key,
    label: profile.name,
    description: profile.description
  }));

  const routingModelOptions = [
    { value: 'dijkstra', label: 'Dijkstra (Shortest Distance)' },
    { value: 'astar', label: 'A* (Heuristic Optimization)' },
    { value: 'multi_objective', label: 'Multi-Objective Optimization' }
  ];

  return (
    <FormContainer onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <FormSection>
        <SectionTitle>📍 Route Configuration</SectionTitle>
        
        <FormGroup>
          <Label>Origin</Label>
          <SelectContainer>
            <Select
              classNamePrefix="react-select"
              options={locationOptions}
              value={locationOptions.find(option => option.value === formData.origin)}
              onChange={(option) => handleInputChange('origin', option?.value || '')}
              placeholder="Select starting location..."
              isClearable
              isSearchable
            />
          </SelectContainer>
        </FormGroup>
        
        <FormGroup>
          <Label>Destination</Label>
          <SelectContainer>
            <Select
              classNamePrefix="react-select"
              options={locationOptions}
              value={locationOptions.find(option => option.value === formData.destination)}
              onChange={(option) => handleInputChange('destination', option?.value || '')}
              placeholder="Select destination..."
              isClearable
              isSearchable
            />
          </SelectContainer>
        </FormGroup>
      </FormSection>
      
      <FormSection>
        <SectionTitle>👤 Driver Profile</SectionTitle>
        
        <FormGroup>
          <Label>Profile Type</Label>
          <SelectContainer>
            <Select
              classNamePrefix="react-select"
              options={profileOptions}
              value={profileOptions.find(option => option.value === formData.driverProfile)}
              onChange={(option) => handleInputChange('driverProfile', option?.value || 'balanced')}
              placeholder="Select driver profile..."
              formatOptionLabel={(option) => (
                <div>
                  <div style={{ fontWeight: 'bold' }}>{option.label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{option.description}</div>
                </div>
              )}
            />
          </SelectContainer>
        </FormGroup>
      </FormSection>
      
      <FormSection>
        <SectionTitle>🔋 Battery Configuration</SectionTitle>
        
        <FormGroup>
          <Label>Battery Capacity (kWh)</Label>
          <Input
            type="number"
            min="20"
            max="100"
            value={formData.batteryCapacity}
            onChange={(e) => handleInputChange('batteryCapacity', parseFloat(e.target.value))}
            placeholder="60"
          />
          <InfoText>Typical EV battery capacity: 40-80 kWh</InfoText>
        </FormGroup>
        
        <FormGroup>
          <Label>Current Charge (kWh)</Label>
          <Input
            type="number"
            min="0"
            max={formData.batteryCapacity}
            value={formData.currentCharge}
            onChange={(e) => handleInputChange('currentCharge', parseFloat(e.target.value))}
            placeholder="45"
          />
          <InfoText>Current battery level before departure</InfoText>
        </FormGroup>
      </FormSection>
      
      <FormSection>
        <SectionTitle>⚙️ Routing Options</SectionTitle>
        
        <FormGroup>
          <Label>Routing Algorithm</Label>
          <SelectContainer>
            <Select
              classNamePrefix="react-select"
              options={routingModelOptions}
              value={routingModelOptions.find(option => option.value === formData.routingModel)}
              onChange={(option) => handleInputChange('routingModel', option?.value || 'dijkstra')}
              placeholder="Select routing algorithm..."
            />
          </SelectContainer>
        </FormGroup>
        
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="aiEnhancement"
            checked={formData.useAIEnhancement}
            onChange={(e) => handleInputChange('useAIEnhancement', e.target.checked)}
          />
          <CheckboxLabel htmlFor="aiEnhancement">
            Use AI Enhancement
          </CheckboxLabel>
        </CheckboxContainer>
        
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="compareRoutes"
            checked={formData.compareRoutes}
            onChange={(e) => handleInputChange('compareRoutes', e.target.checked)}
          />
          <CheckboxLabel htmlFor="compareRoutes">
            Compare Multiple Routes
          </CheckboxLabel>
        </CheckboxContainer>
      </FormSection>
      
      <ButtonGroup>
        <SecondaryButton type="button" onClick={handleReset} disabled={loading}>
          Reset
        </SecondaryButton>
        <PrimaryButton type="submit" disabled={loading || !formData.origin || !formData.destination}>
          {loading ? 'Calculating...' : formData.compareRoutes ? 'Compare Routes' : 'Calculate Route'}
        </PrimaryButton>
      </ButtonGroup>
    </FormContainer>
  );
};

export default RouteForm; 