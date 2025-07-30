import networkx as nx
import numpy as np
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from .routing import AmsterdamRouter, RouteResult
from .profiles import DriverProfile, profile_manager

@dataclass
class OptimizationObjective:
    """Represents an optimization objective with weight"""
    name: str
    weight: float
    min_value: float
    max_value: float
    is_minimize: bool = True

class MultiObjectiveOptimizer:
    """Multi-objective optimization for EV routing"""
    
    def __init__(self, router: AmsterdamRouter):
        self.router = router
        self.objectives = []
    
    def add_objective(self, objective: OptimizationObjective):
        """Add an optimization objective"""
        self.objectives.append(objective)
    
    def weighted_sum_optimization(self, start: str, end: str, 
                                profile: DriverProfile,
                                battery_capacity_kwh: float = 60.0,
                                current_charge_kwh: float = 45.0) -> RouteResult:
        """
        Perform weighted sum optimization for multiple objectives
        """
        # Get profile weights
        profile_weights = profile_manager.get_optimization_weights(profile)
        
        # Generate multiple route candidates using different algorithms
        candidates = self._generate_route_candidates(start, end, battery_capacity_kwh, current_charge_kwh)
        
        if not candidates:
            raise ValueError(f"No valid routes found from {start} to {end}")
        
        # Evaluate each candidate
        best_score = float('inf')
        best_route = None
        
        for candidate in candidates:
            score = self._calculate_weighted_score(candidate, profile_weights)
            if score < best_score:
                best_score = score
                best_route = candidate
        
        return best_route
    
    def pareto_optimization(self, start: str, end: str,
                          profile: DriverProfile,
                          battery_capacity_kwh: float = 60.0,
                          current_charge_kwh: float = 45.0) -> List[RouteResult]:
        """
        Find Pareto-optimal solutions (non-dominated solutions)
        """
        candidates = self._generate_route_candidates(start, end, battery_capacity_kwh, current_charge_kwh)
        
        if not candidates:
            raise ValueError(f"No valid routes found from {start} to {end}")
        
        # Find non-dominated solutions
        pareto_front = []
        
        for candidate in candidates:
            is_dominated = False
            
            for other in candidates:
                if candidate != other and self._dominates(other, candidate):
                    is_dominated = True
                    break
            
            if not is_dominated:
                pareto_front.append(candidate)
        
        return pareto_front
    
    def _generate_route_candidates(self, start: str, end: str,
                                 battery_capacity_kwh: float,
                                 current_charge_kwh: float) -> List[RouteResult]:
        """Generate multiple route candidates using different approaches"""
        candidates = []
        
        try:
            # Dijkstra route
            dijkstra_route = self.router.dijkstra_route(
                start, end, battery_capacity_kwh, current_charge_kwh
            )
            candidates.append(dijkstra_route)
        except ValueError:
            pass
        
        try:
            # A* route
            astar_route = self.router.astar_route(
                start, end, battery_capacity_kwh, current_charge_kwh
            )
            candidates.append(astar_route)
        except ValueError:
            pass
        
        # Generate variations with different battery levels
        battery_variations = [0.8, 0.9, 1.0, 1.1, 1.2]
        for factor in battery_variations:
            try:
                adjusted_battery = current_charge_kwh * factor
                if adjusted_battery <= battery_capacity_kwh:
                    route = self.router.dijkstra_route(
                        start, end, battery_capacity_kwh, adjusted_battery
                    )
                    candidates.append(route)
            except ValueError:
                continue
        
        return candidates
    
    def _calculate_weighted_score(self, route: RouteResult, weights: Dict[str, float]) -> float:
        """Calculate weighted score for a route"""
        # Normalize objectives to 0-1 range
        normalized_scores = {
            'time': self._normalize_value(route.estimated_time_min, 10, 120),  # 10-120 minutes
            'distance': self._normalize_value(route.total_distance_km, 1, 50),  # 1-50 km
            'energy': self._normalize_value(route.energy_used_kWh, 0.5, 20),  # 0.5-20 kWh
            'cost': self._normalize_value(route.energy_used_kWh * 0.25, 0.1, 5)  # €0.1-5
        }
        
        # Calculate weighted sum
        total_score = 0
        for objective, weight in weights.items():
            if objective in normalized_scores:
                total_score += weight * normalized_scores[objective]
        
        return total_score
    
    def _normalize_value(self, value: float, min_val: float, max_val: float) -> float:
        """Normalize a value to 0-1 range"""
        return max(0, min(1, (value - min_val) / (max_val - min_val)))
    
    def _dominates(self, route1: RouteResult, route2: RouteResult) -> bool:
        """Check if route1 dominates route2 (Pareto dominance)"""
        # Route1 dominates route2 if it's better in at least one objective
        # and not worse in any objective
        better_in_any = False
        worse_in_any = False
        
        # Compare objectives
        objectives = [
            ('time', route1.estimated_time_min, route2.estimated_time_min, True),
            ('distance', route1.total_distance_km, route2.total_distance_km, True),
            ('energy', route1.energy_used_kWh, route2.energy_used_kWh, True),
            ('emissions', route1.emissions_grams, route2.emissions_grams, True)
        ]
        
        for name, val1, val2, minimize in objectives:
            if minimize:
                if val1 < val2:
                    better_in_any = True
                elif val1 > val2:
                    worse_in_any = True
            else:
                if val1 > val2:
                    better_in_any = True
                elif val1 < val2:
                    worse_in_any = True
        
        return better_in_any and not worse_in_any

class ChargingOptimizer:
    """Optimizes charging stop placement and timing"""
    
    def __init__(self, router: AmsterdamRouter):
        self.router = router
    
    def optimize_charging_stops(self, route: RouteResult, 
                              profile: DriverProfile,
                              battery_capacity_kwh: float = 60.0,
                              current_charge_kwh: float = 45.0) -> RouteResult:
        """
        Optimize charging stops along a route based on driver profile
        """
        charging_preference = profile_manager.get_charging_preference(profile)
        
        # If low charging preference, minimize stops
        if charging_preference < 0.5:
            return self._minimize_charging_stops(route, battery_capacity_kwh, current_charge_kwh)
        else:
            return self._optimize_charging_efficiency(route, battery_capacity_kwh, current_charge_kwh)
    
    def _minimize_charging_stops(self, route: RouteResult,
                               battery_capacity_kwh: float,
                               current_charge_kwh: float) -> RouteResult:
        """Minimize the number of charging stops"""
        # Simple approach: only charge when necessary
        # This is already handled in the routing algorithms
        return route
    
    def _optimize_charging_efficiency(self, route: RouteResult,
                                    battery_capacity_kwh: float,
                                    current_charge_kwh: float) -> RouteResult:
        """Optimize charging for efficiency (prefer fast chargers, optimal timing)"""
        # For now, return the original route
        # In a full implementation, this would:
        # 1. Identify optimal charging points
        # 2. Prefer fast chargers when available
        # 3. Consider charging costs and time
        return route

class RouteOptimizer:
    """Main optimizer class that combines all optimization strategies"""
    
    def __init__(self, router: AmsterdamRouter):
        self.router = router
        self.multi_objective_optimizer = MultiObjectiveOptimizer(router)
        self.charging_optimizer = ChargingOptimizer(router)
    
    def optimize_route(self, start: str, end: str, 
                      profile: DriverProfile,
                      optimization_type: str = "weighted_sum",
                      battery_capacity_kwh: float = 60.0,
                      current_charge_kwh: float = 45.0) -> RouteResult:
        """
        Optimize route based on profile and optimization type
        """
        if optimization_type == "weighted_sum":
            route = self.multi_objective_optimizer.weighted_sum_optimization(
                start, end, profile, battery_capacity_kwh, current_charge_kwh
            )
        elif optimization_type == "pareto":
            pareto_routes = self.multi_objective_optimizer.pareto_optimization(
                start, end, profile, battery_capacity_kwh, current_charge_kwh
            )
            # Select the first Pareto-optimal route
            route = pareto_routes[0] if pareto_routes else None
        else:
            # Default to Dijkstra
            route = self.router.dijkstra_route(
                start, end, battery_capacity_kwh, current_charge_kwh
            )
        
        if route is None:
            raise ValueError(f"No valid route found from {start} to {end}")
        
        # Apply charging optimization
        optimized_route = self.charging_optimizer.optimize_charging_stops(
            route, profile, battery_capacity_kwh, current_charge_kwh
        )
        
        return optimized_route
    
    def get_route_comparison(self, start: str, end: str,
                           profile: DriverProfile,
                           battery_capacity_kwh: float = 60.0,
                           current_charge_kwh: float = 45.0) -> Dict[str, RouteResult]:
        """
        Compare different optimization approaches
        """
        comparison = {}
        
        # Dijkstra
        try:
            comparison["dijkstra"] = self.router.dijkstra_route(
                start, end, battery_capacity_kwh, current_charge_kwh
            )
        except ValueError:
            pass
        
        # A*
        try:
            comparison["astar"] = self.router.astar_route(
                start, end, battery_capacity_kwh, current_charge_kwh
            )
        except ValueError:
            pass
        
        # Multi-objective optimization
        try:
            comparison["multi_objective"] = self.optimize_route(
                start, end, profile, "weighted_sum", battery_capacity_kwh, current_charge_kwh
            )
        except ValueError:
            pass
        
        return comparison 