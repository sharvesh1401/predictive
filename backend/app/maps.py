"""
Map data management for the app module.
Handles caching and fetching of map graphs for different regions.
"""
import os
import sys
import pickle
import logging
import requests
from typing import Optional, Dict, Any
import tempfile
from pathlib import Path

# Add backend root to path to import existing models
backend_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

try:
    from models.routing import create_amsterdam_graph
    import networkx as nx
except ImportError as e:
    logging.warning(f"Could not import existing routing models: {e}")
    # Create minimal fallback
    import networkx as nx
    def create_amsterdam_graph():
        return nx.Graph()

logger = logging.getLogger(__name__)

# Cache directory for map data
CACHE_DIR = Path(tempfile.gettempdir()) / "predictive_routing_cache"
CACHE_DIR.mkdir(exist_ok=True)

# Global cache for loaded graphs
_graph_cache = {}

def get_cached_graph(region: str = "netherlands") -> Optional[Any]:
    """
    Get a cached map graph for the specified region.
    
    Args:
        region: Region identifier (currently supports 'netherlands', 'amsterdam')
    
    Returns:
        Graph object if available, None otherwise
    """
    try:
        # Check memory cache first
        if region in _graph_cache:
            logger.info(f"Returning cached graph for region: {region}")
            return _graph_cache[region]
        
        # Check disk cache
        cache_file = CACHE_DIR / f"{region}_graph.pkl"
        if cache_file.exists():
            try:
                with open(cache_file, 'rb') as f:
                    graph = pickle.load(f)
                _graph_cache[region] = graph
                logger.info(f"Loaded graph for {region} from disk cache")
                return graph
            except Exception as e:
                logger.warning(f"Failed to load cached graph for {region}: {e}")
                # Remove corrupted cache file
                cache_file.unlink(missing_ok=True)
        
        # For Amsterdam/Netherlands, use existing graph
        if region.lower() in ["netherlands", "amsterdam"]:
            try:
                graph = create_amsterdam_graph()
                if graph and graph.number_of_nodes() > 0:
                    _graph_cache[region] = graph
                    # Cache to disk
                    try:
                        with open(cache_file, 'wb') as f:
                            pickle.dump(graph, f)
                        logger.info(f"Created and cached Amsterdam graph for region: {region}")
                    except Exception as e:
                        logger.warning(f"Failed to cache graph to disk: {e}")
                    return graph
            except Exception as e:
                logger.error(f"Failed to create Amsterdam graph: {e}")
        
        logger.warning(f"No graph available for region: {region}")
        return None
        
    except Exception as e:
        logger.exception(f"Error getting cached graph for {region}: {e}")
        return None

def fetch_netherlands_graph(api_url: Optional[str] = None, api_key: Optional[str] = None) -> Optional[Any]:
    """
    Fetch Netherlands map graph from external API.
    
    Args:
        api_url: API URL for map data
        api_key: API key for authentication
    
    Returns:
        Graph object if successful, None otherwise
    """
    try:
        # For now, we'll use the Amsterdam graph as Netherlands representation
        # In a full implementation, this would fetch real Netherlands road network data
        
        if not api_url or not api_key:
            logger.info("No API configuration provided, using built-in Amsterdam graph")
            return get_cached_graph("amsterdam")
        
        # Simulate API call (in real implementation, this would call OpenChargeMap or similar)
        logger.info(f"Fetching Netherlands graph from API: {api_url}")
        
        try:
            # Make a test API call to validate credentials
            headers = {"X-API-Key": api_key} if api_key else {}
            test_url = f"{api_url}/poi" if api_url.endswith("/") else f"{api_url}/poi"
            
            response = requests.get(
                test_url,
                headers=headers,
                params={"countrycode": "NL", "maxresults": 1},
                timeout=10
            )
            
            if response.status_code == 200:
                logger.info("API credentials validated successfully")
            else:
                logger.warning(f"API validation failed with status {response.status_code}")
                
        except requests.RequestException as e:
            logger.warning(f"API validation failed: {e}")
        
        # For now, return the Amsterdam graph enhanced with some Netherlands data
        graph = create_amsterdam_graph()
        
        if graph:
            # Add some Netherlands cities as additional nodes
            netherlands_cities = {
                "Utrecht": {"lat": 52.0907, "lon": 5.1214},
                "Rotterdam": {"lat": 51.9244, "lon": 4.4777},
                "The_Hague": {"lat": 52.0705, "lon": 4.3007},
                "Eindhoven": {"lat": 51.4416, "lon": 5.4697},
                "Groningen": {"lat": 53.2194, "lon": 6.5665}
            }
            
            # Add nodes for major Dutch cities
            for city, coords in netherlands_cities.items():
                graph.add_node(city, lat=coords["lat"], lon=coords["lon"])
            
            # Add some connections to Amsterdam
            amsterdam_central = "Amsterdam_Central"
            if amsterdam_central in graph.nodes():
                graph.add_edge(amsterdam_central, "Utrecht", weight=35.0)  # ~35km
                graph.add_edge(amsterdam_central, "The_Hague", weight=55.0)  # ~55km
                graph.add_edge("Utrecht", "Rotterdam", weight=65.0)  # ~65km
                graph.add_edge("The_Hague", "Rotterdam", weight=25.0)  # ~25km
            
            # Cache the enhanced graph
            cache_file = CACHE_DIR / "netherlands_graph.pkl"
            try:
                with open(cache_file, 'wb') as f:
                    pickle.dump(graph, f)
                _graph_cache["netherlands"] = graph
                logger.info("Enhanced Netherlands graph created and cached")
            except Exception as e:
                logger.warning(f"Failed to cache Netherlands graph: {e}")
            
            return graph
        
        logger.error("Failed to create Netherlands graph")
        return None
        
    except Exception as e:
        logger.exception(f"Error fetching Netherlands graph: {e}")
        # Return cached Amsterdam graph as fallback
        return get_cached_graph("amsterdam")

def clear_graph_cache(region: Optional[str] = None):
    """
    Clear cached graph data.
    
    Args:
        region: Specific region to clear, or None to clear all
    """
    global _graph_cache
    
    if region:
        # Clear specific region
        _graph_cache.pop(region, None)
        cache_file = CACHE_DIR / f"{region}_graph.pkl"
        cache_file.unlink(missing_ok=True)
        logger.info(f"Cleared cache for region: {region}")
    else:
        # Clear all caches
        _graph_cache.clear()
        for cache_file in CACHE_DIR.glob("*_graph.pkl"):
            cache_file.unlink(missing_ok=True)
        logger.info("Cleared all graph caches")

def get_graph_info(region: str = "netherlands") -> Dict[str, Any]:
    """
    Get information about a cached graph.
    
    Args:
        region: Region identifier
        
    Returns:
        Dictionary with graph statistics
    """
    graph = get_cached_graph(region)
    if not graph:
        return {"error": f"No graph available for region: {region}"}
    
    try:
        return {
            "region": region,
            "nodes": graph.number_of_nodes(),
            "edges": graph.number_of_edges(),
            "is_connected": nx.is_connected(graph) if hasattr(nx, 'is_connected') else True,
            "cache_status": "loaded"
        }
    except Exception as e:
        logger.exception(f"Error getting graph info for {region}: {e}")
        return {"error": str(e)}

def preload_graphs():
    """Preload commonly used graphs for better performance"""
    try:
        logger.info("Preloading commonly used graphs...")
        get_cached_graph("amsterdam")
        get_cached_graph("netherlands") 
        logger.info("Graph preloading completed")
    except Exception as e:
        logger.exception(f"Error during graph preloading: {e}")

# Preload graphs on module import
if __name__ != "__main__":
    try:
        preload_graphs()
    except Exception:
        pass  # Don't fail module import if preloading fails
