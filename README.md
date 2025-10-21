# B2B Chatbot Platform - WhatsApp & Telegram AI Agents

A comprehensive B2B SaaS platform for businesses to create human-like AI agents on WhatsApp and Telegram for bookings, appointments, and customer support.

## Features

- 🤖 Human-like AI conversations using GPT-4
- 📅 Smart booking and appointment management
- 💬 Multi-channel support (WhatsApp Business API + Telegram)
- 📊 Real-time analytics and conversation logs
- 🎨 Futuristic admin dashboard
- 🔐 Multi-tenant architecture with authentication
- 🚀 Scalable microservices architecture

## Architecture

```
Frontend (Next.js) → API Gateway → Admin API (NestJS)
                                  ↓
                            Conversation Engine (Python/FastAPI)
                                  ↓
                            WhatsApp/Telegram Webhooks
                                  ↓
                            PostgreSQL + Redis + Vector DB
```

## Tech Stack

**Frontend:**
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- Zustand (state management)

**Backend:**
- NestJS (Admin API)
- FastAPI + LangChain (Conversation Engine)
- Node.js + Express (Webhook Handler)
- PostgreSQL (Primary DB)
- Redis (Cache + Queue)
- Prisma ORM

**Integrations:**
- WhatsApp Business API (Meta Cloud API)
- Telegram Bot API
- OpenAI GPT-4
- Google Calendar API

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

1. Clone the repository
```bash
git clone https://github.com/BigBrown10/skills-copilot-codespaces-vscode.git
cd skills-copilot-codespaces-vscode
```

2. Copy environment variables
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Start with Docker Compose
```bash
docker-compose up -d
```

4. Run database migrations
```bash
cd backend/admin-api
npm run prisma:migrate
```

5. Access the application
- Frontend: http://localhost:3000
- Admin API: http://localhost:4000
- Conversation Engine: http://localhost:8000
- Webhook Handler: http://localhost:5000

## Project Structure

```
├── frontend/                 # Next.js admin dashboard
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   └── lib/                 # Utilities
├── backend/
│   ├── admin-api/          # NestJS API
│   ├── conversation-engine/ # Python/FastAPI + LangChain
│   └── webhook-handler/    # WhatsApp/Telegram webhooks
├── docker-compose.yml       # Development environment
└── README.md

```

## Environment Variables

See `.env.example` for all required variables:
- WhatsApp Business API credentials
- Telegram Bot Token
- OpenAI API Key
- Database credentials
- JWT secrets

## Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Admin API
```bash
cd backend/admin-api
npm install
npm run start:dev
```

### Conversation Engine
```bash
cd backend/conversation-engine
pip install -r requirements.txt
uvicorn main:app --reload
```

## Deployment

### Production with Kubernetes
```bash
kubectl apply -f k8s/
```

### Or deploy to cloud platforms
- AWS (ECS/EKS)
- GCP (Cloud Run/GKE)
- Azure (AKS)

## API Documentation

- Admin API: http://localhost:4000/api/docs
- Conversation Engine: http://localhost:8000/docs

## License

MIT License

## Support

For issues and questions, please open a GitHub issue.
