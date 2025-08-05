# Docker Deployment Guide

This guide explains how to deploy the EV Routing Simulation application using Docker.

## 🐳 Docker Images

The application has been containerized and pushed to Docker Hub:

- **Backend**: `sharves14/ev-routing-backend:latest`
- **Frontend**: `sharves14/ev-routing-frontend:latest`

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd predictive
   ```

2. **Deploy using the provided script**:
   ```bash
   # On Linux/Mac:
   chmod +x deploy.sh
   ./deploy.sh
   
   # On Windows:
   deploy.bat
   ```

3. **Or deploy manually**:
   ```bash
   docker-compose up -d
   ```

### Option 2: Manual Deployment

1. **Pull the images**:
   ```bash
   docker pull sharves14/ev-routing-backend:latest
   docker pull sharves14/ev-routing-frontend:latest
   ```

2. **Run the containers**:
   ```bash
   # Backend
   docker run -d \
     --name ev-routing-backend \
     -p 8000:8000 \
     -e OPENAI_API_KEY=your_openai_key \
     -e OCM_API_KEY=your_ocm_key \
     sharves14/ev-routing-backend:latest
   
   # Frontend
   docker run -d \
     --name ev-routing-frontend \
     -p 3000:80 \
     sharves14/ev-routing-frontend:latest
   ```

## 🌐 Access the Application

Once deployed, the application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/api/health

## 📊 Monitoring

### Check Container Status
```bash
docker-compose ps
# or
docker ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Health Check
```bash
curl http://localhost:8000/api/health
```

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key for AI enhancements
- `OCM_API_KEY`: Your OpenChargeMap API key for charging station data
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8000)

### Docker Compose Configuration

The `docker-compose.yml` file includes:

- **Health checks** for both services
- **Volume mounting** for persistent data
- **Network configuration** for service communication
- **Port mapping** for external access

## 🛑 Stopping the Application

```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes
docker-compose down -v
```

## 🔄 Updating

To update to the latest version:

```bash
# Pull latest images
docker-compose pull

# Restart services
docker-compose up -d
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :8000
   # or
   lsof -i :8000
   ```

2. **Container won't start**:
   ```bash
   # Check logs
   docker-compose logs backend
   docker-compose logs frontend
   ```

3. **Health check failing**:
   ```bash
   # Check if backend is responding
   curl http://localhost:8000/api/health
   ```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v
docker system prune -f

# Rebuild and start
docker-compose up -d
```

## 📁 Data Persistence

The application stores data in Docker volumes:

- `backend_data`: Contains the downloaded Amsterdam road network and charging station data

To backup data:
```bash
docker run --rm -v predictive_backend_data:/data -v $(pwd):/backup alpine tar czf /backup/backend_data_backup.tar.gz -C /data .
```

## 🔒 Security Notes

- The application runs on localhost by default
- For production deployment, consider:
  - Using HTTPS
  - Setting up proper firewall rules
  - Using Docker secrets for sensitive data
  - Running containers with non-root users

## 📈 Performance

The Docker images are optimized for:

- **Backend**: ~2.1GB (includes all Python dependencies and spatial libraries)
- **Frontend**: ~76MB (multi-stage build with Nginx)

## 🤝 Contributing

To build your own Docker images:

```bash
# Backend
docker build -t your-username/ev-routing-backend:latest ./backend

# Frontend
docker build -t your-username/ev-routing-frontend:latest ./frontend

# Push to Docker Hub
docker push your-username/ev-routing-backend:latest
docker push your-username/ev-routing-frontend:latest
``` 