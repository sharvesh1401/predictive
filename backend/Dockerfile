FROM python:3.10-slim

WORKDIR /app

# Set Python path to include the current directory
ENV PYTHONPATH=/app

# Install system dependencies including those needed for geopandas and osmnx
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libspatialindex-dev \
    libgeos-dev \
    libproj-dev \
    proj-data \
    proj-bin \
    libgdal-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create data directory
RUN mkdir -p data

# Make start script executable
RUN chmod +x start.py

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Run the application using the start script
CMD ["python", "start.py"] 