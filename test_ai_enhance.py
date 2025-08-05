import requests
import json

def test_ai_enhance():
    url = "http://localhost:8000/api/ai-enhance"
    
    # Test payload with a low battery scenario
    payload = {
        "origin": "Amsterdam_Central",
        "destination": "Oost",  # Longer distance to trigger low battery scenario
        "driver_profile": "eco",
        "routing_model": "dijkstra",
        "battery_capacity_kwh": 40.0,  # Lower capacity to trigger charging
        "current_charge_kwh": 10.0,    # Low charge to force charging stop
        "preferences": {
            "max_walking_distance": 500,  # meters
            "max_waiting_time": 20,       # minutes
            "preferred_charging_networks": ["FastCharge", "EcoPower"]
        }
    }
    
    try:
        print("Sending request to AI enhancement endpoint...")
        print(f"Payload: {json.dumps(payload, indent=2)}\n")
        
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("\nAI-Enhanced Route:")
            data = response.json()
            
            # Print route summary
            print(f"\nRoute from {data.get('origin')} to {data.get('destination')}")
            print(f"Total Distance: {data.get('total_distance_km', 0):.1f} km")
            print(f"Estimated Time: {data.get('estimated_time_min', 0):.1f} min")
            print(f"Energy Used: {data.get('energy_used_kWh', 0):.1f} kWh")
            
            # Print charging stops if any
            charging_stops = data.get('charging_stops', [])
            if charging_stops:
                print("\nCharging Stops:")
                for i, stop in enumerate(charging_stops, 1):
                    print(f"{i}. {stop.get('name')} ({stop.get('type')})")
                    print(f"   - Charge: {stop.get('charge_before', 0):.1f}% → {stop.get('charge_after', 0):.1f}%")
                    print(f"   - Cost: €{stop.get('cost', 0):.2f}")
                    print(f"   - Duration: {stop.get('duration_min', 0)} min")
            
            # Print AI suggestions
            ai_suggestions = data.get('ai_suggestions', [])
            if ai_suggestions:
                print("\nAI Suggestions:")
                for i, suggestion in enumerate(ai_suggestions, 1):
                    print(f"{i}. {suggestion}")
            
            # Print full response at the end
            print("\nFull Response:")
            print(json.dumps(data, indent=2))
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            
        return response.status_code == 200
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing AI Enhancement API...\n")
    success = test_ai_enhance()
    print(f"\nTest {'passed' if success else 'failed'}")
