@echo off
REM Smoke test script for EV Routing Simulation frontend
REM This script tests if the frontend container is healthy and responding

echo Running smoke tests for EV Routing frontend...

REM Check if Docker is running
docker info > nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo Error: Docker is not running or not installed
  exit /b 1
)

REM Check if the frontend container is running
docker ps | findstr "ev-routing-frontend" > nul
if %ERRORLEVEL% neq 0 (
  echo Frontend container is not running. Starting with docker-compose...
  docker-compose up -d
  
  REM Wait for container to start
  echo Waiting for container to start and become healthy...
  timeout /t 30 /nobreak > nul
)

REM Get the container port mapping
FOR /F "tokens=*" %%i IN ('docker ps ^| findstr "ev-routing-frontend" ^| findstr "0.0.0.0:[0-9]*->80/tcp"') DO SET CONTAINER_INFO=%%i

REM Extract port from container info
FOR /F "tokens=1 delims:->" %%a IN ("%CONTAINER_INFO%") DO (
  FOR /F "tokens=2 delims=:" %%b IN ("%%a") DO SET PORT=%%b
)

if "%PORT%"=="" (
  echo Error: Could not determine frontend container port
  exit /b 1
)

echo Testing health endpoint on port %PORT%...

REM Test health endpoint
curl -s -o nul -w "%%{http_code}" http://localhost:%PORT%/health > temp.txt
set /p HEALTH_STATUS=<temp.txt
del temp.txt

if "%HEALTH_STATUS%"=="200" (
  echo ✅ Health endpoint check passed
) else (
  echo ❌ Health endpoint check failed with status %HEALTH_STATUS%
  exit /b 1
)

REM Test main page
echo Testing main page...
curl -s -o nul -w "%%{http_code}" http://localhost:%PORT%/ > temp.txt
set /p MAIN_STATUS=<temp.txt
del temp.txt

if "%MAIN_STATUS%"=="200" (
  echo ✅ Main page check passed
) else (
  echo ❌ Main page check failed with status %MAIN_STATUS%
  exit /b 1
)

echo All smoke tests passed! Frontend is healthy and responding.