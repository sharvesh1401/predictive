import networkx as nx
import numpy as np
from typing import List, Dict, Tuple, Optional
from geopy.distance import geodesic
import heapq
from dataclasses import dataclass

@dataclass
class RouteResult:
    """Result of a routing calculation"""
    route: List[str]
    total_distance_km: float
    estimated_time_min: float
    energy_used_kWh: float
    emissions_grams: float
    charging_stops: List[Dict]
    route_coordinates: List[Tuple[float, float]]

class AmsterdamRouter:
    """Router for Amsterdam road network with EV-specific considerations"""
    
    def __init__(self, graph: nx.Graph):
        self.graph = graph
        self.charging_stations = self._load_charging_stations()
        
    def _load_charging_stations(self) -> Dict[str, Dict]:
        """Load Amsterdam charging station data"""
        # Amsterdam charging stations (simplified for demo)
        return {
            "CS001": {"lat": 52.3676, "lon": 4.9041, "type": "fast", "power_kw": 50},
            "CS002": {"lat": 52.3702, "lon": 4.8952, "type": "standard", "power_kw": 22},
            "CS003": {"lat": 52.3654, "lon": 4.9023, "type": "fast", "power_kw": 50},
            "CS004": {"lat": 52.3689, "lon": 4.8891, "type": "standard", "power_kw": 22},
            "CS005": {"lat": 52.3721, "lon": 4.8934, "type": "ultra_fast", "power_kw": 150},
        }
    
    def haversine_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate Haversine distance between two points"""
        return geodesic((lat1, lon1), (lat2, lon2)).kilometers
    
    def dijkstra_route(self, start: str, end: str, battery_capacity_kwh: float = 60.0, 
                      current_charge_kwh: float = 45.0) -> RouteResult:
        """
        Find shortest route using Dijkstra's algorithm with battery constraints
        """
        if start not in self.graph or end not in self.graph:
            raise ValueError(f"Start or end node not found in graph")
        
        # Priority queue: (distance, node, path, battery_remaining)
        pq = [(0, start, [start], current_charge_kwh)]
        visited = set()
        
        while pq:
            distance, current, path, battery = heapq.heappop(pq)
            
            if current == end:
                return self._create_route_result(path, distance, battery_capacity_kwh)
            
            if current in visited:
                continue
                
            visited.add(current)
            
            # Check if we need to charge
            if battery < 5.0:  # Low battery threshold
                charging_stops = self._find_charging_stops(current, battery)
                for cs_id, cs_data in charging_stops.items():
                    if cs_id not in visited:
                        # Add charging stop to path
                        new_path = path + [cs_id]
                        new_battery = min(battery_capacity_kwh, battery + 20.0)  # Charge 20 kWh
                        new_distance = distance + self._get_node_distance(current, cs_id)
                        heapq.heappush(pq, (new_distance, cs_id, new_path, new_battery))
            
            # Explore neighbors
            for neighbor in self.graph.neighbors(current):
                if neighbor not in visited:
                    edge_weight = self.graph[current][neighbor].get('weight', 1.0)
                    energy_consumed = self._calculate_energy_consumption(edge_weight)
                    
                    if battery >= energy_consumed:
                        new_battery = battery - energy_consumed
                        new_distance = distance + edge_weight
                        new_path = path + [neighbor]
                        heapq.heappush(pq, (new_distance, neighbor, new_path, new_battery))
        
        raise ValueError(f"No valid route found from {start} to {end}")
    
    def astar_route(self, start: str, end: str, battery_capacity_kwh: float = 60.0,
                   current_charge_kwh: float = 45.0) -> RouteResult:
        """
        Find optimal route using A* algorithm with battery constraints
        """
        if start not in self.graph or end not in self.graph:
            raise ValueError(f"Start or end node not found in graph")
        
        # Priority queue: (f_score, distance, node, path, battery_remaining)
        pq = [(0, 0, start, [start], current_charge_kwh)]
        visited = set()
        g_scores = {start: 0}
        
        # Get end coordinates for heuristic
        end_coords = self._get_node_coordinates(end)
        
        while pq:
            f_score, distance, current, path, battery = heapq.heappop(pq)
            
            if current == end:
                return self._create_route_result(path, distance, battery_capacity_kwh)
            
            if current in visited:
                continue
                
            visited.add(current)
            
            # Check battery and add charging stops if needed
            if battery < 5.0:
                charging_stops = self._find_charging_stops(current, battery)
                for cs_id, cs_data in charging_stops.items():
                    if cs_id not in visited:
                        new_path = path + [cs_id]
                        new_battery = min(battery_capacity_kwh, battery + 20.0)
                        new_distance = distance + self._get_node_distance(current, cs_id)
                        new_g_score = g_scores.get(current, float('inf')) + new_distance
                        
                        if new_g_score < g_scores.get(cs_id, float('inf')):
                            g_scores[cs_id] = new_g_score
                            h_score = self._heuristic(cs_id, end_coords)
                            f_score = new_g_score + h_score
                            heapq.heappush(pq, (f_score, new_distance, cs_id, new_path, new_battery))
            
            # Explore neighbors
            for neighbor in self.graph.neighbors(current):
                if neighbor not in visited:
                    edge_weight = self.graph[current][neighbor].get('weight', 1.0)
                    energy_consumed = self._calculate_energy_consumption(edge_weight)
                    
                    if battery >= energy_consumed:
                        new_battery = battery - energy_consumed
                        new_distance = distance + edge_weight
                        new_g_score = g_scores.get(current, float('inf')) + edge_weight
                        
                        if new_g_score < g_scores.get(neighbor, float('inf')):
                            g_scores[neighbor] = new_g_score
                            h_score = self._heuristic(neighbor, end_coords)
                            f_score = new_g_score + h_score
                            new_path = path + [neighbor]
                            heapq.heappush(pq, (f_score, new_distance, neighbor, new_path, new_battery))
        
        raise ValueError(f"No valid route found from {start} to {end}")
    
    def _heuristic(self, node: str, end_coords: Tuple[float, float]) -> float:
        """Calculate heuristic distance for A* algorithm"""
        node_coords = self._get_node_coordinates(node)
        return self.haversine_distance(node_coords[0], node_coords[1], 
                                     end_coords[0], end_coords[1])
    
    def _get_node_coordinates(self, node: str) -> Tuple[float, float]:
        """Get coordinates for a node"""
        if node in self.graph.nodes:
            return (self.graph.nodes[node].get('lat', 0), 
                   self.graph.nodes[node].get('lon', 0))
        return (0, 0)
    
    def _get_node_distance(self, node1: str, node2: str) -> float:
        """Calculate distance between two nodes"""
        coords1 = self._get_node_coordinates(node1)
        coords2 = self._get_node_coordinates(node2)
        return self.haversine_distance(coords1[0], coords1[1], coords2[0], coords2[1])
    
    def _calculate_energy_consumption(self, distance_km: float) -> float:
        """Calculate energy consumption for a given distance"""
        # Average EV consumption: 0.2 kWh/km
        return distance_km * 0.2
    
    def _find_charging_stops(self, current_node: str, battery_level: float) -> Dict[str, Dict]:
        """Find nearby charging stations"""
        current_coords = self._get_node_coordinates(current_node)
        nearby_stations = {}
        
        for cs_id, cs_data in self.charging_stations.items():
            distance = self.haversine_distance(current_coords[0], current_coords[1],
                                            cs_data['lat'], cs_data['lon'])
            if distance <= 5.0:  # Within 5km
                nearby_stations[cs_id] = cs_data
        
        return nearby_stations
    
    def _create_route_result(self, route: List[str], distance_km: float, 
                           battery_capacity_kwh: float) -> RouteResult:
        """Create a RouteResult object from route data"""
        # Calculate route statistics
        energy_used = self._calculate_energy_consumption(distance_km)
        estimated_time = distance_km * 2.5  # Assume 24 km/h average speed in city
        emissions = energy_used * 84.5  # Dutch grid emissions factor (g CO2/kWh)
        
        # Extract charging stops
        charging_stops = []
        for node in route:
            if node in self.charging_stations:
                charging_stops.append({
                    "station_id": node,
                    "location": (self.charging_stations[node]['lat'], 
                               self.charging_stations[node]['lon']),
                    "power_kw": self.charging_stations[node]['power_kw'],
                    "type": self.charging_stations[node]['type']
                })
        
        # Get route coordinates
        route_coordinates = []
        for node in route:
            if node in self.graph.nodes:
                route_coordinates.append(self._get_node_coordinates(node))
            elif node in self.charging_stations:
                route_coordinates.append((self.charging_stations[node]['lat'],
                                       self.charging_stations[node]['lon']))
        
        return RouteResult(
            route=route,
            total_distance_km=distance_km,
            estimated_time_min=estimated_time,
            energy_used_kWh=energy_used,
            emissions_grams=emissions,
            charging_stops=charging_stops,
            route_coordinates=route_coordinates
        )

def create_amsterdam_graph() -> nx.Graph:
    """Create a sample Amsterdam road network graph"""
    G = nx.Graph()
    
    # Add major Amsterdam locations as nodes
    locations = {
        "Amsterdam_Central": {"lat": 52.3791, "lon": 4.9003},
        "Dam_Square": {"lat": 52.3730, "lon": 4.8926},
        "Museumplein": {"lat": 52.3579, "lon": 4.8816},
        "Vondelpark": {"lat": 52.3567, "lon": 4.8687},
        "Leidseplein": {"lat": 52.3641, "lon": 4.8833},
        "Rembrandtplein": {"lat": 52.3667, "lon": 4.8950},
        "Jordaan": {"lat": 52.3733, "lon": 4.8792},
        "De_Pijp": {"lat": 52.3558, "lon": 4.8927},
        "Oost": {"lat": 52.3654, "lon": 4.9023},
        "West": {"lat": 52.3689, "lon": 4.8891}
    }
    
    # Add nodes
    for node, coords in locations.items():
        G.add_node(node, lat=coords["lat"], lon=coords["lon"])
    
    # Add edges with distances
    edges = [
        ("Amsterdam_Central", "Dam_Square", 0.8),
        ("Dam_Square", "Rembrandtplein", 0.6),
        ("Rembrandtplein", "Leidseplein", 1.2),
        ("Leidseplein", "Museumplein", 0.5),
        ("Museumplein", "Vondelpark", 0.8),
        ("Leidseplein", "Jordaan", 1.1),
        ("Jordaan", "West", 0.9),
        ("West", "Oost", 2.1),
        ("Oost", "De_Pijp", 1.3),
        ("De_Pijp", "Museumplein", 0.7),
        ("Amsterdam_Central", "Jordaan", 1.0),
        ("Dam_Square", "West", 1.2),
        ("Rembrandtplein", "Oost", 1.8)
    ]
    
    for u, v, weight in edges:
        G.add_edge(u, v, weight=weight)
    
    return G 