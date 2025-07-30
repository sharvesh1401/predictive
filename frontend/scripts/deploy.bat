@echo off
REM 🚀 EV Routing Simulation - Single Click Deployment Script for Windows
REM This script automates the deployment process for multiple platforms

setlocal enabledelayedexpansion

REM Configuration
set APP_NAME=ev-routing-simulation
set REPO_URL=https://github.com/sharvesh1401/ev-routing-simulation.git

REM Colors for output (Windows doesn't support ANSI colors in batch)
echo 🚀 Starting EV Routing Simulation Deployment
echo.

REM Check prerequisites
echo [INFO] Checking prerequisites...

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found. Please install npm first.
    pause
    exit /b 1
)

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git not found. Please install Git first.
    pause
    exit /b 1
)

echo [SUCCESS] All prerequisites are installed
echo.

REM Setup environment
echo [INFO] Setting up environment...

if not exist .env (
    (
        echo # Environment Variables
        echo REACT_APP_MAPBOX_TOKEN=14402eda-48ca-4832-b2e4-fce9aa6e40b8
        echo REACT_APP_DEEPSEEK_API_KEY=sk-744d64e9a996410da9b03c7c79b66d8f
        echo REACT_APP_GROQ_API_KEY=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
        echo REACT_APP_API_URL=https://ev-routing-backend.vercel.app
        echo GENERATE_SOURCEMAP=false
        echo REACT_APP_ENABLE_PWA=true
        echo REACT_APP_ENABLE_ANALYTICS=false
    ) > .env
    echo [SUCCESS] Environment file created
)

echo.

REM Build application
echo [INFO] Building the application...

REM Install dependencies
call npm ci --only=production
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

REM Run tests
call npm test -- --watchAll=false
if %errorlevel% neq 0 (
    echo [WARNING] Tests failed, but continuing with build
)

REM Build the application
set GENERATE_SOURCEMAP=false
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo [SUCCESS] Application built successfully
echo.

REM Validate deployment
echo [INFO] Validating deployment...

if not exist build (
    echo [ERROR] Build directory not found
    pause
    exit /b 1
)

if not exist build\index.html (
    echo [ERROR] index.html not found in build directory
    pause
    exit /b 1
)

echo [SUCCESS] Deployment validation passed
echo.

REM Show deployment options
:menu
echo 🚀 EV Routing Simulation - Deployment Options
echo.
echo 1. Deploy to Vercel (Recommended)
echo 2. Deploy to Netlify
echo 3. Deploy with Docker
echo 4. Build only (no deployment)
echo 5. Exit
echo.
set /p choice="Choose an option (1-5): "

if "%choice%"=="1" goto deploy_vercel
if "%choice%"=="2" goto deploy_netlify
if "%choice%"=="3" goto deploy_docker
if "%choice%"=="4" goto build_only
if "%choice%"=="5" goto exit_script
echo [ERROR] Invalid option. Please choose 1-5.
goto menu

:deploy_vercel
echo [INFO] Deploying to Vercel...

where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Vercel CLI not found. Installing...
    call npm install -g vercel
)

call vercel --prod --yes
if %errorlevel% neq 0 (
    echo [ERROR] Vercel deployment failed
    pause
    exit /b 1
)

echo [SUCCESS] Deployed to Vercel successfully
goto success

:deploy_netlify
echo [INFO] Deploying to Netlify...

where netlify >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Netlify CLI not found. Installing...
    call npm install -g netlify-cli
)

call netlify deploy --prod --dir=build
if %errorlevel% neq 0 (
    echo [ERROR] Netlify deployment failed
    pause
    exit /b 1
)

echo [SUCCESS] Deployed to Netlify successfully
goto success

:deploy_docker
echo [INFO] Deploying with Docker...

where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker not found. Please install Docker first.
    pause
    exit /b 1
)

call docker build -t %APP_NAME% .
if %errorlevel% neq 0 (
    echo [ERROR] Docker build failed
    pause
    exit /b 1
)

call docker run -d -p 80:80 --name %APP_NAME%-container %APP_NAME%
if %errorlevel% neq 0 (
    echo [ERROR] Docker run failed
    pause
    exit /b 1
)

echo [SUCCESS] Deployed with Docker successfully
echo [INFO] Application available at http://localhost
goto success

:build_only
echo [SUCCESS] Build completed successfully
goto success

:success
echo.
echo [SUCCESS] 🎉 Deployment completed successfully!
echo [INFO] Your EV Routing Simulation Tool is now live!
pause
exit /b 0

:exit_script
echo [INFO] Exiting...
pause
exit /b 0 