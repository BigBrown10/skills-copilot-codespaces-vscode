# Setup Guide

This guide will walk you through setting up the B2B Chatbot Platform locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher
- **Python** 3.11 or higher
- **Docker** and **Docker Compose**
- **PostgreSQL** 15 or higher (optional if using Docker)
- **Redis** 7 or higher (optional if using Docker)
- **Git**

## Step 1: Clone the Repository

```bash
git clone https://github.com/BigBrown10/skills-copilot-codespaces-vscode.git
cd skills-copilot-codespaces-vscode
```

## Step 2: Environment Setup

### Get API Keys

1. **Google Gemini API Key**
   - Visit https://makersuite.google.com/app/apikey
   - Create a new API key
   - Copy the key for later use

2. **WhatsApp Business API** (optional)
   - Sign up at https://developers.facebook.com/
   - Create a WhatsApp Business app
   - Get your access token and phone number ID

3. **Telegram Bot** (optional)
   - Message @BotFather on Telegram
   - Create a new bot with `/newbot`
   - Save the bot token

### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/chatbot_platform?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT & Auth
JWT_SECRET=your-super-secret-jwt-key-change-in-production
SESSION_SECRET=your-session-secret-change-in-production

# Google Gemini
GOOGLE_GEMINI_API_KEY=your-google-gemini-api-key-here
GEMINI_MODEL=gemini-pro

# WhatsApp (optional)
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-random-verify-token

# Telegram (optional)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_WEBHOOK_SECRET=your-telegram-webhook-secret

# API Configuration
ADMIN_API_PORT=4000
CONVERSATION_ENGINE_PORT=8000
WEBHOOK_HANDLER_PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Step 3: Quick Start with Docker (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# Start all services
make dev

# Or manually:
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache/queue
- Admin API (NestJS)
- Conversation Engine (FastAPI)
- Webhook Handler (Express)
- Frontend (Next.js)

### Run Database Migrations

```bash
make migrate

# Or manually:
cd backend/admin-api
npx prisma migrate dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Admin API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api/docs
- **Conversation Engine**: http://localhost:8000
- **Conversation Docs**: http://localhost:8000/docs
- **Webhook Handler**: http://localhost:5000

## Step 4: Manual Setup (Without Docker)

If you prefer to run services individually:

### 4.1 Start PostgreSQL and Redis

```bash
# Using Homebrew (macOS)
brew install postgresql@15 redis
brew services start postgresql@15
brew services start redis

# Or using Docker for just database services
docker-compose up -d postgres redis
```

### 4.2 Install Dependencies

```bash
make install

# Or manually:
cd frontend && npm install
cd ../backend/admin-api && npm install
cd ../webhook-handler && npm install
cd ../conversation-engine && pip install -r requirements.txt
```

### 4.3 Setup Database

```bash
cd backend/admin-api
npx prisma generate
npx prisma migrate dev
```

### 4.4 Start Services

Open 4 terminal windows:

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Admin API:**
```bash
cd backend/admin-api
npm run start:dev
```

**Terminal 3 - Conversation Engine:**
```bash
cd backend/conversation-engine
uvicorn main:app --reload --port 8000
```

**Terminal 4 - Webhook Handler:**
```bash
cd backend/webhook-handler
npm run dev
```

## Step 5: Verify Installation

### Test Health Endpoints

```bash
# Admin API
curl http://localhost:4000/health

# Conversation Engine
curl http://localhost:8000/health

# Webhook Handler
curl http://localhost:5000/health
```

### Test Conversation Engine

```bash
curl -X POST http://localhost:8000/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, I need help",
    "user_id": "test-user",
    "conversation_id": "test-conv-1",
    "platform": "whatsapp"
  }'
```

### Access API Documentation

- Swagger UI: http://localhost:4000/api/docs
- FastAPI Docs: http://localhost:8000/docs

## Step 6: Create Test Data

### Register a User

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User"
  }'
```

### Login and Get Token

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` from the response.

### Create a Bot

```bash
curl -X POST http://localhost:4000/bots \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Customer Support Bot",
    "businessId": "YOUR_BUSINESS_ID",
    "platform": "whatsapp",
    "config": {}
  }'
```

## Step 7: Configure Webhooks (Optional)

### WhatsApp Webhook Setup

1. Go to your Facebook App Dashboard
2. Navigate to WhatsApp > Configuration
3. Set Webhook URL: `https://your-domain.com/webhook/whatsapp`
4. Set Verify Token: (same as `WHATSAPP_WEBHOOK_VERIFY_TOKEN` in .env)
5. Subscribe to `messages` events

### Telegram Webhook Setup

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/webhook/telegram",
    "secret_token": "YOUR_TELEGRAM_WEBHOOK_SECRET"
  }'
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find and kill process using port 3000 (example)
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

1. Check PostgreSQL is running: `pg_isready`
2. Verify DATABASE_URL in .env
3. Ensure database exists: `createdb chatbot_platform`

### Redis Connection Error

1. Check Redis is running: `redis-cli ping`
2. Verify REDIS_HOST and REDIS_PORT in .env

### Gemini API Error

1. Verify your API key is correct
2. Check quota/billing at https://console.cloud.google.com/
3. Ensure you're using the correct model name (`gemini-pro`)

### Docker Issues

```bash
# Reset everything
docker-compose down -v
docker-compose up -d --build

# View logs
docker-compose logs -f
```

## Development Tips

### Useful Make Commands

```bash
make help           # Show all available commands
make dev            # Start all services
make logs           # View all logs
make logs-api       # View admin-api logs
make logs-engine    # View conversation-engine logs
make restart        # Restart all services
make clean          # Clean dependencies
make prisma-studio  # Open Prisma Studio
```

### VS Code Extensions

Recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- Python
- Docker

### Database Management

```bash
# Open Prisma Studio (GUI for database)
make prisma-studio

# Create new migration
cd backend/admin-api
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

## Next Steps

1. Explore the dashboard at http://localhost:3000
2. Read the API documentation at http://localhost:4000/api/docs
3. Test the conversation engine at http://localhost:8000/docs
4. Configure your WhatsApp/Telegram webhooks
5. Customize the AI responses in `backend/conversation-engine/`
6. Deploy to production (see DEPLOYMENT.md)

## Getting Help

- Check the main README.md
- Review the code comments
- Open an issue on GitHub
- Join our Discord community

Happy building! 🚀
