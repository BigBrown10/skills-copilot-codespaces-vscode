# Setup Guide

This guide will walk you through setting up the B2B Chatbot Platform on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** and npm
- **Python 3.11+** and pip
- **Docker** and Docker Compose
- **Git**

Optional (if not using Docker):
- **PostgreSQL 15+**
- **Redis 7+**

## Step 1: Clone the Repository

```bash
git clone https://github.com/BigBrown10/skills-copilot-codespaces-vscode.git
cd skills-copilot-codespaces-vscode
```

## Step 2: Set Up Environment Variables

Copy the example environment file and edit it with your credentials:

```bash
cp .env.example .env
```

Edit `.env` and fill in the following required variables:

### Required:
- `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys
- `JWT_SECRET` - Generate a random string (e.g., `openssl rand -base64 32`)

### Optional (for production):
- WhatsApp Business API credentials from Meta
- Telegram Bot Token from @BotFather
- Production database URLs

## Step 3: Choose Your Setup Method

### Option A: Using Docker (Recommended)

This is the easiest way to get started. Docker Compose will set up all services, databases, and dependencies.

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

After starting, wait a few minutes for all services to initialize.

### Option B: Manual Setup

If you prefer not to use Docker:

#### 1. Start PostgreSQL and Redis

```bash
# On macOS with Homebrew
brew install postgresql redis
brew services start postgresql
brew services start redis

# On Ubuntu/Debian
sudo apt-get install postgresql redis-server
sudo systemctl start postgresql redis-server
```

#### 2. Create Database

```bash
createdb chatbot_platform
```

#### 3. Set up Admin API

```bash
cd backend/admin-api
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run start:dev
```

#### 4. Set up Conversation Engine

```bash
cd backend/conversation-engine
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### 5. Set up Webhook Handler

```bash
cd backend/webhook-handler
npm install
npm run dev
```

#### 6. Set up Frontend

```bash
cd frontend
npm install
npm run dev
```

## Step 4: Verify Installation

Once all services are running, verify they're accessible:

1. **Frontend**: Open http://localhost:3000
   - You should see the landing page

2. **Admin API**: Open http://localhost:4000/api/docs
   - You should see the Swagger documentation

3. **Conversation Engine**: Open http://localhost:8000/docs
   - You should see the FastAPI documentation

4. **Webhook Handler**: Open http://localhost:5000/health
   - You should see `{"status":"healthy"}`

## Step 5: Create Your First Bot

### Using the Admin API:

1. Register a user:
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User"
  }'
```

2. Login to get access token:
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

3. Create a business (use the access_token from login):
```bash
curl -X POST http://localhost:4000/businesses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "My Business",
    "industry": "Technology"
  }'
```

4. Create a bot:
```bash
curl -X POST http://localhost:4000/bots \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Support Bot",
    "description": "Customer support assistant",
    "channel": "WHATSAPP",
    "businessId": "YOUR_BUSINESS_ID",
    "status": "ACTIVE",
    "systemPrompt": "You are a helpful customer support assistant."
  }'
```

## Step 6: Test Conversation Engine

Test the conversation engine directly:

```bash
curl -X POST http://localhost:8000/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "test-conversation-1",
    "user_id": "test-user",
    "bot_id": "test-bot",
    "channel": "whatsapp",
    "message": "Hello, I need help booking an appointment"
  }'
```

You should receive an AI-generated response.

## Step 7: Configure WhatsApp/Telegram (Optional)

### WhatsApp Business API:

1. Create a Meta Developer account at https://developers.facebook.com
2. Create an app and enable WhatsApp Business API
3. Get your Phone Number ID and Access Token
4. Update `.env` with:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
5. Set webhook URL in Meta Dashboard to: `https://your-domain.com/webhook/whatsapp`

### Telegram Bot:

1. Message @BotFather on Telegram
2. Create a new bot with `/newbot`
3. Copy the bot token
4. Update `.env` with:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_WEBHOOK_SECRET`
5. Set webhook:
```bash
curl -X POST http://localhost:5000/webhook/telegram/set-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "webhookUrl": "https://your-domain.com/webhook/telegram"
  }'
```

## Troubleshooting

### Services won't start with Docker

1. Check Docker is running: `docker ps`
2. Check logs: `docker-compose logs`
3. Rebuild containers: `docker-compose up --build`

### Database connection errors

1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Run migrations: `cd backend/admin-api && npm run prisma:migrate:dev`

### OpenAI API errors

1. Verify your API key is correct
2. Check you have credits: https://platform.openai.com/usage
3. Ensure the model name is correct (default: gpt-4-turbo-preview)

### Port already in use

If a port is already in use, you can change it in `.env`:
- `ADMIN_API_PORT` (default: 4000)
- `CONVERSATION_ENGINE_PORT` (default: 8000)
- `WEBHOOK_HANDLER_PORT` (default: 5000)

## Next Steps

1. Explore the Admin Dashboard at http://localhost:3000
2. Read the API documentation
3. Customize bot prompts and behavior
4. Set up production deployment
5. Configure webhooks for WhatsApp/Telegram

## Development Tips

### Useful Commands

```bash
# View all service logs
docker-compose logs -f

# Restart a specific service
docker-compose restart admin-api

# Run database migrations
make migrate-dev

# Clean build artifacts
make clean

# Rebuild everything
docker-compose down && docker-compose up --build
```

### Database Management

```bash
# Access Prisma Studio (visual database editor)
cd backend/admin-api
npx prisma studio
# Open http://localhost:5555
```

### Hot Reload

All services support hot reload in development mode:
- Frontend: Changes to `.tsx` files auto-reload
- Admin API: Changes to `.ts` files auto-reload
- Conversation Engine: Changes to `.py` files auto-reload
- Webhook Handler: Changes to `.ts` files auto-reload

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [LangChain Documentation](https://python.langchain.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Telegram Bot API](https://core.telegram.org/bots/api)
