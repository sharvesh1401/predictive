#!/bin/bash

# Smoke test script for EV Routing Simulation frontend
# This script tests if the frontend container is healthy and responding

echo "Running smoke tests for EV Routing frontend..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running or not installed"
  exit 1
fi

# Check if the frontend container is running
if ! docker ps | grep -q "ev-routing-frontend"; then
  echo "Frontend container is not running. Starting with docker-compose..."
  docker-compose up -d
  
  # Wait for container to start
  echo "Waiting for container to start and become healthy..."
  sleep 30
fi

# Get the container port mapping
PORT=$(docker ps | grep ev-routing-frontend | grep -o '0.0.0.0:[0-9]\+->80/tcp' | cut -d ':' -f 2 | cut -d '-' -f 1)

if [ -z "$PORT" ]; then
  echo "Error: Could not determine frontend container port"
  exit 1
fi

echo "Testing health endpoint on port $PORT..."

# Test health endpoint
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/health)

if [ "$HEALTH_STATUS" -eq 200 ]; then
  echo "✅ Health endpoint check passed"
else
  echo "❌ Health endpoint check failed with status $HEALTH_STATUS"
  exit 1
fi

# Test main page
echo "Testing main page..."
MAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/)

if [ "$MAIN_STATUS" -eq 200 ]; then
  echo "✅ Main page check passed"
else
  echo "❌ Main page check failed with status $MAIN_STATUS"
  exit 1
fi

echo "All smoke tests passed! Frontend is healthy and responding."