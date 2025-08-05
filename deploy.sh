#!/bin/bash

# EV Routing Simulation Deployment Script
# This script deploys the application using the Docker images from Docker Hub

set -e

echo "🚀 Deploying EV Routing Simulation..."

# Pull the latest images
echo "📥 Pulling latest Docker images..."
docker pull sharves14/ev-routing-backend:latest
docker pull sharves14/ev-routing-frontend:latest

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start the services
echo "▶️ Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Health Check: http://localhost:8000/api/health"
echo ""
echo "📝 Logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop:"
echo "   docker-compose down" 