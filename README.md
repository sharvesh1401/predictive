# 🚗⚡ EV Routing Simulation for Amsterdam

A full-stack simulation tool for electric vehicle (EV) charge routing in Amsterdam, featuring multiple routing algorithms, driver profiles, and AI enhancement capabilities.

## 🌟 Features

### Frontend (React)
- **Interactive Map**: Leaflet-based map visualization of routes
- **Driver Profiles**: Eco, Aggressive, and Balanced driving styles
- **Routing Algorithms**: Dijkstra, A*, and Multi-objective optimization
- **Route Comparison**: Side-by-side comparison of different algorithms
- **Real-time Statistics**: Distance, time, energy usage, and emissions
- **AI Enhancement**: Optional AI-powered route optimization
- **Responsive Design**: Modern UI with beautiful animations

### Backend (FastAPI)
- **Modular Architecture**: Clean separation of concerns
- **Multiple Routing Algorithms**: Dijkstra, A*, and multi-objective optimization
- **Driver Behavior Modeling**: Realistic driver profile simulations
- **Charging Station Integration**: Smart charging stop placement
- **AI Integration**: Placeholder for OpenAI/DeepSeek integration
- **RESTful API**: Comprehensive endpoints for all features

## 🏗️ Architecture

```
Predictive_Routing_for_EV_Charging_Stations/
├── backend/
│   ├── models/
│   │   ├── routing.py          # Dijkstra, A* algorithms
│   │   ├── profiles.py         # Driver behavior modeling
│   │   └── optimizer.py        # Multi-objective optimization
│   ├── ai/
│   │   └── inference.py        # AI enhancement placeholder
│   ├── api/
│   │   └── main.py            # FastAPI application
│   ├── main.py                # Backend entry point
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RouteSimulator.js
│   │   │   ├── RouteForm.js
│   │   │   ├── RouteMap.js
│   │   │   ├── RouteResults.js
│   │   │   ├── RouteComparison.js
│   │   │   └── Header.js
│   │   ├── services/
│   │   │   └── api.js         # API communication
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── README.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend server:**
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### Core Endpoints
- `GET /` - API information
- `GET /api/health` - Health check
- `GET /api/driver-profiles` - Available driver profiles
- `GET /api/locations` - Available Amsterdam locations

### Routing Endpoints
- `POST /api/route` - Calculate single route
- `POST /api/compare-routes` - Compare multiple algorithms
- `POST /api/ai-enhance` - AI route enhancement

### Example Request
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

### Example Response
```json
{
  "route": ["Amsterdam_Central", "Dam_Square", "Museumplein"],
  "total_distance_km": 2.3,
  "estimated_time_min": 28.5,
  "energy_used_kWh": 3.2,
  "emissions_grams": 270.4,
  "cost_euros": 0.80,
  "charging_stops": [],
  "route_coordinates": [[52.3791, 4.9003], [52.3730, 4.8926], [52.3579, 4.8816]],
  "driver_profile": "eco",
  "routing_model": "dijkstra"
}
```

## 🧠 Routing Algorithms

### 1. Dijkstra's Algorithm
- **Purpose**: Shortest distance routing
- **Use Case**: When distance is the primary concern
- **Complexity**: O(V²) where V is number of vertices

### 2. A* Algorithm
- **Purpose**: Heuristic-based optimization
- **Use Case**: Faster routing with good distance optimization
- **Complexity**: O(V log V) with good heuristic

### 3. Multi-Objective Optimization
- **Purpose**: Balance multiple objectives (time, distance, energy, cost)
- **Use Case**: When multiple factors are equally important
- **Method**: Weighted sum approach with driver profile weights

## 👤 Driver Profiles

### Eco Driver
- **Speed Factor**: 0.8x (20% slower)
- **Energy Efficiency**: 0.85x (15% more efficient)
- **Charging Preference**: High (0.9)
- **Optimization Weights**: Energy (40%), Distance (30%), Time (20%), Cost (10%)

### Aggressive Driver
- **Speed Factor**: 1.3x (30% faster)
- **Energy Efficiency**: 1.25x (25% less efficient)
- **Charging Preference**: Low (0.3)
- **Optimization Weights**: Time (60%), Distance (20%), Energy (10%), Cost (10%)

### Balanced Driver
- **Speed Factor**: 1.0x (average)
- **Energy Efficiency**: 1.0x (average)
- **Charging Preference**: Medium (0.6)
- **Optimization Weights**: Time (30%), Distance (30%), Energy (20%), Cost (20%)

## 🔋 Charging Station Integration

The system includes 5 charging stations in Amsterdam:
- **CS001**: Fast charger (50 kW) - Central area
- **CS002**: Standard charger (22 kW) - Dam Square area
- **CS003**: Fast charger (50 kW) - East area
- **CS004**: Standard charger (22 kW) - West area
- **CS005**: Ultra-fast charger (150 kW) - Strategic location

## 🤖 AI Enhancement

The AI module provides:
- **Route Analysis**: Intelligent route optimization suggestions
- **Traffic Prediction**: Expected congestion levels
- **Weather Impact**: Energy consumption adjustments
- **Charging Optimization**: Optimal charging stop recommendations

## 🛠️ Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Testing
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

## 📊 Performance Metrics

The system calculates and displays:
- **Total Distance**: Route length in kilometers
- **Estimated Time**: Travel time in minutes
- **Energy Usage**: Battery consumption in kWh
- **Cost**: Electricity cost in euros
- **Emissions**: CO₂ emissions in grams
- **Charging Stops**: Number and details of charging stations

## 🔧 Configuration

### Environment Variables
```bash
# Backend
OPENAI_API_KEY=your_openai_api_key  # For AI enhancement
API_HOST=0.0.0.0
API_PORT=8000

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

### Customization
- **Add new locations**: Modify `create_amsterdam_graph()` in `routing.py`
- **Add charging stations**: Update `_load_charging_stations()` in `routing.py`
- **Modify driver profiles**: Edit `_initialize_profiles()` in `profiles.py`
- **Add routing algorithms**: Extend the `AmsterdamRouter` class

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenStreetMap**: Map data and routing
- **Leaflet**: Interactive map visualization
- **FastAPI**: Modern Python web framework
- **React**: Frontend framework
- **Amsterdam Municipality**: Inspiration for EV infrastructure

## 📞 Support

For questions or support:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for sustainable urban mobility** 
