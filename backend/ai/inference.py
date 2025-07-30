import os
import json
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import requests
from .models.routing import RouteResult

@dataclass
class AIEnhancementRequest:
    """Request for AI route enhancement"""
    origin: str
    destination: str
    current_route: RouteResult
    driver_profile: str
    preferences: Dict[str, Any]
    context: Dict[str, Any]

@dataclass
class AIEnhancementResponse:
    """Response from AI route enhancement"""
    enhanced_route: RouteResult
    confidence_score: float
    reasoning: str
    alternative_suggestions: List[Dict[str, Any]]

class AIRouteEnhancer:
    """AI-powered route enhancement using external APIs"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.base_url = "https://api.openai.com/v1/chat/completions"
        self.model = "gpt-4"
    
    def enhance_route(self, request: AIEnhancementRequest) -> AIEnhancementResponse:
        """
        Enhance a route using AI analysis
        """
        try:
            # Prepare the prompt for AI analysis
            prompt = self._create_enhancement_prompt(request)
            
            # Call AI API
            response = self._call_ai_api(prompt)
            
            # Parse and return the enhanced route
            return self._parse_ai_response(response, request.current_route)
            
        except Exception as e:
            # Fallback to original route if AI enhancement fails
            return AIEnhancementResponse(
                enhanced_route=request.current_route,
                confidence_score=0.0,
                reasoning=f"AI enhancement failed: {str(e)}",
                alternative_suggestions=[]
            )
    
    def _create_enhancement_prompt(self, request: AIEnhancementRequest) -> str:
        """Create a prompt for AI route enhancement"""
        prompt = f"""
        You are an AI assistant specialized in electric vehicle routing optimization for Amsterdam.
        
        Current Route Analysis:
        - Origin: {request.origin}
        - Destination: {request.destination}
        - Total Distance: {request.current_route.total_distance_km:.2f} km
        - Estimated Time: {request.current_route.estimated_time_min:.1f} minutes
        - Energy Usage: {request.current_route.energy_used_kWh:.2f} kWh
        - Emissions: {request.current_route.emissions_grams:.1f} g CO2
        - Charging Stops: {len(request.current_route.charging_stops)}
        
        Driver Profile: {request.driver_profile}
        Preferences: {json.dumps(request.preferences, indent=2)}
        
        Please analyze this route and suggest improvements considering:
        1. Energy efficiency optimization
        2. Time optimization
        3. Charging stop optimization
        4. Environmental impact
        5. Cost considerations
        
        Provide specific recommendations for route improvements.
        """
        return prompt
    
    def _call_ai_api(self, prompt: str) -> Dict[str, Any]:
        """Call the AI API (OpenAI/DeepSeek)"""
        if not self.api_key:
            raise ValueError("API key not provided")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are an expert in EV routing optimization."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 1000,
            "temperature": 0.7
        }
        
        response = requests.post(self.base_url, headers=headers, json=data)
        response.raise_for_status()
        
        return response.json()
    
    def _parse_ai_response(self, ai_response: Dict[str, Any], 
                          original_route: RouteResult) -> AIEnhancementResponse:
        """Parse AI response and create enhanced route"""
        try:
            content = ai_response["choices"][0]["message"]["content"]
            
            # For now, return the original route with AI analysis
            # In a full implementation, this would parse the AI response
            # and create actual route modifications
            
            return AIEnhancementResponse(
                enhanced_route=original_route,
                confidence_score=0.8,
                reasoning=content,
                alternative_suggestions=[]
            )
            
        except (KeyError, IndexError) as e:
            raise ValueError(f"Failed to parse AI response: {e}")
    
    def analyze_traffic_patterns(self, route: RouteResult) -> Dict[str, Any]:
        """Analyze traffic patterns for route optimization"""
        # Placeholder for traffic analysis
        return {
            "congestion_level": "medium",
            "peak_hours": ["08:00-10:00", "17:00-19:00"],
            "recommended_departure_time": "10:30",
            "traffic_factor": 1.2
        }
    
    def predict_weather_impact(self, route: RouteResult) -> Dict[str, Any]:
        """Predict weather impact on route efficiency"""
        # Placeholder for weather analysis
        return {
            "weather_condition": "clear",
            "temperature_celsius": 15,
            "wind_speed_kmh": 10,
            "energy_impact_factor": 1.05
        }
    
    def suggest_charging_optimization(self, route: RouteResult, 
                                   driver_profile: str) -> List[Dict[str, Any]]:
        """Suggest charging stop optimizations"""
        suggestions = []
        
        for i, stop in enumerate(route.charging_stops):
            suggestion = {
                "station_id": stop["station_id"],
                "current_charge_time": 30,  # minutes
                "suggested_charge_time": 45,  # minutes
                "reasoning": "Optimal charging time for battery health",
                "cost_savings": 2.50  # euros
            }
            suggestions.append(suggestion)
        
        return suggestions

class MockAIEnhancer:
    """Mock AI enhancer for development and testing"""
    
    def enhance_route(self, request: AIEnhancementRequest) -> AIEnhancementResponse:
        """Mock route enhancement"""
        # Create a slightly modified route for demonstration
        enhanced_route = request.current_route
        
        return AIEnhancementResponse(
            enhanced_route=enhanced_route,
            confidence_score=0.85,
            reasoning="AI analysis suggests this route is already well-optimized for the given profile. Consider departing 15 minutes earlier to avoid peak traffic.",
            alternative_suggestions=[
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
        )
    
    def analyze_traffic_patterns(self, route: RouteResult) -> Dict[str, Any]:
        """Mock traffic analysis"""
        return {
            "congestion_level": "low",
            "peak_hours": ["08:00-10:00", "17:00-19:00"],
            "recommended_departure_time": "10:30",
            "traffic_factor": 1.1
        }
    
    def predict_weather_impact(self, route: RouteResult) -> Dict[str, Any]:
        """Mock weather prediction"""
        return {
            "weather_condition": "partly_cloudy",
            "temperature_celsius": 18,
            "wind_speed_kmh": 8,
            "energy_impact_factor": 1.02
        }

# Factory function to create AI enhancer
def create_ai_enhancer(use_mock: bool = True, api_key: Optional[str] = None):
    """Create an AI enhancer instance"""
    if use_mock or not api_key:
        return MockAIEnhancer()
    else:
        return AIRouteEnhancer(api_key) 