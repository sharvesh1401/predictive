#!/bin/bash

# 🚀 EV Routing Simulation - Single Click Deployment Script
# This script automates the deployment process for multiple platforms

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ev-routing-simulation"
REPO_URL="https://github.com/sharvesh1401/ev-routing-simulation.git"
VERCEL_PROJECT_ID=""
NETLIFY_SITE_ID=""

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists node; then
        missing_deps+=("node")
    fi
    
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    if ! command_exists git; then
        missing_deps+=("git")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_status "Please install the missing dependencies and try again."
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Function to build the application
build_app() {
    print_status "Building the application..."
    
    # Install dependencies
    npm ci --only=production
    
    # Run tests
    npm test -- --watchAll=false
    
    # Build the application
    GENERATE_SOURCEMAP=false npm run build
    
    print_success "Application built successfully"
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command_exists vercel; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    vercel --prod --yes
    
    print_success "Deployed to Vercel successfully"
}

# Function to deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if ! command_exists netlify; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    # Deploy to Netlify
    netlify deploy --prod --dir=build
    
    print_success "Deployed to Netlify successfully"
}

# Function to deploy with Docker
deploy_docker() {
    print_status "Deploying with Docker..."
    
    if ! command_exists docker; then
        print_error "Docker not found. Please install Docker first."
        exit 1
    fi
    
    # Build Docker image
    docker build -t $APP_NAME .
    
    # Run container
    docker run -d -p 80:80 --name $APP_NAME-container $APP_NAME
    
    print_success "Deployed with Docker successfully"
    print_status "Application available at http://localhost"
}

# Function to deploy to AWS Amplify
deploy_aws_amplify() {
    print_status "Deploying to AWS Amplify..."
    
    if ! command_exists aws; then
        print_error "AWS CLI not found. Please install AWS CLI first."
        exit 1
    fi
    
    # Create amplify configuration
    cat > amplify.yml << EOF
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
EOF
    
    print_success "AWS Amplify configuration created"
    print_status "Please deploy manually through AWS Amplify Console"
}

# Function to show deployment options
show_menu() {
    echo -e "${BLUE}🚀 EV Routing Simulation - Deployment Options${NC}"
    echo ""
    echo "1. Deploy to Vercel (Recommended)"
    echo "2. Deploy to Netlify"
    echo "3. Deploy with Docker"
    echo "4. Deploy to AWS Amplify"
    echo "5. Build only (no deployment)"
    echo "6. Exit"
    echo ""
    read -p "Choose an option (1-6): " choice
}

# Function to setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        cat > .env << EOF
# Environment Variables
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
REACT_APP_DEEPSEEK_API_KEY=your_deepseek_api_key_here
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
REACT_APP_API_URL=https://ev-routing-backend.vercel.app
GENERATE_SOURCEMAP=false
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_ANALYTICS=false
EOF
        print_success "Environment file created"
    fi
}

# Function to validate deployment
validate_deployment() {
    print_status "Validating deployment..."
    
    # Check if build directory exists
    if [ ! -d "build" ]; then
        print_error "Build directory not found. Please build the application first."
        exit 1
    fi
    
    # Check if index.html exists
    if [ ! -f "build/index.html" ]; then
        print_error "index.html not found in build directory."
        exit 1
    fi
    
    print_success "Deployment validation passed"
}

# Main deployment function
main() {
    echo -e "${GREEN}🚀 Starting EV Routing Simulation Deployment${NC}"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Setup environment
    setup_environment
    
    # Build application
    build_app
    
    # Validate deployment
    validate_deployment
    
    # Show menu and handle choice
    while true; do
        show_menu
        
        case $choice in
            1)
                deploy_vercel
                break
                ;;
            2)
                deploy_netlify
                break
                ;;
            3)
                deploy_docker
                break
                ;;
            4)
                deploy_aws_amplify
                break
                ;;
            5)
                print_success "Build completed successfully"
                break
                ;;
            6)
                print_status "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid option. Please choose 1-6."
                ;;
        esac
    done
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    print_status "Your EV Routing Simulation Tool is now live!"
}

# Run main function
main "$@" 