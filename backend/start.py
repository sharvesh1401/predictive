#!/usr/bin/env python3
"""
Start script for the EV Routing Simulation API
This script ensures proper Python path setup and imports
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import and run the FastAPI app
from api.main import app
import uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 