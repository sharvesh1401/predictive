def estimate_confidence_from_metrics(metrics: dict) -> float:
    unknown_frac = float(metrics.get("unknown_segment_fraction", 0.0))
    fallbacks = int(metrics.get("fallbacks", 0))
    score = 1.0 - (unknown_frac * 0.8) - (min(fallbacks, 5) * 0.03)
    return max(0.0, min(1.0, score))
