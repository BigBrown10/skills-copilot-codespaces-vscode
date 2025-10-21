.PHONY: help install dev build test clean docker-up docker-down migrate-dev migrate-prod

help:
	@echo "Available commands:"
	@echo "  make install       - Install all dependencies"
	@echo "  make dev           - Start all services in development mode"
	@echo "  make build         - Build all services"
	@echo "  make test          - Run all tests"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make docker-up     - Start Docker Compose services"
	@echo "  make docker-down   - Stop Docker Compose services"
	@echo "  make migrate-dev   - Run database migrations (development)"
	@echo "  make migrate-prod  - Run database migrations (production)"

install:
	@echo "Installing Frontend dependencies..."
	cd frontend && npm install
	@echo "Installing Admin API dependencies..."
	cd backend/admin-api && npm install
	@echo "Installing Webhook Handler dependencies..."
	cd backend/webhook-handler && npm install
	@echo "Installing Conversation Engine dependencies..."
	cd backend/conversation-engine && pip install -r requirements.txt

dev:
	@echo "Starting all services with Docker Compose..."
	docker-compose up

build:
	@echo "Building Frontend..."
	cd frontend && npm run build
	@echo "Building Admin API..."
	cd backend/admin-api && npm run build
	@echo "Building Webhook Handler..."
	cd backend/webhook-handler && npm run build

test:
	@echo "Running Frontend tests..."
	cd frontend && npm test
	@echo "Running Admin API tests..."
	cd backend/admin-api && npm test
	@echo "Running Webhook Handler tests..."
	cd backend/webhook-handler && npm test

clean:
	@echo "Cleaning build artifacts..."
	rm -rf frontend/.next frontend/out frontend/node_modules
	rm -rf backend/admin-api/dist backend/admin-api/node_modules
	rm -rf backend/webhook-handler/dist backend/webhook-handler/node_modules
	rm -rf backend/conversation-engine/__pycache__ backend/conversation-engine/*.pyc

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

migrate-dev:
	cd backend/admin-api && npm run prisma:migrate:dev

migrate-prod:
	cd backend/admin-api && npm run prisma:migrate:deploy
