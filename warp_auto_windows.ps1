<#
PowerShell automated fixer for "Predictive Routing for ev" repo.
Modified version that works with existing project structure and preserves good existing files.
Conservative: creates backup branch and a new feature branch, commits changes,
writes logs and a patch file.

Run from predictive/ directory (repo root). Review patch before merging.
#>

$ErrorActionPreference = 'Stop'

# === Config ===
$RepoRoot = (Get-Location).Path
$Timestamp = [int](Get-Date -UFormat %s)
$BackupBranch = "fix/backup-before-warp-$Timestamp"
$PatchBranch  = "fix/warp-auto-fixes-$Timestamp"
$LogDir = Join-Path $RepoRoot "warp_debug_logs_$Timestamp"
New-Item -ItemType Directory -Path $LogDir -Force | Out-Null

Write-Host "Repo root: $RepoRoot"
Write-Host "Timestamp: $Timestamp"
Write-Host "Log dir: $LogDir"

# === Git safety - create backup branch ===
Try {
    Write-Host "Creating backup branch: $BackupBranch"
    & git checkout -b $BackupBranch
} Catch {
    Write-Host "Backup branch may already exist; switching to it"
    & git checkout $BackupBranch
}

# stage everything and commit a WIP backup (non-fatal if nothing to commit)
Try {
    & git add -A
    & git commit -m "WIP: backup commit before automated fixes ($Timestamp)"
} Catch {
    Write-Host "No changes to commit for backup (ok)."
}

# create working branch
Write-Host "Creating new patch branch: $PatchBranch"
& git checkout -b $PatchBranch

# convenience paths
$FrontendDir = Join-Path $RepoRoot "frontend"
$BackendDir  = Join-Path $RepoRoot "backend"

# === Helper function: write file with UTF8 ===
function Write-FileUtf8([string]$Path, [string]$Content) {
    $dir = Split-Path $Path -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $Content | Out-File -FilePath $Path -Encoding utf8 -Force
    Write-Host "Wrote $Path"
}

# === BACKEND: ensure backend/app dir exists ===
$BackendAppDir = Join-Path $BackendDir "app"
if (-not (Test-Path $BackendAppDir)) { 
    New-Item -ItemType Directory -Path $BackendAppDir -Force | Out-Null 
    Write-Host "Created backend/app directory"
}

# === BACKEND: health stub ===
$HealthStub = Join-Path $BackendAppDir "health_stub.py"
if (-not (Test-Path $HealthStub)) {
    $healthStubContent = @'
from fastapi import FastAPI
app = FastAPI()

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/readiness")
def readiness():
    return {"status": "ready"}
'@
    Write-FileUtf8 -Path $HealthStub -Content $healthStubContent
    & git add $HealthStub
    try { & git commit -m "chore(backend): add health and readiness stub (auto)" 2>$null } catch { Write-Host "health stub commit skipped." }
} else {
    Write-Host "backend/app/health_stub.py already exists"
}

# === BACKEND: worker skeleton ===
$WorkerFile = Join-Path $BackendAppDir "worker.py"
if (-not (Test-Path $WorkerFile)) {
    $workerContent = @'
import os
from rq import Queue, Connection, Worker
from redis import Redis

redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
conn = Redis.from_url(redis_url)
q = Queue("routing", connection=conn)

if __name__ == "__main__":
    with Connection(conn):
        worker = Worker(["routing"])
        worker.work()
'@
    Write-FileUtf8 -Path $WorkerFile -Content $workerContent
    & git add $WorkerFile
    try { & git commit -m "chore(backend): add worker skeleton (auto)" 2>$null } catch { Write-Host "worker commit skipped." }
} else {
    Write-Host "backend/app/worker.py already exists"
}

# === BACKEND: ai_client.py (DeepSeek -> Groq fallback) ===
$AIClient = Join-Path $BackendAppDir "ai_client.py"
if (-not (Test-Path $AIClient)) {
    $aiClientContent = @'
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
            logger.warning("AI request attempt %d failed: %s — backing off %.1fs", attempt, e, backoff)
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
'@
    Write-FileUtf8 -Path $AIClient -Content $aiClientContent
    & git add $AIClient
    try { & git commit -m "feat(backend): add ai_client (DeepSeek -> Groq fallback) (auto)" 2>$null } catch { Write-Host "ai_client commit skipped." }
} else {
    Write-Host "backend/app/ai_client.py already exists"
}

# === BACKEND: confidence helper ===
$ConfidenceFile = Join-Path $BackendAppDir "confidence.py"
if (-not (Test-Path $ConfidenceFile)) {
    $confidenceContent = @'
def estimate_confidence_from_metrics(metrics: dict) -> float:
    unknown_frac = float(metrics.get("unknown_segment_fraction", 0.0))
    fallbacks = int(metrics.get("fallbacks", 0))
    score = 1.0 - (unknown_frac * 0.8) - (min(fallbacks, 5) * 0.03)
    return max(0.0, min(1.0, score))
'@
    Write-FileUtf8 -Path $ConfidenceFile -Content $confidenceContent
    & git add $ConfidenceFile
    try { & git commit -m "chore(backend): add confidence helper (auto)" 2>$null } catch { Write-Host "confidence helper commit skipped." }
} else {
    Write-Host "backend/app/confidence.py already exists"
}

# === BACKEND: jobs scaffold ===
$JobsFile = Join-Path $BackendAppDir "jobs.py"
if (-not (Test-Path $JobsFile)) {
    $jobsContent = @'
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
'@
    Write-FileUtf8 -Path $JobsFile -Content $jobsContent
    & git add $JobsFile
    try { & git commit -m "feat(backend): add compute_route_job scaffold (auto)" 2>$null } catch { Write-Host "jobs commit skipped." }
} else {
    Write-Host "backend/app/jobs.py already exists"
}

# === BACKEND: __init__.py for app module ===
$AppInit = Join-Path $BackendAppDir "__init__.py"
if (-not (Test-Path $AppInit)) {
    Write-FileUtf8 -Path $AppInit -Content ""
    & git add $AppInit
    try { & git commit -m "chore(backend): add app/__init__.py (auto)" 2>$null } catch { Write-Host "app __init__ commit skipped." }
} else {
    Write-Host "backend/app/__init__.py already exists"
}

# === FRONTEND: add Dockerfile.prod (missing from your setup) ===
$DockerProd = Join-Path $FrontendDir "Dockerfile.prod"
if (-not (Test-Path $DockerProd)) {
    $dockerProd = @'
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY build/ /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1
'@
    Write-FileUtf8 -Path $DockerProd -Content $dockerProd
    & git add $DockerProd
    try { & git commit -m "chore(frontend): add Dockerfile.prod (auto)" 2>$null } catch { Write-Host "Dockerfile.prod commit skipped." }
} else {
    Write-Host "frontend/Dockerfile.prod already exists"
}

# === Update existing env.example with additional AI vars (preserving existing content) ===
$EnvExample = Join-Path $RepoRoot "env.example"
if (Test-Path $EnvExample) {
    $existingEnv = Get-Content $EnvExample -Raw
    # Only add if DeepSeek/Groq vars don't already exist
    if ($existingEnv -notmatch "DEEPSEEK_API_URL" -and $existingEnv -notmatch "AI_CONFIDENCE_THRESHOLD") {
        $additionalVars = @'

# Secondary AI Agents (DeepSeek & Groq) - for route optimization
DEEPSEEK_API_URL=https://api.deepseek.com
DEEPSEEK_API_KEY=your_deepseek_key_here
GROQ_API_URL=https://api.groq.com/openai/v1
GROQ_API_KEY=your_groq_key_here

# AI Configuration
AI_CONFIDENCE_THRESHOLD=0.75
AI_MAX_TRIES=3
AI_BASE_BACKOFF=1.0

# Additional services for backend scaling
REDIS_URL=redis://redis:6379/0
DATABASE_URL=postgresql://postgres:postgres@db:5432/predictive
SECRET_KEY=replace_this_secret
'@
        $newEnvContent = $existingEnv.TrimEnd() + $additionalVars
        Write-FileUtf8 -Path $EnvExample -Content $newEnvContent
        & git add $EnvExample
        try { & git commit -m "chore: extend env.example with AI and backend vars (auto)" 2>$null } catch { Write-Host "env.example update commit skipped." }
    } else {
        Write-Host "env.example already contains AI configuration"
    }
}

# === Fix nginx.conf API proxy (currently mocked) ===
$NginxPath = Join-Path $FrontendDir "nginx.conf"
if (Test-Path $NginxPath) {
    $nginxContent = Get-Content $NginxPath -Raw
    if ($nginxContent -match "Mock API response") {
        Write-Host "Fixing nginx.conf to enable real API proxy (currently mocked)"
        $fixedNginx = $nginxContent -replace '# For standalone frontend testing, return a mock response.*?add_header Content-Type application/json;\s*', '' `
                                     -replace '# Uncomment below for actual backend connection\s*#\s*', '' `
                                     -replace '#\s*(proxy_pass.*?;)', '$1' `
                                     -replace '#\s*(proxy_set_header.*?;)', '$1'
        Write-FileUtf8 -Path $NginxPath -Content $fixedNginx
        & git add $NginxPath
        try { & git commit -m "fix(frontend): enable real API proxy in nginx.conf (auto)" 2>$null } catch { Write-Host "nginx fix commit skipped." }
    } else {
        Write-Host "nginx.conf API proxy already properly configured"
    }
}

# === Attempt frontend host build (if package.json present) ===
$FrontendPkg = Join-Path $FrontendDir "package.json"
if (Test-Path $FrontendPkg) {
    Write-Host "Detected frontend package.json. Attempting host build to surface JS errors..."
    Push-Location $FrontendDir
    Try {
        if (Test-Path (Join-Path $FrontendDir "package-lock.json")) {
            Write-Host "Running npm ci..."
            npm ci --no-audit --no-fund 2>&1 | Tee-Object -FilePath (Join-Path $LogDir "npm_ci.log")
        } else {
            Write-Host "Running npm install..."
            npm install --no-audit --no-fund 2>&1 | Tee-Object -FilePath (Join-Path $LogDir "npm_install.log")
        }
        Write-Host "Running npm run build..."
        npm run build 2>&1 | Tee-Object -FilePath (Join-Path $LogDir "npm_build.log")
    } Catch {
        Write-Host "Frontend build failed or npm not available: $_"
        $_ | Out-File -FilePath (Join-Path $LogDir "npm_build_error.log")
    }
    Pop-Location
} else {
    Write-Host "No frontend/package.json found; skipping host build."
}

# === Docker compose smoke test (if Docker available) ===
Write-Host "Attempting docker compose smoke test (requires Docker running)..."
$dockerCmd = $null
if (Get-Command -Name "docker" -ErrorAction SilentlyContinue) {
    $dockerCmd = "docker"
}
if ($dockerCmd -ne $null) {
    try {
        # prefer modern "docker compose"
        Write-Host "Running docker compose up --build -d"
        & docker compose up --build -d 2>&1 | Tee-Object -FilePath (Join-Path $LogDir "docker_compose_up.log")
        Start-Sleep -Seconds 10

        # check endpoints (your setup uses port 3000 for frontend)
        $frontendHealth = "http://localhost:3000/health"
        try { 
            $response = Invoke-WebRequest -Uri $frontendHealth -Method Get -TimeoutSec 5 -UseBasicParsing
            $response | Out-File (Join-Path $LogDir "frontend_health.txt")
            Write-Host "Frontend health check: SUCCESS"
        } catch { 
            $_ | Out-File (Join-Path $LogDir "frontend_health.txt")
            Write-Host "Frontend health check: FAILED - $_"
        }

        $backendHealth = "http://localhost:8000/api/health"
        try { 
            $response = Invoke-WebRequest -Uri $backendHealth -Method Get -TimeoutSec 5 -UseBasicParsing
            $response | Out-File (Join-Path $LogDir "backend_health.txt")
            Write-Host "Backend health check: SUCCESS"
        } catch { 
            $_ | Out-File (Join-Path $LogDir "backend_health.txt")
            Write-Host "Backend health check: FAILED - $_"
        }

        # docker ps
        & docker ps -a --format "{{.ID}} {{.Names}} {{.Status}}" > (Join-Path $LogDir "docker_ps.txt")
        # gather logs for running containers
        Get-Content (Join-Path $LogDir "docker_ps.txt") | ForEach-Object {
            $parts = $_ -split '\s+', 3
            if ($parts.Length -ge 2) {
                $cname = $parts[1]
                try { 
                    & docker logs --tail 100 $cname > (Join-Path $LogDir "container_log_$cname.txt") 2>&1 
                } catch { 
                    $_ | Out-File (Join-Path $LogDir "container_log_$cname.txt") 
                }
            }
        }

        Write-Host "Stopping containers..."
        & docker compose down 2>&1 | Tee-Object -FilePath (Join-Path $LogDir "docker_compose_down.log")
    } catch {
        Write-Host "Docker compose smoke test failed or docker not configured: $_"
        $_ | Out-File (Join-Path $LogDir "docker_compose_error.log")
    }
} else {
    Write-Host "Docker CLI not found; skipping docker smoke test."
}

# === Create patch file and final commit ===
Try {
    & git add -A
    & git commit -m "chore: auto fixes & scaffolding applied by warp script ($Timestamp)"
} Catch {
    Write-Host "Nothing to commit or commit failed (ok)."
}

$PatchFile = Join-Path $RepoRoot "warp_auto_patch_$Timestamp.patch"
Try {
    & git format-patch -1 --stdout > $PatchFile
    Write-Host "Patch written to: $PatchFile"
} Catch {
    Write-Host "Could not create patch file (maybe no commits); ensure your branch has commits."
}

# === Summary ===
$Summary = @"
Warp automation completed for existing project structure.

PRESERVED (your existing files are better):
- docker-compose.yml (kept your version with volumes & restart policies)
- env.example (extended with AI vars)
- nginx.conf (fixed API proxy from mock to real)
- CI workflow (kept your comprehensive version)
- frontend/.dockerignore (kept your version)
- frontend/public/index.html (kept your React version)

ADDED:
- backend/app/ directory structure
- backend/app/health_stub.py
- backend/app/worker.py  
- backend/app/ai_client.py (DeepSeek->Groq fallback)
- backend/app/confidence.py
- backend/app/jobs.py
- frontend/Dockerfile.prod

Branch created: $PatchBranch
Backup branch: $BackupBranch
Logs directory: $LogDir
Patch file: $PatchFile

Next steps:
1. Review the changes in logs and patch file
2. Implement backend/app/routing.py and backend/app/maps.py as referenced in jobs.py
3. Add missing API keys to .env file
4. Test with: docker compose up --build
"@
$Summary | Out-File -FilePath (Join-Path $LogDir "RESULTS_SUMMARY.txt") -Encoding utf8
Write-Host $Summary
