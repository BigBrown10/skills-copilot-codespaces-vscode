#!/bin/bash

# Quick Start Script for B2B Chatbot Platform
# This script helps you get started quickly

set -e

echo "🚀 B2B Chatbot Platform - Quick Start"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  Please edit .env and add your API keys before continuing"
    echo ""
    echo "Required keys:"
    echo "  - GOOGLE_GEMINI_API_KEY"
    echo "  - JWT_SECRET"
    echo "  - SESSION_SECRET"
    echo ""
    read -p "Press enter when you've updated .env..."
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "1️⃣  Starting services with Docker Compose..."
docker-compose up -d

echo ""
echo "2️⃣  Waiting for services to be healthy..."
sleep 10

# Check if admin-api is ready
echo "3️⃣  Checking if Admin API is ready..."
until curl -s http://localhost:4000/health > /dev/null 2>&1; do
    echo "   Waiting for Admin API..."
    sleep 2
done
echo "✅ Admin API is ready!"

# Run migrations
echo "4️⃣  Running database migrations..."
docker-compose exec -T admin-api npx prisma migrate deploy || echo "⚠️  Migrations might have already been run"

echo ""
echo "✅ Setup complete! Your services are running:"
echo ""
echo "📱 Frontend:          http://localhost:3000"
echo "🔧 Admin API:         http://localhost:4000"
echo "📚 API Docs:          http://localhost:4000/api/docs"
echo "🤖 Conversation:      http://localhost:8000"
echo "📝 Conversation Docs: http://localhost:8000/docs"
echo "🔔 Webhook Handler:   http://localhost:5000"
echo ""
echo "💡 Useful commands:"
echo "   make logs         - View all logs"
echo "   make logs-api     - View admin-api logs"
echo "   make down         - Stop all services"
echo "   make restart      - Restart all services"
echo ""
echo "📖 Next steps:"
echo "   1. Visit http://localhost:3000 to see the frontend"
echo "   2. Check out SETUP.md for detailed instructions"
echo "   3. Read README.md for feature documentation"
echo ""
echo "Happy building! 🎉"
