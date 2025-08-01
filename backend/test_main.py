import pytest
from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert "available_endpoints" in data

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "components" in data

def test_driver_profiles():
    """Test the driver profiles endpoint"""
    response = client.get("/api/driver-profiles")
    assert response.status_code == 200
    data = response.json()
    assert "profiles" in data
    assert "message" in data

def test_locations():
    """Test the locations endpoint"""
    response = client.get("/api/locations")
    assert response.status_code == 200
    data = response.json()
    assert "locations" in data
    assert "message" in data

def test_route_calculation():
    """Test route calculation endpoint"""
    route_request = {
        "origin": "Amsterdam_Central",
        "destination": "Museumplein",
        "driver_profile": "eco",
        "routing_model": "dijkstra",
        "battery_capacity_kwh": 60.0,
        "current_charge_kwh": 45.0,
        "use_ai_enhancement": False,
        "preferences": {}
    }
    
    response = client.post("/api/route", json=route_request)
    assert response.status_code == 200
    data = response.json()
    assert "route" in data
    assert "total_distance_km" in data
    assert "estimated_time_min" in data 