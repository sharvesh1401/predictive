#!/usr/bin/env python3
"""
Test script for backend integration with new app module
"""
import sys
sys.path.insert(0, '.')

def test_routing_integration():
    """Test routing functionality"""
    print("=" * 50)
    print("🧪 Testing Backend Integration")
    print("=" * 50)
    
    try:
        from app.routing import compute_deterministic_route, get_available_locations
        from app.maps import get_cached_graph, fetch_netherlands_graph
        print("✅ Successfully imported routing and maps modules")
        
        # Test available locations
        locations = get_available_locations()
        print(f"📍 Available locations: {len(locations)} found")
        print(f"   First few: {locations[:5]}")
        
        # Test graph loading
        graph = get_cached_graph('amsterdam')
        print(f"🗺️  Amsterdam graph: {graph.number_of_nodes() if graph else 0} nodes, {graph.number_of_edges() if graph else 0} edges")
        
        # Test route calculation
        constraints = {
            'battery_capacity_kwh': 60.0,
            'current_charge_kwh': 45.0,
            'routing_model': 'dijkstra',
            'driver_profile': 'EFFICIENT'
        }
        
        origin = 'Amsterdam_Central'
        destination = 'Museumplein'
        
        print(f"\n🛣️  Testing route: {origin} -> {destination}")
        result = compute_deterministic_route(None, origin, destination, constraints)
        
        route_str = ' -> '.join(result['route'])
        print(f"   Route: {route_str}")
        print(f"   Distance: {result['metrics']['distance_m']/1000:.2f} km")
        print(f"   Duration: {result['metrics']['duration_s']/60:.1f} min")
        print(f"   Energy: {result['metrics']['energy_kwh']:.2f} kWh")
        print(f"   Confidence: {result['confidence']:.2f}")
        print(f"   Charging stops: {result['metrics'].get('charging_stops', 0)}")
        
        # Test different routing models
        print(f"\n🔄 Testing different routing models:")
        for model in ['dijkstra', 'astar', 'multi_objective']:
            try:
                test_constraints = constraints.copy()
                test_constraints['routing_model'] = model
                test_result = compute_deterministic_route(None, origin, destination, test_constraints)
                print(f"   {model}: ✅ Distance: {test_result['metrics']['distance_m']/1000:.2f} km, Confidence: {test_result['confidence']:.2f}")
            except Exception as e:
                print(f"   {model}: ❌ {str(e)[:50]}...")
        
        # Test AI-related functionality
        print(f"\n🤖 Testing AI integration:")
        from app.ai_client import should_call_ai, call_secondary_ai, AI_CONFIDENCE_THRESHOLD
        
        high_confidence = 0.9
        low_confidence = 0.5
        print(f"   AI threshold: {AI_CONFIDENCE_THRESHOLD}")
        print(f"   High confidence ({high_confidence}): should_call_ai = {should_call_ai(high_confidence)}")
        print(f"   Low confidence ({low_confidence}): should_call_ai = {should_call_ai(low_confidence)}")
        
        # Test confidence calculation
        from app.confidence import estimate_confidence_from_metrics
        test_metrics = {
            'unknown_segment_fraction': 0.1,
            'fallbacks': 0
        }
        conf = estimate_confidence_from_metrics(test_metrics)
        print(f"   Confidence estimation: {conf:.3f}")
        
        print(f"\n✅ All backend integration tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Backend integration error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_routing_integration()
    sys.exit(0 if success else 1)
