import requests

def list_available_locations():
    url = "http://localhost:8000/api/locations"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            print("Available locations:")
            for location_id, location_data in data.get("locations", {}).items():
                print(f"- {location_id} ({location_data.get('name', 'N/A')})")
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_available_locations()
