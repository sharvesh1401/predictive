# backend/data_downloader.py
# This script is responsible for downloading and saving the necessary data for the EV routing application.

import os
import osmnx as ox
import pandas as pd
from openchargemap import OpenChargeMap

# --- Configuration ---
# Define the location for our map data
LOCATION = "Amsterdam, Netherlands"

# Define the output directory for our data files
DATA_DIR = "data"

# Define the output file paths
GRAPH_FILE = os.path.join(DATA_DIR, "amsterdam.graphml")
STATIONS_FILE = os.path.join(DATA_DIR, "amsterdam_stations.json")

# --- Main Execution ---
def download_data():
    """
    Main function to download and save the road network and charging station data.
    """
    # 1. Create the data directory if it doesn't exist
    # This is a good practice to avoid errors when saving files.
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        print(f"Created directory: {DATA_DIR}")

    # 2. Download and save the road network graph for Amsterdam
    print(f"Downloading road network for '{LOCATION}'...")
    # This command fetches the map data from OpenStreetMap
    graph = ox.graph_from_place(LOCATION, network_type="drive")
    
    # Save the graph to a file. This allows our main application to load it quickly
    # without having to download it every time.
    ox.save_graphml(graph, GRAPH_FILE)
    print(f"Road network graph saved to: {GRAPH_FILE}")

    # 3. Fetch charging station data from OpenChargeMap API
    # NOTE: You need to set your OpenChargeMap API key as an environment variable named 'OCM_API_KEY'
    # For now, this part is commented out until you get your key.
    # print("Fetching charging station data from OpenChargeMap...")
    # try:
    #     api_key = os.getenv("OCM_API_KEY")
    #     if not api_key:
    #         print("\n--- WARNING ---")
    #         print("OpenChargeMap API key not found.")
    #         print("Set the 'OCM_API_KEY' environment variable to download station data.")
    #         print("Skipping charging station download for now.")
    #         return

    #     client = OpenChargeMap(api_key)
    #     # Get the bounding box of our graph to search for stations
    #     north, south, east, west = graph.nodes(data="y").max(), graph.nodes(data="y").min(), graph.nodes(data="x").max(), graph.nodes(data="x").min()
        
    #     # Make the API call
    #     stations = client.poi(boundingbox=f"({south},{west}),({north},{east})", maxresults=5000)
        
    #     # Save the results to a JSON file
    #     pd.DataFrame(stations).to_json(STATIONS_FILE, orient='records', lines=True)
    #     print(f"Charging station data saved to: {STATIONS_FILE}")

    # except Exception as e:
    #     print(f"An error occurred while fetching charging station data: {e}")


if __name__ == "__main__":
    # This makes the script runnable from the command line
    download_data()
    print("\nData download process complete.")

