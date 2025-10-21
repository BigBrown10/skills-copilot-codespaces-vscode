# Architecture Documentation

## System Overview

The B2B Chatbot Platform is built using a microservices architecture with the following main components:

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interfaces                          │
├─────────────────────────────────────────────────────────────────┤
│  WhatsApp Business  │  Telegram Bot  │  Web Dashboard (Next.js) │
└─────────┬───────────┴────────┬───────┴──────────────┬──────────┘
          │                     │                      │
          ▼                     ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Webhook Handler (Node.js/Express)          │
│  • WhatsApp webhook processing                                  │
│  • Telegram webhook processing                                  │
│  • Message queue with Bull/Redis                                │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Conversation Engine (Python/FastAPI)               │
│  • LangChain orchestration                                      │
│  • GPT-4 integration                                            │
│  • Intent classification                                        │
│  • Context management (Redis)                                   │
│  • Booking & support services                                   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Admin API (NestJS)                            │
│  • User authentication (JWT)                                    │
│  • Bot management                                               │
│  • Business management                                          │
│  • Conversation logging                                         │
│  • Analytics & reporting                                        │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                                   │
│  PostgreSQL (Prisma)  │  Redis (Cache/Queue)                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend (Next.js 14)

**Technology Stack:**
- Next.js 14 with App Router
- React Server Components
- TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion for animations

**Key Features:**
- Server-side rendering for SEO
- Dynamic routing for dashboard pages
- Client-side state management with Zustand
- Authentication with NextAuth.js
- Real-time updates (future: WebSockets)

**Pages:**
- `/` - Landing page
- `/dashboard` - Main dashboard with stats
- `/dashboard/bots` - Bot management
- `/dashboard/analytics` - Analytics & reporting
- `/dashboard/conversations` - Conversation history

### 2. Admin API (NestJS)

**Technology Stack:**
- NestJS framework
- Prisma ORM
- PostgreSQL database
- JWT authentication
- Swagger/OpenAPI documentation

**Modules:**

#### Auth Module
- User registration and login
- JWT token generation and validation
- Password hashing with bcrypt
- Protected routes with guards

#### Users Module
- User CRUD operations
- Profile management
- Role-based access control

#### Businesses Module
- Multi-tenant support
- Business profile management
- Subscription plans

#### Bots Module
- Bot creation and configuration
- Channel assignment (WhatsApp/Telegram)
- Status management (active/inactive/paused)
- System prompt customization

#### Conversations Module
- Conversation history
- Message logging
- Context retrieval
- Booking records

#### Analytics Module
- Dashboard statistics
- Bot performance metrics
- Conversation trends
- User engagement analytics

**Database Schema:**

```prisma
User → Business → Bot → Conversation → Message
                               ↓
                            Booking
```

### 3. Conversation Engine (FastAPI + LangChain)

**Technology Stack:**
- FastAPI framework
- LangChain for LLM orchestration
- OpenAI GPT-4
- Redis for context management
- Pydantic for validation

**Components:**

#### Orchestrator
- Manages conversation flow
- Integrates with LangChain
- Handles system prompts
- Generates contextual responses

#### Intent Classifier
- Pattern-based classification
- Categories: booking, support, information, greeting, goodbye
- Confidence scoring
- Information extraction

#### Context Manager
- Redis-based storage
- Conversation history (last 10 messages)
- User data caching
- Session management (1-hour TTL)

#### Booking Service
- Availability checking
- Appointment scheduling
- Calendar integration (future)
- Booking confirmation

#### Support Service
- Knowledge base search
- FAQ handling
- Ticket creation
- Human escalation

**API Endpoints:**
- `POST /conversation` - Process messages
- `POST /booking` - Create bookings
- `GET /conversation/{id}/summary` - Summarize conversations
- `DELETE /conversation/{id}/context` - Clear context

### 4. Webhook Handler (Node.js/Express)

**Technology Stack:**
- Express.js
- Bull queue for async processing
- Redis for queue management
- Axios for HTTP requests

**Components:**

#### WhatsApp Webhook
- Webhook verification (GET)
- Message reception (POST)
- Signature validation
- Message formatting

#### Telegram Webhook
- Message handling
- Callback query processing
- Inline keyboard support
- File handling

#### Message Processor
- Bull queue for async processing
- Retry logic (3 attempts)
- Exponential backoff
- Error handling

#### Message Senders
- WhatsApp message sending
- Template messages
- Telegram message sending
- Rich media support

**Flow:**
1. Webhook receives message
2. Message added to Bull queue
3. Processor picks up message
4. Sends to Conversation Engine
5. Response sent back to user

## Data Flow

### Message Processing Flow

```
1. User sends message via WhatsApp/Telegram
        ↓
2. Meta/Telegram forwards to Webhook Handler
        ↓
3. Webhook Handler validates and queues message
        ↓
4. Queue processor picks up message
        ↓
5. Sends to Conversation Engine with context
        ↓
6. Conversation Engine:
   - Retrieves context from Redis
   - Classifies intent
   - Builds prompt with history
   - Calls GPT-4 via LangChain
   - Processes response (booking/support)
   - Saves context to Redis
        ↓
7. Response sent back to Webhook Handler
        ↓
8. Webhook Handler sends to user via API
        ↓
9. User receives response
```

### Dashboard Flow

```
1. User opens dashboard
        ↓
2. Next.js renders page with SSR
        ↓
3. Client fetches data from Admin API
        ↓
4. Admin API queries PostgreSQL via Prisma
        ↓
5. Data returned and rendered with animations
        ↓
6. Real-time updates (WebSocket - future)
```

## Scalability Considerations

### Horizontal Scaling
- All services are stateless (except Redis)
- Can deploy multiple instances behind load balancer
- Redis cluster for high availability
- PostgreSQL read replicas for read-heavy workloads

### Performance Optimization
- Redis caching for frequent queries
- Bull queue for async processing
- Database indexing on frequently queried fields
- CDN for static assets (frontend)

### Monitoring & Logging
- Structured logging in all services
- Health check endpoints
- Metrics collection (future: Prometheus)
- Error tracking (future: Sentry)

## Security

### Authentication & Authorization
- JWT tokens with expiration
- Bcrypt password hashing
- API key validation for webhooks
- Role-based access control

### Data Protection
- HTTPS/TLS for all communications
- Environment variable secrets
- Database connection encryption
- Input validation and sanitization

### API Security
- Rate limiting (future)
- CORS configuration
- Request signing for webhooks
- SQL injection prevention (Prisma)

## Deployment Architecture

### Development
```
Docker Compose
├── PostgreSQL container
├── Redis container
├── Admin API container
├── Conversation Engine container
├── Webhook Handler container
└── Frontend container
```

### Production (Railway/Cloud)
```
Load Balancer
├── Frontend (Vercel/Railway)
├── Admin API (Railway/Cloud Run)
├── Conversation Engine (Railway/Cloud Run)
└── Webhook Handler (Railway/Cloud Run)

Managed Services
├── PostgreSQL (Railway/AWS RDS)
└── Redis (Railway/AWS ElastiCache)
```

## Future Enhancements

1. **Real-time Features**
   - WebSocket support for live dashboard updates
   - Real-time conversation monitoring

2. **Advanced Analytics**
   - Custom reports and dashboards
   - Sentiment analysis
   - Conversation insights

3. **Integrations**
   - Google Calendar integration
   - Email notifications (SendGrid)
   - CRM integrations (Salesforce, HubSpot)
   - Payment processing

4. **AI Enhancements**
   - Voice message support
   - Image recognition
   - Multi-language support
   - Custom AI training per business

5. **DevOps**
   - Kubernetes deployment
   - CI/CD pipelines
   - Automated testing
   - Performance monitoring

## Technology Decisions

### Why Next.js 14?
- Server components for better performance
- Built-in API routes
- Excellent developer experience
- Great for SEO

### Why NestJS?
- TypeScript-first
- Modular architecture
- Built-in Swagger support
- Similar to Angular (familiar patterns)

### Why FastAPI?
- Async support for high performance
- Automatic API documentation
- Easy integration with Python AI libraries
- Type checking with Pydantic

### Why LangChain?
- Abstracts LLM complexity
- Built-in memory management
- Tool integration
- Production-ready

### Why Redis?
- Fast in-memory storage
- Queue management with Bull
- Pub/sub for future real-time features
- Session management

### Why Prisma?
- Type-safe database access
- Automatic migrations
- Great developer experience
- Multi-database support
