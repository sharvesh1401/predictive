"""
Test script to verify API key functionality for all services except OpenAI.
"""
import os
import requests
import json
from typing import Dict, Optional, Tuple

# Configuration
SERVICES = {
    "MAPBOX": {
        "name": "Mapbox",
        "env_var": "REACT_APP_MAPBOX_TOKEN",
        "test_url": "https://api.mapbox.com/directions/v5/mapbox/driving/-122.42,37.78;-121.42,37.78?access_token={}",
        "expected_status": 200
    },
    "DEEPSEEK": {
        "name": "DeepSeek",
        "env_var": "REACT_APP_DEEPSEEK_API_KEY",
        "test_url": "https://api.deepseek.com/v1/models",
        "headers": {"Authorization": "Bearer {}"},
        "expected_status": 200
    },
    "GROQ": {
        "name": "Groq",
        "env_var": "REACT_APP_GROQ_API_KEY",
        "test_url": "https://api.groq.com/openai/v1/models",
        "headers": {"Authorization": "Bearer {}"},
        "expected_status": 200
    }
}

def get_api_key(service_name: str, env_var: str) -> Tuple[bool, Optional[str]]:
    """Retrieve and validate API key from environment variables."""
    api_key = os.getenv(env_var)
    if not api_key:
        return False, f"{service_name} API key not found in environment variable {env_var}"
    
    # Basic validation
    if len(api_key) < 32:
        return False, f"{service_name} API key is too short"
    
    return True, api_key

def test_service(service_name: str, config: Dict) -> Tuple[bool, str]:
    """Test a single service's API key."""
    print(f"\n🔍 Testing {service_name} API key...")
    
    # Get and validate API key
    success, result = get_api_key(service_name, config["env_var"])
    if not success:
        return False, result
    
    api_key = result
    url = config["test_url"].format(api_key)
    headers = config.get("headers", {})
    
    # Format headers with API key
    for key, value in headers.items():
        headers[key] = value.format(api_key)
    
    try:
        response = requests.get(
            url,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == config["expected_status"]:
            return True, f"✅ {service_name} API key is valid"
        else:
            return False, (
                f"❌ {service_name} API key test failed with status {response.status_code}\n"
                f"Response: {response.text[:200]}"
            )
            
    except requests.exceptions.RequestException as e:
        return False, f"❌ {service_name} API request failed: {str(e)}"

def main():
    print("🚀 Starting API Key Validation Tests\n")
    
    all_tests_passed = True
    
    for service_key, config in SERVICES.items():
        test_passed, message = test_service(config["name"], config)
        print(message)
        
        if not test_passed:
            all_tests_passed = False
    
    print("\n📊 Test Summary:")
    if all_tests_passed:
        print("✅ All API key tests passed successfully!")
        return 0
    else:
        print("❌ Some API key tests failed. Please check the error messages above.")
        return 1

if __name__ == "__main__":
    exit(main())
