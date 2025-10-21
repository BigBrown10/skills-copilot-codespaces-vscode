.PHONY: help install dev build test clean migrate seed down logs

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing admin-api dependencies..."
	cd backend/admin-api && npm install
	@echo "Installing webhook-handler dependencies..."
	cd backend/webhook-handler && npm install
	@echo "Installing conversation-engine dependencies..."
	cd backend/conversation-engine && pip install -r requirements.txt
	@echo "✓ All dependencies installed"

dev: ## Start all services in development mode
	docker-compose up

dev-detach: ## Start all services in background
	docker-compose up -d

build: ## Build all Docker images
	docker-compose build

test: ## Run tests for all services
	@echo "Running frontend tests..."
	cd frontend && npm test
	@echo "Running admin-api tests..."
	cd backend/admin-api && npm test
	@echo "Running conversation-engine tests..."
	cd backend/conversation-engine && pytest
	@echo "✓ All tests completed"

migrate: ## Run database migrations
	@echo "Running Prisma migrations..."
	cd backend/admin-api && npx prisma migrate dev
	@echo "✓ Migrations completed"

migrate-prod: ## Run database migrations for production
	cd backend/admin-api && npx prisma migrate deploy

seed: ## Seed database with sample data
	cd backend/admin-api && npx prisma db seed
	@echo "✓ Database seeded"

prisma-studio: ## Open Prisma Studio
	cd backend/admin-api && npx prisma studio

clean: ## Clean all dependencies and build artifacts
	@echo "Cleaning..."
	rm -rf frontend/node_modules frontend/.next
	rm -rf backend/admin-api/node_modules backend/admin-api/dist
	rm -rf backend/webhook-handler/node_modules backend/webhook-handler/dist
	rm -rf backend/conversation-engine/__pycache__ backend/conversation-engine/.pytest_cache
	@echo "✓ Cleaned"

down: ## Stop all services
	docker-compose down

down-volumes: ## Stop all services and remove volumes
	docker-compose down -v

logs: ## View logs from all services
	docker-compose logs -f

logs-api: ## View admin-api logs
	docker-compose logs -f admin-api

logs-engine: ## View conversation-engine logs
	docker-compose logs -f conversation-engine

logs-webhook: ## View webhook-handler logs
	docker-compose logs -f webhook-handler

logs-frontend: ## View frontend logs
	docker-compose logs -f frontend

restart: ## Restart all services
	docker-compose restart

restart-api: ## Restart admin-api
	docker-compose restart admin-api

restart-engine: ## Restart conversation-engine
	docker-compose restart conversation-engine

restart-webhook: ## Restart webhook-handler
	docker-compose restart webhook-handler

restart-frontend: ## Restart frontend
	docker-compose restart frontend

shell-api: ## Open shell in admin-api container
	docker-compose exec admin-api sh

shell-engine: ## Open shell in conversation-engine container
	docker-compose exec conversation-engine sh

shell-webhook: ## Open shell in webhook-handler container
	docker-compose exec webhook-handler sh

shell-db: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U postgres -d chatbot_platform

shell-redis: ## Open Redis CLI
	docker-compose exec redis redis-cli

format: ## Format code
	@echo "Formatting frontend..."
	cd frontend && npm run format || echo "No format script"
	@echo "Formatting backend..."
	cd backend/admin-api && npm run format || echo "No format script"
	cd backend/webhook-handler && npm run format || echo "No format script"
	cd backend/conversation-engine && black . || echo "Black not installed"

lint: ## Lint all code
	@echo "Linting frontend..."
	cd frontend && npm run lint || echo "No lint script"
	@echo "Linting admin-api..."
	cd backend/admin-api && npm run lint || echo "No lint script"
	@echo "Linting webhook-handler..."
	cd backend/webhook-handler && npm run lint || echo "No lint script"
