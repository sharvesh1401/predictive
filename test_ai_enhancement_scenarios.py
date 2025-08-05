"""
Test script for AI enhancement endpoint with various scenarios.
"""
import json
import requests
from typing import Dict, Any

def test_ai_enhancement(base_url: str, test_data: Dict[str, Any]) -> None:
    """Test the AI enhancement endpoint with the given test data."""
    print(f"\nTesting scenario: {test_data['description']}")
    print("-" * 50)
    
    try:
        # Send request to the AI enhancement endpoint
        response = requests.post(
            f"{base_url}/api/ai-enhance",
            json=test_data["payload"],
            timeout=10
        )
        response.raise_for_status()
        
        # Print the response
        print("Response:")
        print(json.dumps(response.json(), indent=2))
        print("✓ Test passed")
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Test failed: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Status code: {e.response.status_code}")
            print(f"Response: {e.response.text}")

def main():
    # Base URL of the backend API
    base_url = "http://localhost:8000"
    
    # Test scenarios
    scenarios = [
        {
            "description": "Low battery scenario",
            "payload": {
                "origin": "Amsterdam_Central",
                "destination": "Oost",
                "driver_profile": "eco",
                "routing_model": "dijkstra",
                "battery_capacity_kwh": 40.0,
                "current_charge_kwh": 5.0,  # Low battery
                "preferences": {
                    "max_walking_distance": 500,
                    "prefer_fast_charging": True,
                    "avoid_highways": False
                }
            }
        },
        {
            "description": "Sufficient battery scenario",
            "payload": {
                "origin": "Amsterdam_Central",
                "destination": "Oost",
                "driver_profile": "balanced",
                "routing_model": "astar",
                "battery_capacity_kwh": 60.0,
                "current_charge_kwh": 45.0,  # Sufficient battery
                "preferences": {
                    "max_walking_distance": 300,
                    "prefer_fast_charging": False,
                    "avoid_highways": True
                }
            }
        },
        {
            "description": "Performance profile with low battery",
            "payload": {
                "origin": "Amsterdam_Central",
                "destination": "Oost",
                "driver_profile": "sport",
                "routing_model": "dijkstra",
                "battery_capacity_kwh": 75.0,
                "current_charge_kwh": 10.0,  # Low battery for performance profile
                "preferences": {
                    "max_walking_distance": 200,
                    "prefer_fast_charging": True,
                    "avoid_highways": False
                }
            }
        },
        {
            "description": "Eco profile with sufficient battery",
            "payload": {
                "origin": "Amsterdam_Central",
                "destination": "Oost",
                "driver_profile": "eco",
                "routing_model": "astar",
                "battery_capacity_kwh": 50.0,
                "current_charge_kwh": 40.0,  # Sufficient battery for eco profile
                "preferences": {
                    "max_walking_distance": 1000,
                    "prefer_fast_charging": False,
                    "avoid_highways": True
                }
            }
        }
    ]
    
    print("Starting AI Enhancement Endpoint Tests")
    print("=" * 80)
    
    # Run all test scenarios
    for scenario in scenarios:
        test_ai_enhancement(base_url, scenario)
    
    print("\nAll tests completed!")

if __name__ == "__main__":
    main()
