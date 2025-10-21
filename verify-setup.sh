#!/bin/bash

echo "🔍 Verifying B2B Chatbot Platform Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if services are running
check_service() {
    SERVICE_NAME=$1
    URL=$2
    
    echo -n "Checking $SERVICE_NAME... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "200"; then
        echo -e "${GREEN}✓ Running${NC}"
        return 0
    else
        echo -e "${RED}✗ Not accessible${NC}"
        return 1
    fi
}

# Check Docker containers
echo "📦 Docker Containers:"
if command -v docker &> /dev/null; then
    docker ps --format "table {{.Names}}\t{{.Status}}" | grep chatbot
    echo ""
else
    echo -e "${YELLOW}Docker not found. Skipping container check.${NC}"
    echo ""
fi

# Check services
echo "🌐 Service Health Checks:"
check_service "Frontend" "http://localhost:3000"
check_service "Admin API" "http://localhost:4000/health"
check_service "Conversation Engine" "http://localhost:8000/health"
check_service "Webhook Handler" "http://localhost:5000/health"

echo ""
echo "📚 Documentation URLs:"
echo "  - Admin API Docs: http://localhost:4000/api/docs"
echo "  - Conversation Engine Docs: http://localhost:8000/docs"
echo ""

# Check environment file
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    
    # Check for required variables
    echo ""
    echo "🔑 Environment Variables:"
    
    check_env_var() {
        VAR_NAME=$1
        if grep -q "^$VAR_NAME=" .env && ! grep -q "^$VAR_NAME=$" .env; then
            echo -e "${GREEN}✓${NC} $VAR_NAME is set"
        else
            echo -e "${RED}✗${NC} $VAR_NAME is not set"
        fi
    }
    
    check_env_var "DATABASE_URL"
    check_env_var "JWT_SECRET"
    check_env_var "OPENAI_API_KEY"
else
    echo -e "${RED}✗${NC} .env file not found. Copy .env.example to .env"
fi

echo ""
echo "✨ Setup verification complete!"
echo ""
echo "Next steps:"
echo "  1. Visit http://localhost:3000 to see the frontend"
echo "  2. Check API docs at http://localhost:4000/api/docs"
echo "  3. Read SETUP.md for detailed configuration"
