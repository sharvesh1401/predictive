from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn

from ..models.routing import AmsterdamRouter, RouteResult, create_amsterdam_graph
from ..models.profiles import DriverProfile, profile_manager
from ..models.optimizer import RouteOptimizer
from ..ai.inference import create_ai_enhancer, AIEnhancementRequest

# Initialize FastAPI app
app = FastAPI(
    title="EV Routing Simulation API",
    description="Electric Vehicle routing simulation for Amsterdam with AI enhancement",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
amsterdam_graph = create_amsterdam_graph()
router = AmsterdamRouter(amsterdam_graph)
route_optimizer = RouteOptimizer(router)
ai_enhancer = create_ai_enhancer(use_mock=True)

# Pydantic models for API requests/responses
class RouteRequest(BaseModel):
    origin: str
    destination: str
    driver_profile: str
    routing_model: str = "dijkstra"
    battery_capacity_kwh: float = 60.0
    current_charge_kwh: float = 45.0
    use_ai_enhancement: bool = False
    preferences: Dict[str, Any] = {}

class RouteResponse(BaseModel):
    route: List[str]
    total_distance_km: float
    estimated_time_min: float
    energy_used_kWh: float
    emissions_grams: float
    cost_euros: float
    charging_stops: List[Dict[str, Any]]
    route_coordinates: List[List[float]]
    driver_profile: str
    routing_model: str
    ai_enhancement: Optional[Dict[str, Any]] = None

class ComparisonResponse(BaseModel):
    routes: Dict[str, RouteResponse]
    summary: Dict[str, Any]

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "EV Routing Simulation API",
        "version": "1.0.0",
        "available_endpoints": [
            "/api/route",
            "/api/driver-profiles", 
            "/api/locations",
            "/api/compare-routes",
            "/api/ai-enhance"
        ]
    }

@app.get("/api/driver-profiles")
async def get_driver_profiles():
    """Get all available driver profiles"""
    return {
        "profiles": profile_manager.get_all_profiles(),
        "message": "Available driver profiles retrieved successfully"
    }

@app.get("/api/locations")
async def get_available_locations():
    """Get all available locations in Amsterdam"""
    locations = {}
    for node in amsterdam_graph.nodes():
        node_data = amsterdam_graph.nodes[node]
        locations[node] = {
            "name": node.replace("_", " ").title(),
            "latitude": node_data.get("lat", 0),
            "longitude": node_data.get("lon", 0)
        }
    
    return {
        "locations": locations,
        "message": "Available locations retrieved successfully"
    }

@app.post("/api/route", response_model=RouteResponse)
async def calculate_route(request: RouteRequest):
    """Calculate optimal route based on parameters"""
    try:
        # Validate driver profile
        try:
            driver_profile = DriverProfile(request.driver_profile)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid driver profile: {request.driver_profile}")
        
        # Calculate route based on routing model
        if request.routing_model == "dijkstra":
            route_result = router.dijkstra_route(
                request.origin, request.destination,
                request.battery_capacity_kwh, request.current_charge_kwh
            )
        elif request.routing_model == "astar":
            route_result = router.astar_route(
                request.origin, request.destination,
                request.battery_capacity_kwh, request.current_charge_kwh
            )
        elif request.routing_model == "multi_objective":
            route_result = route_optimizer.optimize_route(
                request.origin, request.destination, driver_profile,
                "weighted_sum", request.battery_capacity_kwh, request.current_charge_kwh
            )
        else:
            raise HTTPException(status_code=400, detail=f"Invalid routing model: {request.routing_model}")
        
        # Apply driver profile characteristics
        profile_config = profile_manager.get_profile(driver_profile)
        adjusted_energy = profile_manager.calculate_energy_consumption(
            route_result.total_distance_km, driver_profile
        )
        adjusted_time = profile_manager.calculate_travel_time(
            route_result.total_distance_km, driver_profile
        )
        adjusted_cost = profile_manager.calculate_cost(adjusted_energy, driver_profile)
        adjusted_emissions = profile_manager.calculate_emissions(adjusted_energy, driver_profile)
        
        # Prepare response
        response_data = {
            "route": route_result.route,
            "total_distance_km": route_result.total_distance_km,
            "estimated_time_min": adjusted_time,
            "energy_used_kWh": adjusted_energy,
            "emissions_grams": adjusted_emissions,
            "cost_euros": adjusted_cost,
            "charging_stops": route_result.charging_stops,
            "route_coordinates": route_result.route_coordinates,
            "driver_profile": request.driver_profile,
            "routing_model": request.routing_model
        }
        
        # Apply AI enhancement if requested
        ai_enhancement = None
        if request.use_ai_enhancement:
            ai_request = AIEnhancementRequest(
                origin=request.origin,
                destination=request.destination,
                current_route=route_result,
                driver_profile=request.driver_profile,
                preferences=request.preferences,
                context={}
            )
            
            ai_response = ai_enhancer.enhance_route(ai_request)
            ai_enhancement = {
                "confidence_score": ai_response.confidence_score,
                "reasoning": ai_response.reasoning,
                "alternative_suggestions": ai_response.alternative_suggestions
            }
        
        response_data["ai_enhancement"] = ai_enhancement
        
        return RouteResponse(**response_data)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/compare-routes", response_model=ComparisonResponse)
async def compare_routes(request: RouteRequest):
    """Compare different routing approaches"""
    try:
        # Validate driver profile
        try:
            driver_profile = DriverProfile(request.driver_profile)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid driver profile: {request.driver_profile}")
        
        # Get route comparison
        comparison = route_optimizer.get_route_comparison(
            request.origin, request.destination, driver_profile,
            request.battery_capacity_kwh, request.current_charge_kwh
        )
        
        # Convert to response format
        routes_response = {}
        for model_name, route_result in comparison.items():
            # Apply profile adjustments
            adjusted_energy = profile_manager.calculate_energy_consumption(
                route_result.total_distance_km, driver_profile
            )
            adjusted_time = profile_manager.calculate_travel_time(
                route_result.total_distance_km, driver_profile
            )
            adjusted_cost = profile_manager.calculate_cost(adjusted_energy, driver_profile)
            adjusted_emissions = profile_manager.calculate_emissions(adjusted_energy, driver_profile)
            
            routes_response[model_name] = RouteResponse(
                route=route_result.route,
                total_distance_km=route_result.total_distance_km,
                estimated_time_min=adjusted_time,
                energy_used_kWh=adjusted_energy,
                emissions_grams=adjusted_emissions,
                cost_euros=adjusted_cost,
                charging_stops=route_result.charging_stops,
                route_coordinates=route_result.route_coordinates,
                driver_profile=request.driver_profile,
                routing_model=model_name
            )
        
        # Create summary
        summary = {
            "best_time": min(routes_response.values(), key=lambda x: x.estimated_time_min).routing_model,
            "best_energy": min(routes_response.values(), key=lambda x: x.energy_used_kWh).routing_model,
            "best_distance": min(routes_response.values(), key=lambda x: x.total_distance_km).routing_model,
            "best_cost": min(routes_response.values(), key=lambda x: x.cost_euros).routing_model
        }
        
        return ComparisonResponse(routes=routes_response, summary=summary)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/ai-enhance")
async def enhance_route_with_ai(request: RouteRequest):
    """Enhance a route using AI analysis"""
    try:
        # First calculate a base route
        driver_profile = DriverProfile(request.driver_profile)
        
        if request.routing_model == "dijkstra":
            base_route = router.dijkstra_route(
                request.origin, request.destination,
                request.battery_capacity_kwh, request.current_charge_kwh
            )
        else:
            base_route = router.astar_route(
                request.origin, request.destination,
                request.battery_capacity_kwh, request.current_charge_kwh
            )
        
        # Create AI enhancement request
        ai_request = AIEnhancementRequest(
            origin=request.origin,
            destination=request.destination,
            current_route=base_route,
            driver_profile=request.driver_profile,
            preferences=request.preferences,
            context={}
        )
        
        # Get AI enhancement
        ai_response = ai_enhancer.enhance_route(ai_request)
        
        # Get additional AI insights
        traffic_analysis = ai_enhancer.analyze_traffic_patterns(base_route)
        weather_impact = ai_enhancer.predict_weather_impact(base_route)
        charging_suggestions = ai_enhancer.suggest_charging_optimization(
            base_route, request.driver_profile
        )
        
        return {
            "base_route": {
                "total_distance_km": base_route.total_distance_km,
                "estimated_time_min": base_route.estimated_time_min,
                "energy_used_kWh": base_route.energy_used_kWh,
                "emissions_grams": base_route.emissions_grams
            },
            "ai_enhancement": {
                "confidence_score": ai_response.confidence_score,
                "reasoning": ai_response.reasoning,
                "alternative_suggestions": ai_response.alternative_suggestions
            },
            "traffic_analysis": traffic_analysis,
            "weather_impact": weather_impact,
            "charging_suggestions": charging_suggestions
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "components": {
            "router": "operational",
            "profiles": "operational", 
            "optimizer": "operational",
            "ai_enhancer": "operational"
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 