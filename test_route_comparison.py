"""
Test script for comparing different routing models for a single driver profile.
"""
import json
import requests
import time
import sys
from typing import Dict, Any, List, Optional

def debug_print_request_response(response, request_data=None):
    """Print detailed information about the request and response for debugging"""
    print("\n=== DEBUG INFORMATION ===")
    
    if request_data is not None:
        print("Request Data:")
        print(json.dumps(request_data, indent=2))
    
    print(f"\nStatus Code: {response.status_code}")
    
    print("\nResponse Headers:")
    for header, value in response.headers.items():
        print(f"  {header}: {value}")
    
    try:
        print("\nResponse Body:")
        print(json.dumps(response.json(), indent=2))
    except ValueError:
        print("\nResponse Content (non-JSON):")
        print(response.text)
    
    print("======================\n")

def print_debug_info(response, request_data=None):
    """Print detailed information about the request and response for debugging"""
    print("\n=== DEBUG INFORMATION ===")
    
    if request_data is not None:
        print("Request Data:")
        print(json.dumps(request_data, indent=2))
    
    print(f"\nStatus Code: {response.status_code}")
    
    print("\nResponse Headers:")
    for header, value in response.headers.items():
        print(f"  {header}: {value}")
    
    try:
        print("\nResponse Body:")
        print(json.dumps(response.json(), indent=2))
    except ValueError:
        print("\nResponse Content (non-JSON):")
        print(response.text)
    
    print("======================\n")

def test_health_check(base_url):
    """Test the health check endpoint"""
    print("\nTesting health check endpoint...")
    try:
        response = requests.get(f"{base_url}/api/health")
        print(f"Health check status code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {str(e)}")
        return False

def test_available_locations(base_url):
    """Test the available locations endpoint"""
    print("\nTesting available locations endpoint...")
    try:
        response = requests.get(f"{base_url}/api/locations")
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            locations = response.json()
            print(f"Available locations: {', '.join(locations)}")
            return locations
        else:
            print(f"Error: {response.text}")
            return []
    except Exception as e:
        print(f"Error testing locations endpoint: {str(e)}")
        return []

def main():
    # Base URL of the backend API
    base_url = "http://localhost:8000"
    
    # Test health check first
    if not test_health_check(base_url):
        print("\n❌ Backend health check failed. Please ensure the backend is running.")
        return
    
    # Get available locations
    locations = test_available_locations(base_url)
    if not locations:
        print("\n❌ No locations available for testing. Please check the backend.")
        return
    
    # Test cases for different routing scenarios
    test_cases = [
        {
            "description": "Eco driver comparing routing models",
            "payload": {
                "origin": "Amsterdam_Central",
                "destination": "Oost",
                "driver_profile": "eco",
                "routing_model": "dijkstra",  # This will be ignored by compare-routes
                "battery_capacity_kwh": 60.0,
                "current_charge_kwh": 30.0,
                "use_ai_enhancement": True,
                "preferences": {
                    "max_walking_distance": 1000,
                    "prefer_fast_charging": False,
                    "avoid_highways": True
                }
            }
        },
        {
            "description": "Performance driver comparing routing models",
            "payload": {
                "origin": "Amsterdam_Central",
                "destination": "Oost",
                "driver_profile": "sport",
                "routing_model": "astar",  # This will be ignored by compare-routes
                "battery_capacity_kwh": 75.0,
                "current_charge_kwh": 40.0,
                "use_ai_enhancement": True,
                "preferences": {
                    "max_walking_distance": 200,
                    "prefer_fast_charging": True,
                    "avoid_highways": False
                }
            }
        }
    ]
    
    print("Starting Route Comparison Tests")
    print("=" * 80)
    
    for test_case in test_cases:
        print(f"\nTest Case: {test_case['description']}")
        print("-" * 50)
        
        try:
            # Print the test case being executed
            print(f"\n=== EXECUTING TEST CASE: {test_case['description']} ===")
            print("\nPayload being sent:")
            print(json.dumps(test_case["payload"], indent=2))
            
            # Send request to the compare-routes endpoint
            try:
                start_time = time.time()
                response = requests.post(
                    f"{base_url}/api/compare-routes",
                    json=test_case["payload"],
                    timeout=30
                )
                elapsed_time = time.time() - start_time
                
                print(f"\nResponse time: {elapsed_time:.2f} seconds")
                print(f"Status code: {response.status_code}")
                
                # Print response headers for debugging
                print("\nResponse headers:")
                for header, value in response.headers.items():
                    print(f"  {header}: {value}")
                
                # Print response body (truncated if too long)
                try:
                    response_json = response.json()
                    print("\nResponse body (first 1000 chars):")
                    response_str = json.dumps(response_json, indent=2)
                    print(response_str[:1000] + ('...' if len(response_str) > 1000 else ''))
                    
                    # If there was an error, print the full response
                    if response.status_code >= 400:
                        print("\nFull error response:")
                        print(response_str)
                        
                except ValueError:
                    print("\nResponse body (not JSON):")
                    print(response.text[:1000] + ('...' if len(response.text) > 1000 else ''))
                
                response.raise_for_status()
                
                # Get the comparison result
                comparison = response.json()
                
            except requests.exceptions.RequestException as e:
                print(f"\n=== REQUEST FAILED ===")
                print(f"Error: {str(e)}")
                if hasattr(e, 'response') and e.response is not None:
                    print_debug_info(e.response, test_case["payload"])
                raise
            
            # Print the comparison
            print(f"Profile: {test_case['payload']['driver_profile']}")
            print(f"Origin: {test_case['payload']['origin']} -> Destination: {test_case['payload']['destination']}")
            
            # Print each route in the comparison
            for model, route in comparison.get('routes', {}).items():
                print(f"\nModel: {model}")
                print(f"  - Distance: {route.get('total_distance_km', 'N/A')} km")
                print(f"  - Estimated Time: {route.get('estimated_time_min', 'N/A')} min")
                print(f"  - Energy Used: {route.get('energy_used_kWh', 'N/A')} kWh")
                
                # Print charging stops if any
                charging_stops = route.get('charging_stops', [])
                if charging_stops:
                    print(f"  - Charging Stops: {len(charging_stops)}")
                    for i, stop in enumerate(charging_stops, 1):
                        print(f"    {i}. {stop.get('location', 'Unknown')} - {stop.get('charge_time_min', '?')} min")
            
            # Print summary
            summary = comparison.get('summary', {})
            if summary:
                print("\nSummary:")
                for key, value in summary.items():
                    print(f"  - Best {key}: {value}")
            
            print("\n✓ Test passed")
            
        except requests.exceptions.RequestException as e:
            print(f"✗ Test failed: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Status code: {e.response.status_code}")
                print(f"Response: {e.response.text}")
    
    print("\nAll tests completed!")

if __name__ == "__main__":
    main()
