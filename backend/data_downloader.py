# backend/data_downloader.py
# This script is responsible for downloading and saving the necessary data for the EV routing application.

import os
import osmnx as ox
import pandas as pd
import requests
import json
from typing import List, Dict, Any

# --- Configuration ---
# Define the location for our map data
LOCATION = "Amsterdam, Netherlands"
# Define the coordinates for the center of Amsterdam
AMSTERDAM_COORDS = (52.3676, 4.9041) # Latitude, Longitude

# Define the output directory for our data files
DATA_DIR = "data"

# Define the output file paths
GRAPH_FILE = os.path.join(DATA_DIR, "amsterdam.graphml")
STATIONS_FILE = os.path.join(DATA_DIR, "amsterdam_stations.json")

# OpenChargeMap API Configuration
OCM_API_KEY = "14402eda-48ca-4832-b2e4-fce9aa6e40b8"
OCM_BASE_URL = "https://api.openchargemap.io/v3"

def fetch_charging_stations(latitude: float, longitude: float, distance: int = 20, max_results: int = 5000) -> List[Dict[Any, Any]]:
    """
    Fetch charging stations from OpenChargeMap API within a radius of a central point.
    
    Args:
        latitude: The latitude of the search center.
        longitude: The longitude of the search center.
        distance: The search radius in kilometers.
        max_results: Maximum number of results to fetch.
        
    Returns:
        List of charging station data.
    """
    headers = {
        'X-API-Key': OCM_API_KEY,
        'Accept': 'application/json'
    }
    
    params = {
        'latitude': latitude,
        'longitude': longitude,
        'distance': distance,
        'distanceunit': 'km',
        'maxresults': max_results,
        'compact': True,
        'verbose': False
    }
    
    try:
        response = requests.get(f"{OCM_BASE_URL}/poi", headers=headers, params=params)
        response.raise_for_status()
        
        stations = response.json()
        print(f"Successfully fetched {len(stations)} charging stations")
        return stations
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching charging stations: {e}")
        return []

def download_data():
    """
    Main function to download and save the road network and charging station data.
    """
    # 1. Create the data directory if it doesn't exist
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        print(f"Created directory: {DATA_DIR}")

    # 2. Download and save the road network graph for Amsterdam (if it doesn't exist)
    if not os.path.exists(GRAPH_FILE):
        print(f"Downloading road network for '{LOCATION}'...")
        graph = ox.graph_from_place(LOCATION, network_type="drive")
        ox.save_graphml(graph, GRAPH_FILE)
        print(f"Road network graph saved to: {GRAPH_FILE}")
    else:
        print(f"Road network graph already exists at: {GRAPH_FILE}")

    # 3. Fetch charging station data from OpenChargeMap API
    print("Fetching charging station data from OpenChargeMap...")
    
    # Use the new radius-based search function
    stations = fetch_charging_stations(
        latitude=AMSTERDAM_COORDS[0],
        longitude=AMSTERDAM_COORDS[1],
        distance=20 # Search in a 20km radius around the center
    )
    
    if stations:
        # Save the results to a JSON file
        with open(STATIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(stations, f, indent=2, ensure_ascii=False)
        print(f"Charging station data saved to: {STATIONS_FILE}")
        
        # Print some statistics
        print(f"\nCharging Station Statistics:")
        print(f"Total stations found: {len(stations)}")
        
        # Count stations by connection type
        connection_types = {}
        total_connections = 0
        for station in stations:
            if station and 'Connections' in station and station['Connections'] is not None:
                for connection in station['Connections']:
                    if connection and 'ConnectionTypeID' in connection:
                        conn_type_id = connection.get('ConnectionTypeID', 'Unknown')
                        # Map common connection type IDs to readable names
                        conn_type_map = {
                            1: 'Type 1 (J1772)',
                            2: 'Type 2 (Mennekes)',
                            3: 'Type 3 (Scame)',
                            4: 'CHAdeMO',
                            5: 'CCS/SAE',
                            6: 'Tesla Supercharger',
                            7: 'Tesla Destination',
                            8: 'Tesla (Roadster)',
                            9: 'IEC 60309',
                            10: 'IEC 62196',
                            25: 'Type 2 (Mennekes)',
                            26: 'CHAdeMO',
                            27: 'CCS/SAE',
                            28: 'Type 1 (J1772)',
                            29: 'Tesla Supercharger',
                            30: 'Tesla Destination',
                            31: 'Tesla (Roadster)',
                            32: 'IEC 60309',
                            33: 'IEC 62196'
                        }
                        conn_type = conn_type_map.get(conn_type_id, f'Type {conn_type_id}')
                        connection_types[conn_type] = connection_types.get(conn_type, 0) + 1
                        total_connections += 1
        
        print(f"Total connections found: {total_connections}")
        print(f"Connection types found:")
        for conn_type, count in sorted(connection_types.items(), key=lambda x: x[1], reverse=True):
            print(f"  - {conn_type}: {count}")
        
        # Show some sample station locations
        print(f"\nSample station locations:")
        for i, station in enumerate(stations[:5]):
            if 'AddressInfo' in station and station['AddressInfo']:
                addr = station['AddressInfo']
                print(f"  {i+1}. {addr.get('Title', 'Unknown')} - {addr.get('Town', 'Unknown')}")
                print(f"     Lat: {addr.get('Latitude', 'Unknown')}, Lon: {addr.get('Longitude', 'Unknown')}")
    else:
        print("No charging stations found or error occurred during fetch.")


if __name__ == "__main__":
    # This makes the script runnable from the command line
    download_data()
    print("\nData download process complete.")