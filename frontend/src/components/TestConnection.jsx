import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Alert, Spinner, Tabs, Tab, Table } from 'react-bootstrap';
import config from '../config';
import { simulationAPI } from '../services/api';

const TestConnection = () => {
  // Form state
  const [origin, setOrigin] = useState('Amsterdam_Central');
  const [destination, setDestination] = useState('Museumplein');
  const [driverProfile, setDriverProfile] = useState('eco');
  const [routingModel, setRoutingModel] = useState('dijkstra');
  const [batteryCapacity, setBatteryCapacity] = useState(60);
  const [currentCharge, setCurrentCharge] = useState(45);
  const [useAI, setUseAI] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  
  // Fetch available locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${config.api.baseURL}/api/locations`);
        const data = await response.json();
        if (data.locations) {
          setAvailableLocations(Object.entries(data.locations).map(([id, loc]) => ({
            id,
            ...loc
          })));
        }
      } catch (err) {
        console.error('Failed to fetch locations:', err);
      }
    };
    
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const testPayload = {
      origin,
      destination,
      driver_profile: driverProfile,
      routing_model: routingModel,
      battery_capacity_kwh: parseFloat(batteryCapacity),
      current_charge_kwh: parseFloat(currentCharge),
      use_ai_enhancement: useAI,
      preferences: {}
    };
    
    const startTime = performance.now();
    
    try {
      const result = await simulationAPI.calculateRoutes(testPayload);
      const endTime = performance.now();
      const responseTime = (endTime - startTime).toFixed(2);
      
      const testResult = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        payload: testPayload,
        response: result,
        responseTime: `${responseTime}ms`,
        success: true
      };
      
      setResponse(testResult);
      setTestHistory(prev => [testResult, ...prev].slice(0, 10)); // Keep last 10 tests
    } catch (err) {
      const endTime = performance.now();
      const responseTime = (endTime - startTime).toFixed(2);
      
      const errorMessage = err.response?.data?.detail || err.message || 'Unknown error';
      console.error('API Error:', err);
      
      const testResult = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        payload: testPayload,
        error: errorMessage,
        responseTime: `${responseTime}ms`,
        success: false
      };
      
      setError(errorMessage);
      setTestHistory(prev => [testResult, ...prev].slice(0, 10));
    } finally {
      setLoading(false);
    }
  };
  
  const handleRunTest = (testCase) => {
    setOrigin(testCase.origin);
    setDestination(testCase.destination);
    setDriverProfile(testCase.driverProfile);
    setRoutingModel(testCase.routingModel || 'dijkstra');
    setBatteryCapacity(testCase.batteryCapacity || 60);
    setCurrentCharge(testCase.currentCharge || 45);
    setUseAI(testCase.useAI || false);
  };
  
  const testCases = [
    {
      name: 'Short Eco Trip',
      origin: 'Amsterdam_Central',
      destination: 'Dam_Square',
      driverProfile: 'eco',
      routingModel: 'dijkstra',
      batteryCapacity: 60,
      currentCharge: 30,
      useAI: false
    },
    {
      name: 'Medium Balanced Trip',
      origin: 'Amsterdam_Central',
      destination: 'Vondelpark',
      driverProfile: 'balanced',
      routingModel: 'astar',
      batteryCapacity: 60,
      currentCharge: 45,
      useAI: true
    },
    {
      name: 'Long Sport Trip',
      origin: 'Amsterdam_Central',
      destination: 'Oost',
      driverProfile: 'sport',
      routingModel: 'multi_objective',
      batteryCapacity: 80,
      currentCharge: 60,
      useAI: true
    }
  ];

  return (
    <div className="test-connection">
      <Tabs defaultActiveKey="custom-test" className="mb-3">
        <Tab eventKey="custom-test" title="Custom Test">
          <Card className="mb-4">
            <Card.Header as="h5">Test Backend Connection</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Origin</Form.Label>
                      <Form.Select
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        required
                      >
                        <option value="">Select origin</option>
                        {availableLocations.map(loc => (
                          <option key={`origin-${loc.id}`} value={loc.id}>
                            {loc.name} ({loc.id})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                  
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Destination</Form.Label>
                      <Form.Select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                      >
                        <option value="">Select destination</option>
                        {availableLocations.map(loc => (
                          <option key={`dest-${loc.id}`} value={loc.id}>
                            {loc.name} ({loc.id})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Driver Profile</Form.Label>
                      <Form.Select 
                        value={driverProfile} 
                        onChange={(e) => setDriverProfile(e.target.value)}
                        required
                      >
                        {Object.entries(config.simulation.profiles).map(([key, profile]) => (
                          <option key={key} value={key}>
                            {profile.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                  
                  <div className="col-md-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Routing Model</Form.Label>
                      <Form.Select 
                        value={routingModel} 
                        onChange={(e) => setRoutingModel(e.target.value)}
                        required
                      >
                        <option value="dijkstra">Dijkstra</option>
                        <option value="astar">A*</option>
                        <option value="multi_objective">Multi-Objective</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                  
                  <div className="col-md-4">
                    <Form.Group className="mb-3">
                      <Form.Label>AI Enhancement</Form.Label>
                      <Form.Check 
                        type="switch"
                        id="ai-enhancement"
                        label={useAI ? 'Enabled' : 'Disabled'}
                        checked={useAI}
                        onChange={(e) => setUseAI(e.target.checked)}
                      />
                    </Form.Group>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Battery Capacity (kWh)</Form.Label>
                      <Form.Range 
                        min="20" 
                        max="100" 
                        step="5"
                        value={batteryCapacity}
                        onChange={(e) => setBatteryCapacity(e.target.value)}
                      />
                      <div className="text-center">{batteryCapacity} kWh</div>
                    </Form.Group>
                  </div>
                  
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Current Charge (kWh)</Form.Label>
                      <Form.Range 
                        min="0" 
                        max={batteryCapacity} 
                        step="1"
                        value={currentCharge}
                        onChange={(e) => setCurrentCharge(e.target.value)}
                      />
                      <div className="text-center">
                        {currentCharge} kWh ({Math.round((currentCharge / batteryCapacity) * 100)}%)
                      </div>
                    </Form.Group>
                  </div>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    className="me-md-2"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Testing...
                      </>
                    ) : (
                      'Test Connection'
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => {
                      setResponse(null);
                      setError(null);
                    }}
                  >
                    Clear Results
                  </Button>
                </div>
              </Form>
              
              {error && (
                <Alert variant="danger" className="mt-3">
                  <Alert.Heading>Error</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              )}
              
              {response && (
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Test Results</h5>
                    <small className="text-muted">
                      Response time: {response.responseTime}
                    </small>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2 text-muted">Distance</h6>
                          <h4 className="mb-0">
                            {response.response.total_distance_km.toFixed(1)} km
                          </h4>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2 text-muted">Estimated Time</h6>
                          <h4 className="mb-0">
                            {response.response.estimated_time_min.toFixed(1)} min
                          </h4>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-subtitle mb-2 text-muted">Energy Usage</h6>
                          <h4 className="mb-0">
                            {response.response.energy_used_kWh.toFixed(1)} kWh
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h6>Route Details</h6>
                    <div className="bg-light p-3 rounded">
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {response.response.route.map((step, index) => (
                          <React.Fragment key={step}>
                            <span className="badge bg-primary">
                              {availableLocations.find(loc => loc.id === step)?.name || step}
                            </span>
                            {index < response.response.route.length - 1 && (
                              <span className="text-muted">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="small text-muted">
                        <div className="d-flex justify-content-between">
                          <span>Driver Profile: {response.response.driver_profile}</span>
                          <span>Model: {response.response.routing_model}</span>
                          <span>Stops: {response.response.charging_stops.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h6>Raw Response</h6>
                    <pre className="bg-light p-3 rounded" style={{
                      maxHeight: '300px',
                      overflowY: 'auto',
                      fontSize: '0.85rem'
                    }}>
                      {JSON.stringify(response.response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              <div className="mt-4 pt-3 border-top">
                <h5>Test Cases</h5>
                <p className="text-muted small mb-3">Quickly test with predefined scenarios</p>
                
                <div className="row g-3">
                  {testCases.map((testCase, index) => (
                    <div key={index} className="col-md-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-title">{testCase.name}</h6>
                          <p className="card-text small text-muted">
                            {testCase.origin} → {testCase.destination}<br />
                            Profile: {testCase.driverProfile} | Model: {testCase.routingModel}
                          </p>
                        </div>
                        <div className="card-footer bg-transparent">
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => handleRunTest(testCase)}
                          >
                            Run Test
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="test-history" title="Test History">
          <Card>
            <Card.Header as="h5">Test History</Card.Header>
            <Card.Body>
              {testHistory.length === 0 ? (
                <div className="text-center text-muted py-4">
                  No test history available. Run some tests to see the results here.
                </div>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Route</th>
                        <th>Profile</th>
                        <th>Model</th>
                        <th>Status</th>
                        <th>Time</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testHistory.map(test => (
                        <tr key={test.id} className={test.success ? 'table-success' : 'table-danger'}>
                          <td>{new Date(test.timestamp).toLocaleTimeString()}</td>
                          <td>
                            {test.payload.origin} → {test.payload.destination}
                          </td>
                          <td className="text-capitalize">{test.payload.driver_profile}</td>
                          <td>{test.payload.routing_model}</td>
                          <td>
                            {test.success ? (
                              <span className="badge bg-success">Success</span>
                            ) : (
                              <span className="badge bg-danger">Failed</span>
                            )}
                          </td>
                          <td>{test.responseTime}</td>
                          <td>
                            <Button 
                              variant="link" 
                              size="sm" 
                              onClick={() => {
                                setResponse(test);
                                window.scrollTo(0, 0);
                              }}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
      
      <div className="mt-3 text-muted small">
        <p className="mb-1">
          <strong>API Base URL:</strong> <code>{config.api.baseURL}</code>
        </p>
        <p className="mb-0">
          <strong>Connected to backend:</strong> {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TestConnection;
