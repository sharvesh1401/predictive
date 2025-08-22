import os
import logging
from .ai_client import should_call_ai, call_secondary_ai, AI_CONFIDENCE_THRESHOLD
from .confidence import estimate_confidence_from_metrics

logger = logging.getLogger(__name__)

def compute_route_job(job_id, payload):
    try:
        origin = payload["origin"]
        destination = payload["destination"]
        constraints = payload.get("constraints", {})

        graph = None
        try:
            from .maps import get_cached_graph, fetch_netherlands_graph
            graph = get_cached_graph(region="netherlands")
            if not graph:
                graph = fetch_netherlands_graph(api_url=os.getenv("MAP_API_URL"), api_key=os.getenv("MAP_API_KEY"))
        except Exception:
            logger.warning("Map graph utilities not found; ensure you implement maps.get_cached_graph and maps.fetch_netherlands_graph")

        base_result = {}
        try:
            from .routing import compute_deterministic_route
            base_result = compute_deterministic_route(graph, origin, destination, constraints)
        except Exception:
            logger.warning("Deterministic routing function not found; please implement routing.compute_deterministic_route")
            base_result = {"route": [origin, destination], "confidence": 0.5, "metrics": {"distance_m": None, "duration_s": None}}

        base_route = base_result.get("route")
        base_confidence = float(base_result.get("confidence", 0.0))
        base_metrics = base_result.get("metrics", {})

        logger.info("Base algorithm confidence: %.3f", base_confidence)

        final_result = {
            "source": "algorithm",
            "route": base_route,
            "confidence": base_confidence,
            "metrics": base_metrics
        }

        if should_call_ai(base_confidence):
            logger.info("Confidence below threshold (%.2f). Calling AI agents.", AI_CONFIDENCE_THRESHOLD)
            route_payload = {
                "route": base_route,
                "origin": origin,
                "destination": destination,
                "constraints": constraints,
                "meta": {"job_id": job_id, "base_confidence": base_confidence, "metrics": base_metrics}
            }
            ai_resp = call_secondary_ai(route_payload)
            if ai_resp.get("result"):
                agent = ai_resp.get("agent")
                agent_result = ai_resp["result"]
                candidate_route = agent_result.get("route")
                improvement_score = float(agent_result.get("improvement_score", 0.0)) if agent_result.get("improvement_score") is not None else None

                accept = False
                if candidate_route:
                    if improvement_score is not None:
                        if improvement_score >= 0.02:
                            accept = True
                    else:
                        cand_metrics = agent_result.get("metrics", {})
                        base_time = base_metrics.get("duration_s")
                        cand_time = cand_metrics.get("duration_s")
                        if base_time and cand_time and cand_time < base_time * 0.99:
                            accept = True

                if accept:
                    final_result = {
                        "source": f"ai_{agent}",
                        "route": candidate_route,
                        "confidence": agent_result.get("confidence", base_confidence),
                        "metrics": agent_result.get("metrics", base_metrics),
                        "agent_improvement_score": improvement_score
                    }
                else:
                    logger.info("AI candidate rejected; retaining deterministic route.")
            else:
                logger.warning("AI agents returned no valid result: %s", ai_resp.get("error"))

        try:
            from .models import update_job_record
            update_job_record(job_id, status="COMPLETED", result=final_result)
        except Exception:
            logger.info("update_job_record not implemented - skipping persistence (please implement). Final result: %s", final_result)

    except Exception as e:
        logger.exception("Job %s failed: %s", job_id, e)
        try:
            from .models import update_job_record
            update_job_record(job_id, status="FAILED", error=str(e))
        except Exception:
            logger.warning("update_job_record not implemented; job failed: %s", e)
