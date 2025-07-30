from typing import Dict, Any
from dataclasses import dataclass
from enum import Enum

class DriverProfile(Enum):
    ECO = "eco"
    AGGRESSIVE = "aggressive"
    BALANCED = "balanced"

@dataclass
class ProfileConfig:
    """Configuration for a driver profile"""
    name: str
    description: str
    speed_factor: float  # Multiplier for average speed
    energy_efficiency: float  # Energy consumption multiplier
    charging_preference: float  # Preference for charging stops (0-1)
    time_weight: float  # Weight for time optimization
    distance_weight: float  # Weight for distance optimization
    energy_weight: float  # Weight for energy optimization
    cost_weight: float  # Weight for cost optimization
    max_speed_kmh: float  # Maximum speed in km/h
    acceleration_rate: float  # Acceleration preference
    braking_style: str  # "smooth" or "aggressive"

class DriverProfileManager:
    """Manages different driver profiles and their characteristics"""
    
    def __init__(self):
        self.profiles = self._initialize_profiles()
    
    def _initialize_profiles(self) -> Dict[DriverProfile, ProfileConfig]:
        """Initialize the available driver profiles"""
        return {
            DriverProfile.ECO: ProfileConfig(
                name="Eco Driver",
                description="Prioritizes energy efficiency and environmental impact",
                speed_factor=0.8,  # 20% slower than average
                energy_efficiency=0.85,  # 15% more efficient
                charging_preference=0.9,  # High preference for charging
                time_weight=0.2,
                distance_weight=0.3,
                energy_weight=0.4,
                cost_weight=0.1,
                max_speed_kmh=30.0,
                acceleration_rate=0.6,  # Gentle acceleration
                braking_style="smooth"
            ),
            
            DriverProfile.AGGRESSIVE: ProfileConfig(
                name="Aggressive Driver",
                description="Prioritizes speed and time efficiency",
                speed_factor=1.3,  # 30% faster than average
                energy_efficiency=1.25,  # 25% less efficient
                charging_preference=0.3,  # Low preference for charging stops
                time_weight=0.6,
                distance_weight=0.2,
                energy_weight=0.1,
                cost_weight=0.1,
                max_speed_kmh=50.0,
                acceleration_rate=1.4,  # Aggressive acceleration
                braking_style="aggressive"
            ),
            
            DriverProfile.BALANCED: ProfileConfig(
                name="Balanced Driver",
                description="Balanced approach considering all factors",
                speed_factor=1.0,  # Average speed
                energy_efficiency=1.0,  # Average efficiency
                charging_preference=0.6,  # Moderate preference for charging
                time_weight=0.3,
                distance_weight=0.3,
                energy_weight=0.2,
                cost_weight=0.2,
                max_speed_kmh=40.0,
                acceleration_rate=1.0,  # Normal acceleration
                braking_style="smooth"
            )
        }
    
    def get_profile(self, profile_type: DriverProfile) -> ProfileConfig:
        """Get a specific driver profile configuration"""
        return self.profiles.get(profile_type)
    
    def get_all_profiles(self) -> Dict[str, Dict[str, Any]]:
        """Get all available profiles as a dictionary"""
        return {
            profile.value: {
                "name": config.name,
                "description": config.description,
                "speed_factor": config.speed_factor,
                "energy_efficiency": config.energy_efficiency,
                "charging_preference": config.charging_preference,
                "weights": {
                    "time": config.time_weight,
                    "distance": config.distance_weight,
                    "energy": config.energy_weight,
                    "cost": config.cost_weight
                }
            }
            for profile, config in self.profiles.items()
        }
    
    def calculate_energy_consumption(self, distance_km: float, profile: DriverProfile) -> float:
        """Calculate energy consumption based on driver profile"""
        config = self.get_profile(profile)
        base_consumption = distance_km * 0.2  # Base: 0.2 kWh/km
        return base_consumption * config.energy_efficiency
    
    def calculate_travel_time(self, distance_km: float, profile: DriverProfile) -> float:
        """Calculate travel time based on driver profile"""
        config = self.get_profile(profile)
        base_speed_kmh = 24.0  # Base speed in Amsterdam
        adjusted_speed = base_speed_kmh * config.speed_factor
        return (distance_km / adjusted_speed) * 60  # Convert to minutes
    
    def calculate_cost(self, energy_kwh: float, profile: DriverProfile) -> float:
        """Calculate travel cost based on energy consumption"""
        # Dutch electricity price: ~€0.25/kWh
        electricity_price = 0.25
        return energy_kwh * electricity_price
    
    def calculate_emissions(self, energy_kwh: float, profile: DriverProfile) -> float:
        """Calculate CO2 emissions based on energy consumption"""
        # Dutch grid emissions factor: 84.5 g CO2/kWh
        emissions_factor = 84.5
        return energy_kwh * emissions_factor
    
    def apply_profile_to_route(self, route_data: Dict[str, Any], profile: DriverProfile) -> Dict[str, Any]:
        """Apply driver profile characteristics to route data"""
        config = self.get_profile(profile)
        
        # Adjust route statistics based on profile
        distance_km = route_data.get('total_distance_km', 0)
        
        # Calculate adjusted values
        adjusted_energy = self.calculate_energy_consumption(distance_km, profile)
        adjusted_time = self.calculate_travel_time(distance_km, profile)
        adjusted_cost = self.calculate_cost(adjusted_energy, profile)
        adjusted_emissions = self.calculate_emissions(adjusted_energy, profile)
        
        return {
            **route_data,
            'total_distance_km': distance_km,
            'estimated_time_min': adjusted_time,
            'energy_used_kWh': adjusted_energy,
            'emissions_grams': adjusted_emissions,
            'cost_euros': adjusted_cost,
            'driver_profile': profile.value,
            'profile_characteristics': {
                'speed_factor': config.speed_factor,
                'energy_efficiency': config.energy_efficiency,
                'max_speed_kmh': config.max_speed_kmh,
                'acceleration_rate': config.acceleration_rate,
                'braking_style': config.braking_style
            }
        }
    
    def get_charging_preference(self, profile: DriverProfile) -> float:
        """Get charging preference for a profile"""
        config = self.get_profile(profile)
        return config.charging_preference
    
    def get_optimization_weights(self, profile: DriverProfile) -> Dict[str, float]:
        """Get optimization weights for a profile"""
        config = self.get_profile(profile)
        return {
            'time': config.time_weight,
            'distance': config.distance_weight,
            'energy': config.energy_weight,
            'cost': config.cost_weight
        }

# Global instance for easy access
profile_manager = DriverProfileManager() 