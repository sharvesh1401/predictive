"""
Full-stack smoke test for the EV Routing application.
Tests both backend API and frontend connectivity.
"""
import os
import sys
import time
import requests
import json
import logging
from typing import Dict, Any, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class SmokeTest:
    def __init__(self):
        self.backend_url = os.getenv('BACKEND_URL', 'http://localhost:8000')
        self.frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        self.timeout = 30  # seconds
        self.retry_interval = 5  # seconds
        self.max_retries = 5

    def wait_for_service(self, url: str, service_name: str) -> bool:
        """Wait for a service to become available."""
        logger.info(f"Waiting for {service_name} at {url}...")
        for attempt in range(1, self.max_retries + 1):
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    logger.info(f"{service_name} is available")
                    return True
                logger.warning(f"Attempt {attempt}: {service_name} returned status {response.status_code}")
            except requests.exceptions.RequestException as e:
                logger.warning(f"Attempt {attempt}: {service_name} not available yet: {e}")
            
            if attempt < self.max_retries:
                time.sleep(self.retry_interval)
        
        logger.error(f"{service_name} did not become available after {self.max_retries} attempts")
        return False

    def test_backend_health(self) -> bool:
        """Test backend health check endpoint."""
        url = f"{self.backend_url}/api/health"
        logger.info(f"Testing backend health at {url}")
        
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                logger.info("Backend health check passed")
                return True
            logger.error(f"Backend health check failed with status {response.status_code}")
        except Exception as e:
            logger.error(f"Backend health check failed: {e}")
        
        return False

    def test_route_calculation(self) -> bool:
        """Test route calculation endpoint."""
        url = f"{self.backend_url}/api/route"
        payload = {
            "origin": "Amsterdam_Central",
            "destination": "Utrecht",
            "driver_profile": "EFFICIENT",
            "routing_model": "dijkstra",
            "battery_capacity_kwh": 60.0,
            "current_charge_kwh": 45.0
        }
        
        logger.info(f"Testing route calculation at {url}")
        
        try:
            response = requests.post(
                url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                logger.info("Route calculation test passed")
                return True
                
            logger.error(f"Route calculation failed with status {response.status_code}")
            logger.error(f"Response: {response.text}")
        except Exception as e:
            logger.error(f"Route calculation test failed: {e}")
        
        return False

    def test_frontend_connectivity(self) -> bool:
        """Test frontend connectivity."""
        url = f"{self.frontend_url}/"
        logger.info(f"Testing frontend connectivity at {url}")
        
        try:
            response = requests.get(url, timeout=10, allow_redirects=True)
            if response.status_code == 200:
                logger.info("Frontend connectivity test passed")
                return True
            logger.error(f"Frontend connectivity test failed with status {response.status_code}")
        except Exception as e:
            logger.error(f"Frontend connectivity test failed: {e}")
        
        return False

    def run_all_tests(self) -> bool:
        """Run all smoke tests."""
        logger.info("Starting full-stack smoke tests...")
        
        # Wait for services to be ready
        if not self.wait_for_service(f"{self.backend_url}/api/health", "Backend"):
            return False
            
        if not self.wait_for_service(self.frontend_url, "Frontend"):
            return False
        
        # Run tests
        tests = [
            ("Backend Health Check", self.test_backend_health),
            ("Route Calculation", self.test_route_calculation),
            ("Frontend Connectivity", self.test_frontend_connectivity)
        ]
        
        all_passed = True
        for test_name, test_func in tests:
            logger.info(f"Running test: {test_name}")
            if not test_func():
                logger.error(f"❌ {test_name} failed")
                all_passed = False
            else:
                logger.info(f"✅ {test_name} passed")
        
        return all_passed

if __name__ == "__main__":
    smoke_test = SmokeTest()
    success = smoke_test.run_all_tests()
    
    if success:
        logger.info("✅ All smoke tests passed successfully!")
        sys.exit(0)
    else:
        logger.error("❌ Some smoke tests failed")
        sys.exit(1)
