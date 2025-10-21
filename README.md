# B2B Chatbot Platform - WhatsApp & Telegram AI Agents

A comprehensive B2B SaaS platform for businesses to create human-like AI agents on WhatsApp and Telegram for bookings, appointments, and customer support powered by **Google Gemini**.

## Features

- 🤖 Human-like AI conversations using **Google Gemini Pro**
- 📅 Smart booking and appointment management
- 💬 Multi-channel support (WhatsApp Business API + Telegram)
- 📊 Real-time analytics and conversation logs
- 🎨 Futuristic admin dashboard with dark blue theme
- 🔐 Multi-tenant architecture with JWT authentication
- 🚀 Scalable microservices architecture
- ⚡ Redis-based conversation context management
- 🔄 Async message processing with Bull queues

## Architecture

```
Frontend (Next.js) → Admin API (NestJS) ← Conversation Engine (FastAPI + Gemini)
                           ↓                            ↓
                    PostgreSQL + Redis         WhatsApp/Telegram Webhooks
```

### Services

1. **Frontend** (Next.js 14) - Admin dashboard with futuristic UI
2. **Admin API** (NestJS) - REST API for managing bots, users, and analytics
3. **Conversation Engine** (FastAPI) - AI conversation processing with Google Gemini
4. **Webhook Handler** (Express) - WhatsApp and Telegram webhook processing

## Tech Stack

**Frontend:**
- Next.js 14 with App Router
- TypeScript (strict mode)
- Tailwind CSS 3.4 (dark blue theme: #0A1628, #1E3A8A)
- Framer Motion 11 (animations)
- Zustand 4 (state management)
- NextAuth (JWT authentication)
- Recharts (analytics charts)

**Backend:**
- **Admin API**: NestJS 10, Prisma ORM, PostgreSQL, JWT
- **Conversation Engine**: FastAPI, Google Gemini API, LangChain, Redis
- **Webhook Handler**: Express, Bull (message queue), Redis

**Infrastructure:**
- PostgreSQL 15 (primary database)
- Redis 7 (cache + message queue + context storage)
- Docker & Docker Compose
- Railway (deployment platform)

**AI/ML:**
- Google Gemini Pro (conversation generation)
- Intent classification (BOOKING, SUPPORT, INQUIRY)
- Context-aware responses
- Slot filling for bookings

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/BigBrown10/skills-copilot-codespaces-vscode.git
cd skills-copilot-codespaces-vscode
```

2. **Copy environment variables**
```bash
cp .env.example .env
# Edit .env with your credentials
```

Required environment variables:
- `GOOGLE_GEMINI_API_KEY` - Your Google Gemini API key
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `WHATSAPP_ACCESS_TOKEN` - WhatsApp Business API token
- `TELEGRAM_BOT_TOKEN` - Telegram bot token

3. **Start with Docker Compose**
```bash
make dev
# Or: docker-compose up -d
```

4. **Run database migrations**
```bash
make migrate
# Or: cd backend/admin-api && npx prisma migrate dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Admin API: http://localhost:4000
- API Docs: http://localhost:4000/api/docs
- Conversation Engine: http://localhost:8000
- Webhook Handler: http://localhost:5000

## Project Structure

```
├── frontend/                    # Next.js 14 admin dashboard
│   ├── app/                    # App router pages
│   │   ├── layout.tsx         # Root layout with dark theme
│   │   ├── page.tsx           # Landing page
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── layout.tsx    # Dashboard layout with sidebar
│   │   │   ├── page.tsx      # Dashboard home
│   │   │   ├── bots/         # Bot management
│   │   │   └── analytics/    # Analytics & logs
│   │   └── api/auth/         # NextAuth routes
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── button.tsx   # Animated button
│   │   │   ├── card.tsx     # Glassmorphism card
│   │   │   └── input.tsx    # Styled input
│   │   └── dashboard/        # Dashboard components
│   │       ├── sidebar.tsx  # Animated sidebar
│   │       ├── stats-card.tsx # Stat card with count-up
│   │       └── bot-card.tsx  # Bot display card
│   ├── lib/api.ts           # Axios instance with interceptors
│   └── tailwind.config.ts   # Tailwind with dark blue theme
│
├── backend/
│   ├── admin-api/              # NestJS REST API
│   │   ├── prisma/
│   │   │   └── schema.prisma  # Database schema
│   │   └── src/
│   │       ├── auth/          # JWT authentication
│   │       ├── users/         # User management
│   │       ├── businesses/    # Business management
│   │       ├── bots/          # Bot CRUD operations
│   │       ├── conversations/ # Conversation logs
│   │       └── analytics/     # Metrics & statistics
│   │
│   ├── conversation-engine/    # FastAPI + Google Gemini
│   │   ├── main.py           # FastAPI application
│   │   ├── config.py         # Environment configuration
│   │   ├── orchestrator.py   # Conversation orchestration
│   │   ├── intent_classifier.py # Intent classification with Gemini
│   │   ├── context_manager.py   # Redis-based context storage
│   │   ├── services/
│   │   │   ├── booking_service.py # Booking logic
│   │   │   └── support_service.py # Support & FAQ
│   │   ├── models/schemas.py     # Pydantic models
│   │   └── utils/gemini_client.py # Gemini API wrapper with retry
│   │
│   └── webhook-handler/        # Express webhook server
│       └── src/
│           ├── index.ts       # Express app
│           ├── whatsapp/      # WhatsApp webhooks
│           ├── telegram/      # Telegram webhooks
│           ├── queue/         # Bull message queue
│           ├── services/      # Conversation API client
│           └── middleware/    # Webhook verification
│
├── docker-compose.yml          # Multi-service Docker setup
├── railway.json                # Railway deployment config
├── Makefile                    # Development commands
└── .env.example                # Environment variables template
```

## Development

### Using Make Commands

```bash
make install      # Install all dependencies
make dev          # Start all services
make build        # Build Docker images
make test         # Run tests
make migrate      # Run database migrations
make logs         # View all logs
make clean        # Clean dependencies
```

### Individual Services

**Frontend:**
```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```

**Admin API:**
```bash
cd backend/admin-api
npm install
npx prisma generate
npm run start:dev    # http://localhost:4000
```

**Conversation Engine:**
```bash
cd backend/conversation-engine
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Webhook Handler:**
```bash
cd backend/webhook-handler
npm install
npm run dev          # http://localhost:5000
```

## API Documentation

### Admin API
- Swagger UI: http://localhost:4000/api/docs
- Endpoints:
  - `POST /auth/register` - Register user
  - `POST /auth/login` - Login
  - `GET /bots` - List bots
  - `POST /bots` - Create bot
  - `GET /conversations` - List conversations
  - `GET /analytics/stats` - Get statistics

### Conversation Engine
- FastAPI Docs: http://localhost:8000/docs
- Endpoints:
  - `POST /conversation` - Process message
  - `DELETE /conversation/{id}` - Clear context
  - `GET /health` - Health check

### Webhook Handler
- `GET /webhook/whatsapp` - WhatsApp webhook verification
- `POST /webhook/whatsapp` - Receive WhatsApp messages
- `POST /webhook/telegram` - Receive Telegram updates

## Google Gemini Integration

This platform uses **Google Gemini Pro** for AI-powered conversations:

### Features:
- **Intent Classification**: Automatically classifies messages as BOOKING, SUPPORT, or INQUIRY
- **Context-Aware Responses**: Maintains conversation context in Redis
- **Slot Filling**: Extracts entities for bookings (date, time, service)
- **FAQ Matching**: Instant responses for common questions
- **Escalation Detection**: Identifies when human intervention is needed

### Example Usage:
```python
from utils.gemini_client import GeminiClient

client = GeminiClient()
response = await client.generate("What are your business hours?")
```

## Deployment

### Docker Compose (Local)
```bash
docker-compose up -d
```

### Railway (Production)
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Link project: `railway link`
4. Deploy: `railway up`

Configuration is in `railway.json`

### Environment Variables (Production)
Set these in your deployment platform:
- `GOOGLE_GEMINI_API_KEY`
- `DATABASE_URL`
- `REDIS_HOST`, `REDIS_PORT`
- `JWT_SECRET`
- `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`
- `TELEGRAM_BOT_TOKEN`

## Database Schema

**Users** - Platform users
**Businesses** - Customer organizations
**Bots** - Chatbot configurations
**Conversations** - Chat sessions
**Messages** - Individual messages
**Bookings** - Appointment records

See `backend/admin-api/prisma/schema.prisma` for full schema.

## Design System

**Color Palette:**
- Primary Dark: `#0A1628`
- Primary Blue: `#1E3A8A`
- Accent Light: `#3B82F6`
- White: `#FFFFFF`

**Animations:**
- Framer Motion for smooth transitions
- Count-up effects on statistics
- Hover lift effects on cards
- Glassmorphism effects throughout

## Security

- JWT authentication with secure tokens
- Password hashing with bcrypt
- CORS configuration
- Webhook signature verification
- Rate limiting (Redis-based)
- Input validation with class-validator

## Monitoring & Logging

- Structured logging in all services
- Health check endpoints
- Error tracking
- Analytics dashboard with real-time metrics

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open a GitHub issue or contact support@example.com.

## Roadmap

- [ ] Voice message support
- [ ] Multi-language support
- [ ] Advanced analytics with ML insights
- [ ] Integration with calendar services (Google Calendar, Outlook)
- [ ] WhatsApp template message support
- [ ] Custom AI training with business data
- [ ] Mobile app for iOS and Android

---

Built with ❤️ using Next.js, NestJS, FastAPI, and Google Gemini
