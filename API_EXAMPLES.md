# 📡 API Examples - EV Routing Simulation

This document provides comprehensive examples of API requests and responses for the EV routing simulation tool.

## 🚀 Quick Start Examples

### 1. Get Available Driver Profiles

**Request:**
```bash
GET /api/driver-profiles
```

**Response:**
```json
{
  "profiles": {
    "eco": {
      "name": "Eco Driver",
      "description": "Prioritizes energy efficiency and environmental impact",
      "speed_factor": 0.8,
      "energy_efficiency": 0.85,
      "charging_preference": 0.9,
      "weights": {
        "time": 0.2,
        "distance": 0.3,
        "energy": 0.4,
        "cost": 0.1
      }
    },
    "aggressive": {
      "name": "Aggressive Driver",
      "description": "Prioritizes speed and time efficiency",
      "speed_factor": 1.3,
      "energy_efficiency": 1.25,
      "charging_preference": 0.3,
      "weights": {
        "time": 0.6,
        "distance": 0.2,
        "energy": 0.1,
        "cost": 0.1
      }
    },
    "balanced": {
      "name": "Balanced Driver",
      "description": "Balanced approach considering all factors",
      "speed_factor": 1.0,
      "energy_efficiency": 1.0,
      "charging_preference": 0.6,
      "weights": {
        "time": 0.3,
        "distance": 0.3,
        "energy": 0.2,
        "cost": 0.2
      }
    }
  },
  "message": "Available driver profiles retrieved successfully"
}
```

### 2. Get Available Locations

**Request:**
```bash
GET /api/locations
```

**Response:**
```json
{
  "locations": {
    "Amsterdam_Central": {
      "name": "Amsterdam Central",
      "latitude": 52.3791,
      "longitude": 4.9003
    },
    "Dam_Square": {
      "name": "Dam Square",
      "latitude": 52.3730,
      "longitude": 4.8926
    },
    "Museumplein": {
      "name": "Museumplein",
      "latitude": 52.3579,
      "longitude": 4.8816
    },
    "Vondelpark": {
      "name": "Vondelpark",
      "latitude": 52.3567,
      "longitude": 4.8687
    },
    "Leidseplein": {
      "name": "Leidseplein",
      "latitude": 52.3641,
      "longitude": 4.8833
    },
    "Rembrandtplein": {
      "name": "Rembrandtplein",
      "latitude": 52.3667,
      "longitude": 4.8950
    },
    "Jordaan": {
      "name": "Jordaan",
      "latitude": 52.3733,
      "longitude": 4.8792
    },
    "De_Pijp": {
      "name": "De Pijp",
      "latitude": 52.3558,
      "longitude": 4.8927
    },
    "Oost": {
      "name": "Oost",
      "latitude": 52.3654,
      "longitude": 4.9023
    },
    "West": {
      "name": "West",
      "latitude": 52.3689,
      "longitude": 4.8891
    }
  },
  "message": "Available locations retrieved successfully"
}
```

## 🛣️ Route Calculation Examples

### 3. Calculate Single Route (Dijkstra)

**Request:**
```bash
POST /api/route
Content-Type: application/json
```

**Request Body:**
```json
{
  "origin": "Amsterdam_Central",
  "destination": "Museumplein",
  "driver_profile": "eco",
  "routing_model": "dijkstra",
  "battery_capacity_kwh": 60.0,
  "current_charge_kwh": 45.0,
  "use_ai_enhancement": false,
  "preferences": {}
}
```

**Response:**
```json
{
  "route": ["Amsterdam_Central", "Dam_Square", "Museumplein"],
  "total_distance_km": 2.3,
  "estimated_time_min": 28.5,
  "energy_used_kWh": 3.2,
  "emissions_grams": 270.4,
  "cost_euros": 0.80,
  "charging_stops": [],
  "route_coordinates": [
    [52.3791, 4.9003],
    [52.3730, 4.8926],
    [52.3579, 4.8816]
  ],
  "driver_profile": "eco",
  "routing_model": "dijkstra",
  "ai_enhancement": null
}
```

### 4. Calculate Route with A* Algorithm

**Request:**
```json
{
  "origin": "Amsterdam_Central",
  "destination": "Vondelpark",
  "driver_profile": "aggressive",
  "routing_model": "astar",
  "battery_capacity_kwh": 60.0,
  "current_charge_kwh": 30.0,
  "use_ai_enhancement": false,
  "preferences": {}
}
```

**Response:**
```json
{
  "route": ["Amsterdam_Central", "Dam_Square", "Leidseplein", "Vondelpark"],
  "total_distance_km": 3.1,
  "estimated_time_min": 18.6,
  "energy_used_kWh": 5.8,
  "emissions_grams": 490.1,
  "cost_euros": 1.45,
  "charging_stops": [
    {
      "station_id": "CS002",
      "location": [52.3702, 4.8952],
      "power_kw": 22,
      "type": "standard"
    }
  ],
  "route_coordinates": [
    [52.3791, 4.9003],
    [52.3730, 4.8926],
    [52.3641, 4.8833],
    [52.3567, 4.8687]
  ],
  "driver_profile": "aggressive",
  "routing_model": "astar",
  "ai_enhancement": null
}
```

### 5. Multi-Objective Optimization

**Request:**
```json
{
  "origin": "Amsterdam_Central",
  "destination": "De_Pijp",
  "driver_profile": "balanced",
  "routing_model": "multi_objective",
  "battery_capacity_kwh": 60.0,
  "current_charge_kwh": 40.0,
  "use_ai_enhancement": false,
  "preferences": {}
}
```

**Response:**
```json
{
  "route": ["Amsterdam_Central", "Dam_Square", "Rembrandtplein", "De_Pijp"],
  "total_distance_km": 2.8,
  "estimated_time_min": 33.6,
  "energy_used_kWh": 4.2,
  "emissions_grams": 354.9,
  "cost_euros": 1.05,
  "charging_stops": [],
  "route_coordinates": [
    [52.3791, 4.9003],
    [52.3730, 4.8926],
    [52.3667, 4.8950],
    [52.3558, 4.8927]
  ],
  "driver_profile": "balanced",
  "routing_model": "multi_objective",
  "ai_enhancement": null
}
```

## 🔄 Route Comparison Examples

### 6. Compare Multiple Algorithms

**Request:**
```bash
POST /api/compare-routes
Content-Type: application/json
```

**Request Body:**
```json
{
  "origin": "Amsterdam_Central",
  "destination": "Oost",
  "driver_profile": "eco",
  "routing_model": "dijkstra",
  "battery_capacity_kwh": 60.0,
  "current_charge_kwh": 50.0,
  "use_ai_enhancement": false,
  "preferences": {}
}
```

**Response:**
```json
{
  "routes": {
    "dijkstra": {
      "route": ["Amsterdam_Central", "Dam_Square", "West", "Oost"],
      "total_distance_km": 4.2,
      "estimated_time_min": 50.4,
      "energy_used_kWh": 5.1,
      "emissions_grams": 430.95,
      "cost_euros": 1.28,
      "charging_stops": [],
      "route_coordinates": [
        [52.3791, 4.9003],
        [52.3730, 4.8926],
        [52.3689, 4.8891],
        [52.3654, 4.9023]
      ],
      "driver_profile": "eco",
      "routing_model": "dijkstra"
    },
    "astar": {
      "route": ["Amsterdam_Central", "Jordaan", "West", "Oost"],
      "total_distance_km": 4.0,
      "estimated_time_min": 48.0,
      "energy_used_kWh": 4.8,
      "emissions_grams": 405.6,
      "cost_euros": 1.20,
      "charging_stops": [],
      "route_coordinates": [
        [52.3791, 4.9003],
        [52.3733, 4.8792],
        [52.3689, 4.8891],
        [52.3654, 4.9023]
      ],
      "driver_profile": "eco",
      "routing_model": "astar"
    },
    "multi_objective": {
      "route": ["Amsterdam_Central", "Dam_Square", "Rembrandtplein", "Oost"],
      "total_distance_km": 3.8,
      "estimated_time_min": 45.6,
      "energy_used_kWh": 4.6,
      "emissions_grams": 388.7,
      "cost_euros": 1.15,
      "charging_stops": [],
      "route_coordinates": [
        [52.3791, 4.9003],
        [52.3730, 4.8926],
        [52.3667, 4.8950],
        [52.3654, 4.9023]
      ],
      "driver_profile": "eco",
      "routing_model": "multi_objective"
    }
  },
  "summary": {
    "best_time": "multi_objective",
    "best_energy": "multi_objective",
    "best_distance": "multi_objective",
    "best_cost": "multi_objective"
  }
}
```

## 🤖 AI Enhancement Examples

### 7. AI-Enhanced Route

**Request:**
```bash
POST /api/ai-enhance
Content-Type: application/json
```

**Request Body:**
```json
{
  "origin": "Amsterdam_Central",
  "destination": "Museumplein",
  "driver_profile": "eco",
  "routing_model": "dijkstra",
  "battery_capacity_kwh": 60.0,
  "current_charge_kwh": 45.0,
  "preferences": {
    "avoid_tolls": true,
    "prefer_quiet_roads": true
  }
}
```

**Response:**
```json
{
  "base_route": {
    "total_distance_km": 2.3,
    "estimated_time_min": 28.5,
    "energy_used_kWh": 3.2,
    "emissions_grams": 270.4
  },
  "ai_enhancement": {
    "confidence_score": 0.85,
    "reasoning": "AI analysis suggests this route is already well-optimized for the given profile. Consider departing 15 minutes earlier to avoid peak traffic.",
    "alternative_suggestions": [
      {
        "type": "timing_optimization",
        "description": "Depart 15 minutes earlier",
        "expected_improvement": "10% faster travel time"
      },
      {
        "type": "charging_optimization",
        "description": "Use fast charger at CS005",
        "expected_improvement": "5 minutes saved charging"
      }
    ]
  },
  "traffic_analysis": {
    "congestion_level": "low",
    "peak_hours": ["08:00-10:00", "17:00-19:00"],
    "recommended_departure_time": "10:30",
    "traffic_factor": 1.1
  },
  "weather_impact": {
    "weather_condition": "partly_cloudy",
    "temperature_celsius": 18,
    "wind_speed_kmh": 8,
    "energy_impact_factor": 1.02
  },
  "charging_suggestions": [
    {
      "station_id": "CS001",
      "current_charge_time": 30,
      "suggested_charge_time": 45,
      "reasoning": "Optimal charging time for battery health",
      "cost_savings": 2.50
    }
  ]
}
```

## ⚠️ Error Examples

### 8. Invalid Driver Profile

**Request:**
```json
{
  "origin": "Amsterdam_Central",
  "destination": "Museumplein",
  "driver_profile": "invalid_profile",
  "routing_model": "dijkstra",
  "battery_capacity_kwh": 60.0,
  "current_charge_kwh": 45.0
}
```

**Response:**
```json
{
  "detail": "Invalid driver profile: invalid_profile"
}
```

### 9. Invalid Routing Model

**Request:**
```json
{
  "origin": "Amsterdam_Central",
  "destination": "Museumplein",
  "driver_profile": "eco",
  "routing_model": "invalid_model",
  "battery_capacity_kwh": 60.0,
  "current_charge_kwh": 45.0
}
```

**Response:**
```json
{
  "detail": "Invalid routing model: invalid_model"
}
```

### 10. No Valid Route Found

**Request:**
```json
{
  "origin": "Amsterdam_Central",
  "destination": "Invalid_Destination",
  "driver_profile": "eco",
  "routing_model": "dijkstra",
  "battery_capacity_kwh": 60.0,
  "current_charge_kwh": 45.0
}
```

**Response:**
```json
{
  "detail": "No valid route found from Amsterdam_Central to Invalid_Destination"
}
```

## 🔧 Health Check

### 11. API Health Status

**Request:**
```bash
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "components": {
    "router": "operational",
    "profiles": "operational",
    "optimizer": "operational",
    "ai_enhancer": "operational"
  }
}
```

## 📊 Response Field Descriptions

### Route Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `route` | Array[string] | List of location names in route order |
| `total_distance_km` | float | Total route distance in kilometers |
| `estimated_time_min` | float | Estimated travel time in minutes |
| `energy_used_kWh` | float | Total energy consumption in kWh |
| `emissions_grams` | float | CO₂ emissions in grams |
| `cost_euros` | float | Total cost in euros |
| `charging_stops` | Array[object] | List of charging stations on route |
| `route_coordinates` | Array[Array[float]] | GPS coordinates for route visualization |
| `driver_profile` | string | Used driver profile |
| `routing_model` | string | Used routing algorithm |
| `ai_enhancement` | object/null | AI enhancement data if requested |

### Charging Stop Fields

| Field | Type | Description |
|-------|------|-------------|
| `station_id` | string | Unique charging station identifier |
| `location` | Array[float] | GPS coordinates [lat, lon] |
| `power_kw` | integer | Charging power in kilowatts |
| `type` | string | Charger type (standard, fast, ultra_fast) |

### AI Enhancement Fields

| Field | Type | Description |
|-------|------|-------------|
| `confidence_score` | float | AI confidence (0-1) |
| `reasoning` | string | AI analysis explanation |
| `alternative_suggestions` | Array[object] | List of improvement suggestions |

## 🚀 Testing with cURL

### Basic Route Calculation
```bash
curl -X POST "http://localhost:8000/api/route" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Amsterdam_Central",
    "destination": "Museumplein",
    "driver_profile": "eco",
    "routing_model": "dijkstra",
    "battery_capacity_kwh": 60.0,
    "current_charge_kwh": 45.0
  }'
```

### Route Comparison
```bash
curl -X POST "http://localhost:8000/api/compare-routes" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Amsterdam_Central",
    "destination": "Museumplein",
    "driver_profile": "eco",
    "routing_model": "dijkstra",
    "battery_capacity_kwh": 60.0,
    "current_charge_kwh": 45.0
  }'
```

### Get Driver Profiles
```bash
curl -X GET "http://localhost:8000/api/driver-profiles"
```

---

**These examples demonstrate the full capabilities of the EV routing simulation API. Use them as a reference for integrating with the system.** 