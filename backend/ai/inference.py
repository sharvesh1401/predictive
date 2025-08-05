import os
import json
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import requests
from models.routing import RouteResult

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
    
    def suggest_charging_optimization(self, route: RouteResult, driver_profile: str) -> List[Dict[str, Any]]:
        """Suggest charging optimizations based on route and driver profile
        
        Args:
            route: The route to optimize charging for
            driver_profile: The driver's profile (e.g., 'eco', 'balanced', 'sport')
            
        Returns:
            List of charging optimization suggestions
        """
        # In a real implementation, this would use AI to analyze the route
        # and provide smart charging recommendations
        try:
            # Prepare the prompt for AI analysis
            prompt = self._create_charging_optimization_prompt(route, driver_profile)
            
            # Call AI API
            response = self._call_ai_api(prompt)
            
            # Parse and return the suggestions
            return self._parse_charging_suggestions(response)
            
        except Exception as e:
            # Fallback to basic suggestions if AI fails
            print(f"AI charging optimization failed: {e}")
            
            # Calculate remaining battery percentage if we have the required attributes
            remaining_battery_percent = 0
            if hasattr(route, 'current_charge_kwh') and hasattr(route, 'battery_capacity_kwh'):
                remaining_battery_percent = (route.current_charge_kwh / route.battery_capacity_kwh) * 100
            
            # Provide a basic suggestion based on battery level
            if remaining_battery_percent < 20:
                return [{
                    "type": "charging_stop",
                    "location": "Nearest Fast Charger",
                    "suggested_charge_level": 80,
                    "estimated_charging_time": 30,
                    "reason": f"Battery level ({remaining_battery_percent:.1f}%) is low. Consider charging soon.",
                    "priority": "high"
                }]
            else:
                return [{
                    "type": "info",
                    "message": "Battery level is sufficient. No charging needed at this time.",
                    "priority": "low"
                }]
    
    def _get_charging_suggestions(self, route: RouteResult) -> List[Dict[str, Any]]:
        """Get charging station suggestions along the route"""
        # This is a placeholder implementation
        # In a real implementation, this would use charging station data
        # and the vehicle's charging curve to optimize charging stops
        suggestions = []
        
        # Example suggestion: Add a charging stop if battery is low
        if hasattr(route, 'remaining_battery_percent') and route.remaining_battery_percent < 20:
            suggestions.append({
                "location": "FastCharge Station #123",
                "suggested_charge_level": 80,
                "estimated_charging_time": 25,
                "reason": f"Battery level ({route.remaining_battery_percent}%) is low"
            })
            
        return suggestions
    
    def _create_charging_optimization_prompt(self, route: RouteResult, driver_profile: str) -> str:
        """Create a prompt for AI charging optimization"""
        # Get available attributes safely
        origin = getattr(route, 'origin', 'Unknown')
        destination = getattr(route, 'destination', 'Unknown')
        total_distance = getattr(route, 'total_distance_km', 0)
        estimated_time = getattr(route, 'estimated_time_min', 0)
        energy_used = getattr(route, 'energy_used_kWh', 0)
        emissions = getattr(route, 'emissions_grams', 0)
        charging_stops = getattr(route, 'charging_stops', [])
        
        # Calculate battery percentage if possible
        battery_info = ""
        if hasattr(route, 'current_charge_kwh') and hasattr(route, 'battery_capacity_kwh'):
            battery_percent = (route.current_charge_kwh / route.battery_capacity_kwh) * 100
            battery_info = f"- Current Battery: {battery_percent:.1f}%\n"
        
        prompt = f"""
        You are an AI assistant specialized in electric vehicle charging optimization for Amsterdam.
        
        Current Route Analysis:
        - Origin: {origin}
        - Destination: {destination}
        - Total Distance: {total_distance:.2f} km
        - Estimated Time: {estimated_time:.1f} minutes
        - Energy Usage: {energy_used:.2f} kWh
        - Emissions: {emissions:.1f} g CO2
        {battery_info}- Charging Stops: {len(charging_stops)}
        
        Driver Profile: {driver_profile}
        
        Please analyze this route and suggest charging optimizations considering:
        1. Energy efficiency optimization
        2. Time optimization
        3. Charging stop optimization
        4. Environmental impact
        5. Cost considerations
        
        Provide specific recommendations for charging optimizations.
        """
        return prompt
    
    def _parse_charging_suggestions(self, ai_response: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parse AI response and create charging suggestions"""
        try:
            content = ai_response["choices"][0]["message"]["content"]
            
            # For now, return basic suggestions
            # In a full implementation, this would parse the AI response
            # and create actual charging suggestions
            
            return [
                {
                    "location": "FastCharge Station #123",
                    "suggested_charge_level": 80,
                    "estimated_charging_time": 25,
                    "reason": f"Battery level is low"
                }
            ]
            
        except (KeyError, IndexError) as e:
            raise ValueError(f"Failed to parse AI response: {e}")

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
    
    def suggest_charging_optimization(self, route: RouteResult, driver_profile: str) -> List[Dict[str, Any]]:
        """Suggest charging optimizations based on route and driver profile
        
        Args:
            route: The route to optimize charging for
            driver_profile: The driver's profile (e.g., 'eco', 'balanced', 'sport')
            
        Returns:
            List of charging optimization suggestions
        """
        # This is a mock implementation that provides example suggestions
        suggestions = []
        
        # Calculate remaining battery percentage if we have the required attributes
        remaining_battery_percent = 0
        if hasattr(route, 'current_charge_kwh') and hasattr(route, 'battery_capacity_kwh'):
            remaining_battery_percent = (route.current_charge_kwh / route.battery_capacity_kwh) * 100
        
        # Example suggestion 1: Fast charging when battery is low
        if remaining_battery_percent < 20:
            suggestions.append({
                "type": "charging_stop",
                "location": "FastCharge Station #123",
                "suggested_charge_level": 80,
                "estimated_charging_time": 25,
                "reason": f"Battery level ({remaining_battery_percent:.1f}%) is low. Top up to 80% for optimal range.",
                "priority": "high"
            })
        
        # Example suggestion 2: Destination charging if available
        if hasattr(route, 'route') and ("Amsterdam_Central" in route.route or "Amsterdam_Schiphol" in route.route):
            suggestions.append({
                "type": "destination_charging",
                "location": "Destination Charger",
                "suggested_charge_level": 90,
                "estimated_charging_time": 45,
                "reason": "Charging available at destination. Top up while parked.",
                "priority": "medium"
            })
            
        # Example suggestion 3: Off-peak charging if applicable
        if driver_profile == "eco":
            suggestions.append({
                "type": "timing_optimization",
                "suggestion": "Charge during off-peak hours (23:00-07:00)",
                "cost_savings": "30%",
                "reason": "Lower electricity rates during off-peak hours",
                "priority": "low"
            })
        
        # If no suggestions were added, provide a default one
        if not suggestions:
            suggestions.append({
                "type": "info",
                "message": "No specific charging optimizations needed.",
                "priority": "low"
            })
            
        return suggestions

# Factory function to create AI enhancer
def create_ai_enhancer(use_mock: bool = True, api_key: Optional[str] = None):
    """Create an AI enhancer instance"""
    if use_mock or not api_key:
        return MockAIEnhancer()
    else:
        return AIRouteEnhancer(api_key) 