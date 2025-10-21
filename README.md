# B2B Chatbot Platform - WhatsApp & Telegram AI Agents

A comprehensive B2B SaaS platform for businesses to create human-like AI agents on WhatsApp and Telegram for bookings, appointments, and customer support.

## ✨ Features

- 🤖 **Human-like AI conversations** using GPT-4
- 📅 **Smart booking and appointment management**
- 💬 **Multi-channel support** (WhatsApp Business API + Telegram)
- 📊 **Real-time analytics** and conversation logs
- 🎨 **Futuristic admin dashboard** with glassmorphism design
- 🔐 **Multi-tenant architecture** with JWT authentication
- 🚀 **Scalable microservices architecture**
- 🔄 **Context-aware conversations** with Redis caching
- 📝 **Intent classification** and conversation orchestration
- 🎯 **Booking automation** with calendar integration

## 🏗️ Architecture

```
Frontend (Next.js 14) 
    ↓
Admin API (NestJS + PostgreSQL + Prisma)
    ↓
Conversation Engine (FastAPI + LangChain + GPT-4)
    ↓
Webhook Handler (Express + Bull Queue + Redis)
    ↓
WhatsApp Business API / Telegram Bot API
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + **shadcn/ui** for styling
- **Framer Motion** for smooth animations
- **Zustand** for state management
- **NextAuth.js** for authentication

### Backend Services

#### Admin API (NestJS)
- RESTful API with Swagger documentation
- JWT authentication with Passport
- Prisma ORM for database operations
- Multi-module architecture (Auth, Users, Bots, Conversations, Analytics)

#### Conversation Engine (Python/FastAPI)
- LangChain integration with GPT-4
- Intent classification system
- Redis-based context management
- Booking and support services
- Conversation orchestration

#### Webhook Handler (Node.js/Express)
- WhatsApp Business API webhook handling
- Telegram Bot API integration
- Bull queue for async message processing
- Redis for queue management

### Infrastructure
- **PostgreSQL** - Primary database
- **Redis** - Caching & message queue
- **Docker** - Containerization
- **Docker Compose** - Local development
- **Railway/Cloud Platform** - Deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/BigBrown10/skills-copilot-codespaces-vscode.git
cd skills-copilot-codespaces-vscode
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your credentials (OpenAI API key, WhatsApp/Telegram tokens, etc.)
```

3. **Start all services with Docker Compose** (Recommended)
```bash
docker-compose up -d
```

Or use the Makefile:
```bash
make docker-up
```

4. **Run database migrations**
```bash
cd backend/admin-api
npm install
npm run prisma:generate
npm run prisma:migrate:dev
```

5. **Access the applications**
- 🎨 Frontend: http://localhost:3000
- 🔧 Admin API: http://localhost:4000
- 📚 Admin API Docs: http://localhost:4000/api/docs
- 🤖 Conversation Engine: http://localhost:8000
- 📖 Conversation Docs: http://localhost:8000/docs
- 📞 Webhook Handler: http://localhost:5000

## 📁 Project Structure

```
.
├── frontend/                          # Next.js 14 Dashboard
│   ├── app/
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles
│   │   ├── dashboard/
│   │   │   ├── page.tsx             # Main dashboard
│   │   │   ├── layout.tsx           # Dashboard layout
│   │   │   ├── bots/page.tsx        # Bot management
│   │   │   └── analytics/page.tsx   # Analytics page
│   │   └── api/auth/[...nextauth]/  # NextAuth API routes
│   ├── components/
│   │   ├── dashboard/               # Dashboard components
│   │   └── ui/                      # Reusable UI components
│   └── lib/                         # Utilities & API client
│
├── backend/
│   ├── admin-api/                   # NestJS Admin API
│   │   ├── src/
│   │   │   ├── auth/               # Authentication module
│   │   │   ├── users/              # User management
│   │   │   ├── businesses/         # Business management
│   │   │   ├── bots/               # Bot CRUD operations
│   │   │   ├── conversations/      # Conversation management
│   │   │   └── analytics/          # Analytics module
│   │   └── prisma/
│   │       └── schema.prisma       # Database schema
│   │
│   ├── conversation-engine/         # Python/FastAPI Engine
│   │   ├── main.py                 # FastAPI app
│   │   ├── orchestrator.py         # Conversation orchestrator
│   │   ├── intent_classifier.py    # Intent classification
│   │   ├── context_manager.py      # Redis context manager
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic models
│   │   └── services/
│   │       ├── booking_service.py  # Booking logic
│   │       └── support_service.py  # Support logic
│   │
│   └── webhook-handler/             # Node.js Webhook Handler
│       └── src/
│           ├── whatsapp/           # WhatsApp webhooks
│           ├── telegram/           # Telegram webhooks
│           ├── queue/              # Bull queue processor
│           └── middleware/         # Verification middleware
│
├── docker-compose.yml              # Multi-service setup
├── railway.json                    # Railway deployment config
├── Makefile                        # Development commands
└── .env.example                    # Environment template
```

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:3000
```

### Admin API Development
```bash
cd backend/admin-api
npm install
npm run start:dev
# Access API at http://localhost:4000
# View docs at http://localhost:4000/api/docs
```

### Conversation Engine Development
```bash
cd backend/conversation-engine
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# Access at http://localhost:8000
# View docs at http://localhost:8000/docs
```

### Webhook Handler Development
```bash
cd backend/webhook-handler
npm install
npm run dev
# Access at http://localhost:5000
```

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/chatbot_platform"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=chatbot_platform

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT & Auth
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-webhook-verify-token

# Telegram Bot API
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_WEBHOOK_SECRET=your-webhook-secret

# API Ports
ADMIN_API_PORT=4000
CONVERSATION_ENGINE_PORT=8000
WEBHOOK_HANDLER_PORT=5000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🐳 Docker Deployment

Build and run all services:
```bash
docker-compose up --build
```

Stop all services:
```bash
docker-compose down
```

View logs:
```bash
docker-compose logs -f
```

## 🚢 Production Deployment

### Railway (Recommended)
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`

### Manual Deployment
Each service can be deployed independently:
- Frontend: Vercel, Netlify, or any Node.js hosting
- Admin API: Any Node.js hosting (Railway, Render, Fly.io)
- Conversation Engine: Python hosting (Railway, Render, Google Cloud Run)
- Databases: Managed PostgreSQL and Redis services

## 📚 API Documentation

### Admin API Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /bots` - List all bots
- `POST /bots` - Create new bot
- `GET /conversations` - List conversations
- `GET /analytics/dashboard` - Get dashboard stats

### Conversation Engine Endpoints
- `POST /conversation` - Process conversation message
- `POST /booking` - Create booking
- `GET /conversation/{id}/summary` - Get conversation summary

Full API documentation available at:
- Admin API: `http://localhost:4000/api/docs`
- Conversation Engine: `http://localhost:8000/docs`

## 🧪 Testing

Run tests for each service:
```bash
# Frontend
cd frontend && npm test

# Admin API
cd backend/admin-api && npm test

# Webhook Handler
cd backend/webhook-handler && npm test
```

## 🎨 UI Design

The frontend uses a futuristic dark theme with:
- **Primary Colors**: Dark Blue (#0A1628, #1E3A8A)
- **Accent**: White and Blue gradients
- **Effects**: Glassmorphism, smooth animations, gradient shadows
- **Typography**: Inter font family
- **Components**: Based on shadcn/ui with custom styling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 💬 Support

For issues and questions:
- Open a GitHub issue
- Check the documentation
- Review the API docs

---

Built with ❤️ using Next.js, NestJS, FastAPI, and LangChain
