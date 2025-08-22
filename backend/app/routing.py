"""
Routing integration for the app module.
Bridges the new app structure with existing routing models.
"""
import sys
import os
import logging
from typing import Dict, Any, List, Tuple, Optional

# Add backend root to path to import existing models
backend_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

try:
    from models.routing import AmsterdamRouter, create_amsterdam_graph, RouteResult
    from models.profiles import DriverProfile, profile_manager
    from models.optimizer import RouteOptimizer
except ImportError as e:
    logging.warning(f"Could not import existing routing models: {e}")
    # Fallback definitions
    class RouteResult:
        def __init__(self, route=None, total_distance_km=0, estimated_time_min=0, 
                     energy_used_kWh=0, emissions_grams=0, charging_stops=None, route_coordinates=None):
            self.route = route or []
            self.total_distance_km = total_distance_km
            self.estimated_time_min = estimated_time_min
            self.energy_used_kWh = energy_used_kWh
            self.emissions_grams = emissions_grams
            self.charging_stops = charging_stops or []
            self.route_coordinates = route_coordinates or []

logger = logging.getLogger(__name__)

# Global instances (initialized on first use)
_router = None
_optimizer = None

def _get_router():
    """Get or create the Amsterdam router instance"""
    global _router
    if _router is None:
        try:
            graph = create_amsterdam_graph()
            _router = AmsterdamRouter(graph)
            logger.info("Amsterdam router initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize router: {e}")
            _router = None
    return _router

def _get_optimizer():
    """Get or create the route optimizer instance"""
    global _optimizer
    if _optimizer is None:
        router = _get_router()
        if router:
            try:
                _optimizer = RouteOptimizer(router)
                logger.info("Route optimizer initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize optimizer: {e}")
                _optimizer = None
    return _optimizer

def compute_deterministic_route(graph, origin: str, destination: str, constraints: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compute a deterministic route using the existing routing system.
    
    Args:
        graph: Map graph (can be None, we'll use Amsterdam graph)
        origin: Starting location
        destination: Ending location 
        constraints: Route constraints (battery_capacity, current_charge, etc.)
    
    Returns:
        Dict with route, confidence, and metrics
    """
    try:
        # Get routing parameters from constraints
        battery_capacity = constraints.get("battery_capacity_kwh", 60.0)
        current_charge = constraints.get("current_charge_kwh", 45.0)
        routing_model = constraints.get("routing_model", "dijkstra")
        driver_profile_name = constraints.get("driver_profile", "EFFICIENT")
        
        # Get driver profile
        try:
            driver_profile = DriverProfile(driver_profile_name)
        except:
            driver_profile = DriverProfile.EFFICIENT
            logger.warning(f"Invalid driver profile {driver_profile_name}, using EFFICIENT")
        
        # Get router and calculate route
        router = _get_router()
        if not router:
            # Fallback route
            logger.warning("Router not available, returning fallback route")
            return {
                "route": [origin, destination],
                "confidence": 0.3,
                "metrics": {
                    "distance_m": 5000,  # 5km fallback
                    "duration_s": 1200,  # 20 min fallback
                    "energy_kwh": 1.0,
                    "unknown_segment_fraction": 0.7,
                    "fallbacks": 1
                }
            }
        
        # Calculate route based on model
        if routing_model == "astar":
            route_result = router.astar_route(origin, destination, battery_capacity, current_charge)
        elif routing_model == "multi_objective":
            optimizer = _get_optimizer()
            if optimizer:
                route_result = optimizer.optimize_route(
                    origin, destination, driver_profile, "weighted_sum", 
                    battery_capacity, current_charge
                )
            else:
                route_result = router.dijkstra_route(origin, destination, battery_capacity, current_charge)
        else:  # default to dijkstra
            route_result = router.dijkstra_route(origin, destination, battery_capacity, current_charge)
        
        # Calculate confidence based on route quality
        confidence = _calculate_route_confidence(route_result, constraints)
        
        # Convert to expected format
        return {
            "route": route_result.route,
            "confidence": confidence,
            "metrics": {
                "distance_m": route_result.total_distance_km * 1000,  # Convert to meters
                "duration_s": route_result.estimated_time_min * 60,   # Convert to seconds
                "energy_kwh": route_result.energy_used_kWh,
                "emissions_g": route_result.emissions_grams,
                "charging_stops": len(route_result.charging_stops),
                "unknown_segment_fraction": 0.0,  # Our graph is complete
                "fallbacks": 0
            },
            "route_coordinates": route_result.route_coordinates,
            "charging_stops": route_result.charging_stops
        }
        
    except Exception as e:
        logger.exception(f"Route calculation failed: {e}")
        # Return low-confidence fallback
        return {
            "route": [origin, destination],
            "confidence": 0.2,
            "metrics": {
                "distance_m": 8000,  # 8km fallback
                "duration_s": 1800,  # 30 min fallback  
                "energy_kwh": 1.6,
                "unknown_segment_fraction": 0.9,
                "fallbacks": 1,
                "error": str(e)
            }
        }

def _calculate_route_confidence(route_result: RouteResult, constraints: Dict[str, Any]) -> float:
    """Calculate confidence score for a route result"""
    confidence = 0.9  # Base confidence for successful routing
    
    # Reduce confidence for long routes (uncertainty increases)
    if route_result.total_distance_km > 20:
        confidence -= 0.1
    
    # Reduce confidence for many charging stops (complexity)
    charging_stops = len(route_result.charging_stops)
    if charging_stops > 2:
        confidence -= (charging_stops - 2) * 0.05
    
    # Reduce confidence for very high energy usage
    if route_result.energy_used_kWh > 15:
        confidence -= 0.1
    
    # Boost confidence for efficient routes
    efficiency = route_result.total_distance_km / max(route_result.energy_used_kWh, 0.1)
    if efficiency > 15:  # Good efficiency (>15 km/kWh)
        confidence += 0.05
    
    return max(0.1, min(1.0, confidence))

def get_available_locations() -> List[str]:
    """Get list of available routing locations"""
    router = _get_router()
    if router and router.graph:
        return list(router.graph.nodes())
    return ["Amsterdam_Central", "Dam_Square", "Museumplein"]  # Fallback

def validate_route_request(origin: str, destination: str, constraints: Dict[str, Any]) -> bool:
    """Validate that a route request can be processed"""
    router = _get_router()
    if not router:
        return False
    
    return origin in router.graph.nodes() and destination in router.graph.nodes()
