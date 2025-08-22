"""
AI client wrapper for secondary optimizers.
Tries DeepSeek first, then Groq as a fallback if DeepSeek fails.
Only invoked when algorithm confidence < AI_CONFIDENCE_THRESHOLD.
"""
import os
import time
import logging
from typing import Optional, Dict, Any

import requests

logger = logging.getLogger(__name__)

DEEPSEEK_API_URL = os.getenv("DEEPSEEK_API_URL")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
GROQ_API_URL = os.getenv("GROQ_API_URL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
AI_CONFIDENCE_THRESHOLD = float(os.getenv("AI_CONFIDENCE_THRESHOLD", "0.75"))

MAX_TRIES = int(os.getenv("AI_MAX_TRIES", "3"))
BASE_BACKOFF = float(os.getenv("AI_BASE_BACKOFF", "1.0"))

def _request_with_retries(method, url, headers=None, json=None, timeout=20):
    last_exc = None
    for attempt in range(1, MAX_TRIES + 1):
        try:
            resp = requests.request(method, url, headers=headers, json=json, timeout=timeout)
            resp.raise_for_status()
            try:
                return resp.json()
            except Exception:
                return {"raw": resp.text}
        except Exception as e:
            last_exc = e
            backoff = BASE_BACKOFF * (2 ** (attempt - 1))
            logger.warning("AI request attempt %d failed: %s â€” backing off %.1fs", attempt, e, backoff)
            time.sleep(backoff)
    raise last_exc

def should_call_ai(algo_confidence: float) -> bool:
    try:
        conf = float(algo_confidence)
    except Exception:
        return True
    return conf < AI_CONFIDENCE_THRESHOLD

def _call_deepseek(route_payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if not DEEPSEEK_API_URL or not DEEPSEEK_API_KEY:
        logger.debug("DeepSeek keys not configured; skipping DeepSeek")
        return None
    headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}", "Content-Type": "application/json"}
    body = {
        "route": route_payload.get("route"),
        "origin": route_payload.get("origin"),
        "destination": route_payload.get("destination"),
        "constraints": route_payload.get("constraints", {}),
        "meta": route_payload.get("meta", {})
    }
    return _request_with_retries("POST", DEEPSEEK_API_URL, headers=headers, json=body)

def _call_groq(route_payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if not GROQ_API_URL or not GROQ_API_KEY:
        logger.debug("Groq keys not configured; skipping Groq")
        return None
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    body = {
        "route": route_payload.get("route"),
        "origin": route_payload.get("origin"),
        "destination": route_payload.get("destination"),
        "constraints": route_payload.get("constraints", {}),
        "meta": route_payload.get("meta", {})
    }
    return _request_with_retries("POST", GROQ_API_URL, headers=headers, json=body)

def call_secondary_ai(route_payload: Dict[str, Any]) -> Dict[str, Any]:
    errors = []
    try:
        logger.info("Calling DeepSeek as primary secondary agent...")
        ds_resp = _call_deepseek(route_payload)
        if ds_resp:
            logger.info("DeepSeek returned a response.")
            return {"agent": "deepseek", "result": ds_resp}
    except Exception as e:
        logger.exception("DeepSeek call failed: %s", e)
        errors.append(("deepseek", str(e)))

    try:
        logger.info("Calling Groq as fallback agent...")
        gr_resp = _call_groq(route_payload)
        if gr_resp:
            logger.info("Groq returned a response.")
            return {"agent": "groq", "result": gr_resp}
    except Exception as e:
        logger.exception("Groq call failed: %s", e)
        errors.append(("groq", str(e)))

    return {"agent": None, "result": None, "error": errors}
