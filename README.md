# EV Routing Simulation - Docker Build Guide

## Overview
This is an advanced Electric Vehicle routing simulation tool for Amsterdam with AI-powered optimization algorithms.

## Prerequisites
- Docker and Docker Compose installed
- API keys for external services (optional but recommended)

## Quick Start with Docker

### 1. Clone and Navigate
```bash
cd predictive
```

### 2. Set up Environment Variables
Copy the example environment file and configure your API keys:
```bash
cp env.example .env
# Edit .env with your API keys
```

### 3. Build and Run
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Services

### Backend (FastAPI)
- **Port**: 8000
- **Features**: Route calculation, AI enhancement, driver profiles
- **Health Check**: http://localhost:8000/api/health

### Frontend (React)
- **Port**: 3000
- **Features**: Interactive map, route visualization, simulation controls

## API Keys Configuration

### Required for Full Functionality:
- `OPENAI_API_KEY`: For AI route enhancement
- `OCM_API_KEY`: For charging station data
- `REACT_APP_MAPBOX_TOKEN`: For map visualization
- `REACT_APP_DEEPSEEK_API_KEY`: For AI navigation
- `REACT_APP_GROQ_API_KEY`: For AI navigation fallback

### Optional:
The application will work without API keys but with limited functionality.

## Development

### Running in Development Mode
```bash
# Backend with hot reload
docker-compose up backend

# Frontend with hot reload
docker-compose up frontend
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stopping Services
```bash
docker-compose down
```

## Troubleshooting

### Common Issues:

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :8000
   # Or change ports in docker-compose.yml
   ```

2. **Build Failures**
   ```bash
   # Clean and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

3. **API Connection Issues**
   - Ensure backend is healthy: http://localhost:8000/api/health
   - Check frontend environment variables
   - Verify CORS settings

### Health Checks
```bash
# Check service status
docker-compose ps

# Check backend health
curl http://localhost:8000/api/health
```

## Production Deployment

### Environment Variables
Set all required environment variables in production:
```bash
export OPENAI_API_KEY=your_key
export OCM_API_KEY=your_key
# ... etc
```

### Security Considerations
- Use HTTPS in production
- Set proper CORS origins
- Configure API rate limiting
- Use secrets management for API keys

## Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│   (React)       │◄──►│   (FastAPI)     │
│   Port: 3000    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   External      │
│   (Static)      │    │   APIs          │
└─────────────────┘    └─────────────────┘
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## License
MIT License - see LICENSE file for details 
