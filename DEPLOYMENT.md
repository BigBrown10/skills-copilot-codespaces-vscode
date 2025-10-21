# Deployment Guide

This guide covers deploying the B2B Chatbot Platform to production.

## Deployment Options

1. **Railway** (Recommended) - Easy deployment with railway.json
2. **Docker** - Deploy anywhere that supports Docker
3. **Kubernetes** - For large-scale deployments
4. **Cloud Platforms** - AWS, GCP, Azure

## Railway Deployment

Railway provides the easiest deployment path with the included `railway.json` configuration.

### Prerequisites

- Railway account (https://railway.app/)
- Railway CLI installed: `npm i -g @railway/cli`

### Steps

1. **Login to Railway**
```bash
railway login
```

2. **Create New Project**
```bash
railway init
```

3. **Set Environment Variables**

In Railway dashboard, add these variables:

```
GOOGLE_GEMINI_API_KEY=your-gemini-key
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
WHATSAPP_ACCESS_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-verify-token
TELEGRAM_BOT_TOKEN=your-bot-token
POSTGRES_PASSWORD=secure-password
REDIS_PASSWORD=secure-password
```

4. **Deploy**
```bash
railway up
```

5. **Run Migrations**
```bash
railway run npx prisma migrate deploy
```

6. **Get URLs**
```bash
railway status
```

Note the URLs for each service and update:
- Frontend: Set `NEXT_PUBLIC_API_URL` to Admin API URL
- Webhook Handler: Set `CONVERSATION_ENGINE_URL`

## Docker Deployment

### Build Images

```bash
# Build all images
docker-compose build

# Or build individually
docker build -t chatbot-frontend ./frontend
docker build -t chatbot-admin-api ./backend/admin-api
docker build -t chatbot-conversation-engine ./backend/conversation-engine
docker build -t chatbot-webhook-handler ./backend/webhook-handler
```

### Push to Registry

```bash
# Tag images
docker tag chatbot-frontend:latest your-registry/chatbot-frontend:latest
docker tag chatbot-admin-api:latest your-registry/chatbot-admin-api:latest
docker tag chatbot-conversation-engine:latest your-registry/chatbot-conversation-engine:latest
docker tag chatbot-webhook-handler:latest your-registry/chatbot-webhook-handler:latest

# Push
docker push your-registry/chatbot-frontend:latest
docker push your-registry/chatbot-admin-api:latest
docker push your-registry/chatbot-conversation-engine:latest
docker push your-registry/chatbot-webhook-handler:latest
```

### Deploy with Docker Compose

```bash
# On production server
docker-compose -f docker-compose.prod.yml up -d
```

## AWS Deployment

### Using ECS (Elastic Container Service)

1. **Create ECR Repositories**
```bash
aws ecr create-repository --repository-name chatbot-frontend
aws ecr create-repository --repository-name chatbot-admin-api
aws ecr create-repository --repository-name chatbot-conversation-engine
aws ecr create-repository --repository-name chatbot-webhook-handler
```

2. **Push Images to ECR**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag chatbot-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/chatbot-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/chatbot-frontend:latest
# Repeat for other services
```

3. **Create ECS Task Definitions**
4. **Create ECS Services**
5. **Setup Application Load Balancer**
6. **Configure Auto Scaling**

### Using RDS and ElastiCache

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier chatbot-db \
  --db-instance-class db.t3.small \
  --engine postgres \
  --master-username postgres \
  --master-user-password your-password \
  --allocated-storage 20

# Create ElastiCache Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id chatbot-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

## Google Cloud Platform

### Using Cloud Run

1. **Enable APIs**
```bash
gcloud services enable run.googleapis.com
gcloud services enable sql-component.googleapis.com
gcloud services enable redis.googleapis.com
```

2. **Create Cloud SQL Instance**
```bash
gcloud sql instances create chatbot-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

3. **Deploy Services**
```bash
# Deploy each service
gcloud run deploy chatbot-frontend \
  --source ./frontend \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy chatbot-admin-api \
  --source ./backend/admin-api \
  --region us-central1

# Repeat for other services
```

## Environment Configuration

### Production Environment Variables

Create a `.env.production` file:

```bash
# Never commit this file!

# Database
DATABASE_URL=postgresql://user:password@db-host:5432/chatbot_platform

# Redis
REDIS_HOST=redis-host
REDIS_PORT=6379
REDIS_PASSWORD=redis-password

# Security
JWT_SECRET=very-secure-random-string-min-32-chars
SESSION_SECRET=another-secure-random-string
NODE_ENV=production

# Google Gemini
GOOGLE_GEMINI_API_KEY=your-production-key
GEMINI_MODEL=gemini-pro

# WhatsApp
WHATSAPP_PHONE_NUMBER_ID=prod-phone-id
WHATSAPP_ACCESS_TOKEN=prod-access-token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=prod-verify-token

# Telegram
TELEGRAM_BOT_TOKEN=prod-bot-token
TELEGRAM_WEBHOOK_SECRET=prod-webhook-secret

# URLs (Update with actual domains)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
CONVERSATION_ENGINE_URL=https://engine.yourdomain.com
CORS_ORIGIN=https://app.yourdomain.com
```

## SSL/TLS Configuration

### Using Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com
```

### Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/chatbot

server {
    listen 80;
    server_name app.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Repeat for API, engine, and webhook handler
```

## Database Migrations

### Run Migrations in Production

```bash
cd backend/admin-api
npx prisma migrate deploy
```

### Backup Before Migration

```bash
# PostgreSQL backup
pg_dump -U postgres -h db-host chatbot_platform > backup.sql

# Restore if needed
psql -U postgres -h db-host chatbot_platform < backup.sql
```

## Monitoring & Logging

### Setup Logging

Use structured logging services:
- **Datadog**
- **New Relic**
- **Sentry** (for error tracking)
- **Logtail**

### Health Checks

Setup monitoring for:
- `/health` endpoints on all services
- Database connectivity
- Redis connectivity
- API response times

### Alerts

Configure alerts for:
- Service downtime
- High error rates
- Database connection issues
- Queue backup
- High memory/CPU usage

## Scaling

### Horizontal Scaling

Scale services independently:

```bash
# Railway
railway scale --replicas 3

# Docker Compose
docker-compose up -d --scale admin-api=3

# Kubernetes
kubectl scale deployment admin-api --replicas=3
```

### Database Scaling

- Enable connection pooling (PgBouncer)
- Setup read replicas
- Consider database sharding for very large scale

### Redis Scaling

- Use Redis Cluster for high availability
- Setup Redis Sentinel for failover
- Consider Redis Enterprise for managed solution

## Security Checklist

- [ ] Use HTTPS/TLS for all services
- [ ] Rotate JWT secrets regularly
- [ ] Enable rate limiting
- [ ] Setup WAF (Web Application Firewall)
- [ ] Use environment variables for secrets
- [ ] Enable CORS with specific origins
- [ ] Implement API key rotation
- [ ] Setup database encryption at rest
- [ ] Enable VPC/private networks
- [ ] Regular security audits
- [ ] Implement backup strategy
- [ ] Setup disaster recovery plan

## Performance Optimization

### Frontend
- Enable Next.js image optimization
- Setup CDN (CloudFlare, Fastly)
- Enable caching headers
- Compress assets

### Backend
- Enable Redis caching
- Setup database indexes
- Use connection pooling
- Implement query optimization
- Enable compression middleware

### Database
```sql
-- Create indexes for common queries
CREATE INDEX idx_conversations_bot_id ON conversations(bot_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_bots_business_id ON bots(business_id);
```

## Troubleshooting Production Issues

### View Logs
```bash
# Railway
railway logs

# Docker
docker-compose logs -f service-name

# Check specific service
docker logs container-name
```

### Database Issues
```bash
# Check connections
SELECT * FROM pg_stat_activity;

# Kill idle connections
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle';
```

### Redis Issues
```bash
# Monitor Redis
redis-cli monitor

# Check memory
redis-cli info memory

# Clear cache if needed
redis-cli flushdb
```

## Rollback Strategy

If deployment fails:

```bash
# Railway
railway rollback

# Docker
docker-compose down
docker-compose up -d --force-recreate

# Database
psql -U postgres -h db-host chatbot_platform < backup.sql
```

## Support

For production issues:
- Check logs first
- Review monitoring dashboards
- Contact support team
- Open incident ticket

---

Remember to test thoroughly in staging before deploying to production!
