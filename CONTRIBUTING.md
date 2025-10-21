# Contributing to B2B Chatbot Platform

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/skills-copilot-codespaces-vscode.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Follow the setup instructions in [SETUP.md](SETUP.md)

## Development Workflow

### 1. Code Style

#### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow existing code style (2-space indentation)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

#### Python
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions and classes
- Keep functions focused and small

### 2. Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(frontend): add bot creation form
fix(webhook): resolve WhatsApp signature validation
docs(readme): update installation instructions
```

### 3. Testing

#### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

#### Backend Tests
```bash
# Admin API
cd backend/admin-api
npm test

# Conversation Engine
cd backend/conversation-engine
pytest

# Webhook Handler
cd backend/webhook-handler
npm test
```

### 4. Pull Requests

1. Update your fork with the latest changes from main
2. Create a pull request with a clear title and description
3. Reference any related issues
4. Ensure all tests pass
5. Wait for code review

**PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## Project Structure

```
frontend/           # Next.js frontend
  ├── app/         # Next.js pages
  ├── components/  # React components
  └── lib/         # Utilities

backend/
  ├── admin-api/           # NestJS API
  │   └── src/
  │       ├── auth/       # Authentication
  │       ├── bots/       # Bot management
  │       └── ...
  │
  ├── conversation-engine/ # FastAPI + LangChain
  │   ├── services/       # Business logic
  │   └── models/         # Data models
  │
  └── webhook-handler/    # Webhook processing
      └── src/
          ├── whatsapp/   # WhatsApp integration
          └── telegram/   # Telegram integration
```

## Adding New Features

### Adding a New Frontend Page

1. Create the page file in `frontend/app/`
2. Add to navigation in `components/dashboard/sidebar.tsx`
3. Create any needed components in `components/`
4. Add API calls in `lib/api.ts`

### Adding a New API Endpoint

1. Create controller in appropriate module
2. Add service methods
3. Update Prisma schema if needed
4. Add Swagger documentation
5. Write tests

### Adding a New Intent

1. Add pattern to `intent_classifier.py`
2. Handle in `orchestrator.py`
3. Create service if needed in `services/`
4. Update documentation

## Code Quality

### Before Committing

```bash
# Frontend
cd frontend
npm run lint
npm run type-check
npm test

# Admin API
cd backend/admin-api
npm run lint
npm test

# Webhook Handler
cd backend/webhook-handler
npm run lint
npm test

# Conversation Engine
cd backend/conversation-engine
python -m pylint *.py
pytest
```

### Code Review Checklist

- [ ] Code is readable and maintainable
- [ ] Functions are small and focused
- [ ] Error handling is comprehensive
- [ ] Types/interfaces are well-defined
- [ ] No hardcoded values (use env vars)
- [ ] Security best practices followed
- [ ] Performance considerations addressed
- [ ] Documentation updated

## Common Tasks

### Adding a Database Migration

```bash
cd backend/admin-api
# 1. Update prisma/schema.prisma
# 2. Generate migration
npm run prisma:migrate:dev --name your-migration-name
# 3. Generate client
npm run prisma:generate
```

### Adding a New Environment Variable

1. Add to `.env.example`
2. Add to `docker-compose.yml`
3. Add to `railway.json`
4. Update SETUP.md documentation
5. Add to config service/file

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update package.json
npm update

# Or update specific package
npm install package@latest

# Python
pip list --outdated
pip install --upgrade package
```

## Debugging

### Backend Services

```bash
# View logs
docker-compose logs -f service-name

# Attach debugger
# Add breakpoint in code
# Run service in debug mode
```

### Frontend

```bash
# Use React DevTools
# Add console.log statements
# Use browser debugger
```

### Database

```bash
# Prisma Studio
cd backend/admin-api
npx prisma studio

# Direct PostgreSQL access
docker exec -it chatbot-postgres psql -U postgres -d chatbot_platform
```

## Documentation

### Code Comments

```typescript
/**
 * Process a conversation message and generate AI response
 * @param request - Conversation request data
 * @returns AI-generated response with intent
 * @throws {Error} If OpenAI API fails
 */
async function processMessage(request: ConversationRequest): Promise<Response>
```

### API Documentation

- Use Swagger decorators in NestJS
- Use FastAPI automatic docs
- Update ARCHITECTURE.md for significant changes

## Security

### Reporting Vulnerabilities

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email: security@example.com (update with actual email)
2. Provide detailed description
3. Include steps to reproduce
4. Wait for response before disclosure

### Security Best Practices

- Never commit secrets or API keys
- Use environment variables
- Validate all inputs
- Sanitize user data
- Use parameterized queries
- Keep dependencies updated
- Follow OWASP guidelines

## Performance

### Frontend Optimization

- Use React.memo for expensive components
- Implement code splitting
- Optimize images
- Use Next.js Image component
- Minimize bundle size

### Backend Optimization

- Use database indexes
- Implement caching (Redis)
- Use async/await properly
- Batch database queries
- Monitor query performance

## Questions?

- Check existing [issues](https://github.com/BigBrown10/skills-copilot-codespaces-vscode/issues)
- Read [SETUP.md](SETUP.md) and [ARCHITECTURE.md](ARCHITECTURE.md)
- Open a discussion for questions
- Join our community (add Discord/Slack link if available)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions help make this project better for everyone. Thank you for taking the time to contribute!
