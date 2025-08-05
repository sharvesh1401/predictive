import requests
import json

def test_route_api():
    url = "http://localhost:8000/api/route"
    
    # Test payload with valid locations
    payload = {
        "origin": "Amsterdam_Central",
        "destination": "Museumplein",
        "driver_profile": "eco",
        "routing_model": "dijkstra",
        "battery_capacity_kwh": 60.0,
        "current_charge_kwh": 45.0,
        "use_ai_enhancement": False,
        "preferences": {}
    }
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print("Response:")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing API connection...")
    success = test_route_api()
    print(f"\nTest {'passed' if success else 'failed'}")
