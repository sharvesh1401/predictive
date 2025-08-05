"""
Test script for comparing routes with different driver profiles and scenarios.
"""
import json
import requests
from typing import Dict, Any, List

def test_compare_routes(base_url: str, test_cases: List[Dict[str, Any]]) -> None:
    """Test the compare-routes endpoint with multiple test cases."""
    results = []
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\nTest Case {i}: {test_case['description']}")
        print("-" * 50)
        
        try:
            # Send request to the route endpoint
            response = requests.post(
                f"{base_url}/api/route",
                json=test_case["payload"],
                timeout=30
            )
            response.raise_for_status()
            
            # Get the route result
            route_result = response.json()
            
            # Print the result
            print(f"Profile: {test_case['payload']['driver_profile']}")
            print(f"Origin: {test_case['payload']['origin']} -> Destination: {test_case['payload']['destination']}")
            print(f"Distance: {route_result.get('total_distance_km', 'N/A')} km")
            print(f"Estimated Time: {route_result.get('estimated_time_min', 'N/A')} min")
            print(f"Energy Used: {route_result.get('energy_used_kWh', 'N/A')} kWh")
            
            # Print charging stops if any
            charging_stops = route_result.get('charging_stops', [])
            if charging_stops:
                print(f"Charging Stops: {len(charging_stops)}")
                for j, stop in enumerate(charging_stops, 1):
                    print(f"  {j}. {stop.get('location', 'Unknown')} - {stop.get('charge_time_min', '?')} min")
            
            # Print AI enhancement if available
            ai_enhancement = route_result.get('ai_enhancement')
            if ai_enhancement and 'suggestions' in ai_enhancement and ai_enhancement['suggestions']:
                print("AI Suggestions:")
                for j, suggestion in enumerate(ai_enhancement['suggestions'], 1):
                    print(f"  {j}. {suggestion.get('type', 'Suggestion')}: {suggestion.get('message', 'No message')}")
            
            print("✓ Test passed")
            results.append({"status": "passed", "test_case": test_case['description']})
            
        except requests.exceptions.RequestException as e:
            print(f"✗ Test failed: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Status code: {e.response.status_code}")
                print(f"Response: {e.response.text}")
            results.append({"status": "failed", "test_case": test_case['description'], "error": str(e)})
    
    # Print summary
    print("\nTest Summary:")
    print("=" * 50)
    for i, result in enumerate(results, 1):
        status = "✓ PASSED" if result["status"] == "passed" else "✗ FAILED"
        print(f"{i}. {status} - {result['test_case']}")
        if "error" in result:
            print(f"   Error: {result['error']}")

def main():
    # Base URL of the backend API
    base_url = "http://localhost:8000"
    
    # Test cases for different routing scenarios
    test_cases = [
        {
            "description": "Eco driver with high battery",
            "payload": {
                "origin": "Amsterdam_Central",
                "destination": "Oost",
                "driver_profile": "eco",
                "routing_model": "dijkstra",
                "battery_capacity_kwh": 60.0,
                "current_charge_kwh": 55.0,  # High battery
                "use_ai_enhancement": True,
                "preferences": {
                    "max_walking_distance": 1000,
                    "prefer_fast_charging": False,
                    "avoid_highways": True
                }
            }
        },
        {
            "description": "Eco driver with low battery",
            "payload": {
                "origin": "Amsterdam_Central",
                "destination": "Oost",
                "driver_profile": "eco",
                "routing_model": "dijkstra",
                "battery_capacity_kwh": 60.0,
                "current_charge_kwh": 15.0,  # Low battery
                "use_ai_enhancement": True,
                "preferences": {
                    "max_walking_distance": 1000,
                    "prefer_fast_charging": True,  # May need fast charging
                    "avoid_highways": True
                }
            }
        },
        {
            "description": "Balanced driver with medium battery",
            "payload": {
                "origin": "Amsterdam_Central",
                "destination": "Oost",
                "driver_profile": "balanced",
                "routing_model": "astar",
                "battery_capacity_kwh": 60.0,
                "current_charge_kwh": 30.0,  # Medium battery
                "use_ai_enhancement": True,
                "preferences": {
                    "max_walking_distance": 500,
                    "prefer_fast_charging": True,
                    "avoid_highways": False
                }
            }
        },
        {
            "description": "Performance driver with high battery",
            "payload": {
                "origin": "Amsterdam_Central",
                "destination": "Oost",
                "driver_profile": "sport",
                "routing_model": "astar",
                "battery_capacity_kwh": 75.0,
                "current_charge_kwh": 60.0,  # High battery
                "use_ai_enhancement": True,
                "preferences": {
                    "max_walking_distance": 200,
                    "prefer_fast_charging": True,
                    "avoid_highways": False
                }
            }
        }
    ]
    
    print("Starting Route Tests")
    print("=" * 80)
    
    # Run all test cases
    test_compare_routes(base_url, test_cases)
    
    print("\nAll tests completed!")

if __name__ == "__main__":
    main()
