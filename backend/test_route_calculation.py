"""
Test script for end-to-end testing of the route calculation with AI fallback.
"""
import os
import sys
import logging
from typing import Dict, Any

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.maps import get_cached_graph, fetch_netherlands_graph
from app.jobs import compute_route_job

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_route_calculation():
    """Test the route calculation with AI fallback."""
    # Test data
    job_id = "test_123"
    payload = {
        "origin": "Amsterdam_Central",
        "destination": "Utrecht",
        "constraints": {
            "battery_capacity_kwh": 60.0,
            "current_charge_kwh": 45.0,
            "routing_model": "dijkstra",
            "driver_profile": "EFFICIENT"
        }
    }
    
    # Set up mock environment variables for testing
    os.environ["AI_CONFIDENCE_THRESHOLD"] = "0.8"  # Force AI fallback for testing
    
    # Ensure we have the graph loaded
    graph = get_cached_graph("netherlands")
    if not graph:
        logger.info("Graph not found in cache, fetching...")
        graph = fetch_netherlands_graph()
    
    # Run the job
    try:
        logger.info("Starting route calculation job...")
        compute_route_job(job_id, payload)
        logger.info("Route calculation completed successfully")
    except Exception as e:
        logger.error(f"Route calculation failed: {e}", exc_info=True)
        return False
    
    return True

if __name__ == "__main__":
    success = test_route_calculation()
    if success:
        logger.info("✅ Test completed successfully")
    else:
        logger.error("❌ Test failed")
