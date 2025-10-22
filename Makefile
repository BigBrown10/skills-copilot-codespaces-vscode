.PHONY: install dev build migrate clean test

# Install all dependencies
install:
	@echo "📦 Installing dependencies..."
	@cd frontend && npm install
	@cd backend/admin-api && npm install
	@cd backend/webhook-handler && npm install
	@cd backend/conversation-engine && pip install -r requirements.txt
	@echo "✅ All dependencies installed"

# Start development environment
dev:
	@echo "🚀 Starting development environment..."
	docker-compose up -d postgres redis
	@sleep 3
	@echo "📊 Starting services..."
	@make -j4 dev-frontend dev-admin dev-conversation dev-webhook

dev-frontend:
	@cd frontend && npm run dev

dev-admin:
	@cd backend/admin-api && npm run start:dev

dev-conversation:
	@cd backend/conversation-engine && uvicorn main:app --reload --port 8000

dev-webhook:
	@cd backend/webhook-handler && npm run dev

# Build all services
build:
	@echo "🔨 Building all services..."
	@cd frontend && npm run build
	@cd backend/admin-api && npm run build
	@cd backend/webhook-handler && npm run build
	@echo "✅ All services built successfully"

# Run database migrations
migrate:
	@echo "🗄️  Running database migrations..."
	@cd backend/admin-api && npx prisma generate
	@cd backend/admin-api && npx prisma migrate dev
	@echo "✅ Migrations completed"

# Clean all build artifacts and dependencies
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf frontend/node_modules frontend/.next frontend/out
	@rm -rf backend/admin-api/node_modules backend/admin-api/dist
	@rm -rf backend/webhook-handler/node_modules backend/webhook-handler/dist
	@rm -rf backend/conversation-engine/__pycache__ backend/conversation-engine/.venv
	@echo "✅ Cleanup completed"

# Run tests
test:
	@echo "🧪 Running tests..."
	@cd frontend && npm test
	@cd backend/admin-api && npm test
	@cd backend/webhook-handler && npm test
	@cd backend/conversation-engine && pytest
	@echo "✅ All tests passed"

# Docker commands
docker-up:
	@echo "🐳 Starting Docker containers..."
	docker-compose up -d

docker-down:
	@echo "🐳 Stopping Docker containers..."
	docker-compose down

docker-build:
	@echo "🐳 Building Docker images..."
	docker-compose build

docker-logs:
	docker-compose logs -f

# Database commands
db-reset:
	@echo "🗄️  Resetting database..."
	@cd backend/admin-api && npx prisma migrate reset --force
	@echo "✅ Database reset completed"

db-seed:
	@echo "🌱 Seeding database..."
	@cd backend/admin-api && npx prisma db seed
	@echo "✅ Database seeded"

# Help
help:
	@echo "Available commands:"
	@echo "  make install      - Install all dependencies"
	@echo "  make dev          - Start development environment"
	@echo "  make build        - Build all services"
	@echo "  make migrate      - Run database migrations"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make test         - Run all tests"
	@echo "  make docker-up    - Start Docker containers"
	@echo "  make docker-down  - Stop Docker containers"
	@echo "  make docker-build - Build Docker images"
	@echo "  make db-reset     - Reset database"
	@echo "  make db-seed      - Seed database"
