# Contributing to B2B Chatbot Platform

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Give constructive feedback
- Focus on the issue, not the person

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/skills-copilot-codespaces-vscode.git`
3. Create a branch: `git checkout -b feature/my-feature`
4. Follow the setup guide in SETUP.md

## Development Workflow

### 1. Create an Issue

Before working on a feature or bug fix:
- Check if an issue already exists
- Create a new issue describing the feature/bug
- Wait for approval if it's a significant change

### 2. Write Code

Follow these guidelines:

**TypeScript/JavaScript:**
- Use TypeScript strict mode
- Follow ESLint rules
- Use meaningful variable names
- Add JSDoc comments for complex functions

**Python:**
- Follow PEP 8 style guide
- Use type hints
- Add docstrings
- Keep functions focused and small

**React/Next.js:**
- Use functional components with hooks
- Keep components small and reusable
- Use TypeScript interfaces for props
- Follow the existing file structure

**API Design:**
- RESTful conventions
- Proper HTTP status codes
- Consistent error responses
- API versioning if needed

### 3. Testing

Add tests for new features:

```bash
# Frontend
cd frontend
npm test

# Admin API
cd backend/admin-api
npm test

# Conversation Engine
cd backend/conversation-engine
pytest
```

### 4. Commit Messages

Use conventional commits:

```
feat: Add booking confirmation email
fix: Resolve WhatsApp webhook timeout
docs: Update API documentation
refactor: Simplify intent classifier
test: Add tests for booking service
chore: Update dependencies
```

### 5. Pull Request

1. Push to your fork: `git push origin feature/my-feature`
2. Create a pull request
3. Fill out the PR template
4. Link related issues
5. Wait for review

## Project Structure

```
frontend/          - Next.js application
backend/
  admin-api/      - NestJS REST API
  conversation-engine/  - FastAPI AI engine
  webhook-handler/      - Express webhooks
```

## Coding Standards

### TypeScript

```typescript
// Good
interface UserProps {
  id: string
  name: string
  email: string
}

async function createUser(props: UserProps): Promise<User> {
  const user = await prisma.user.create({ data: props })
  return user
}

// Bad
function createUser(props: any) {
  return prisma.user.create({ data: props })
}
```

### Python

```python
# Good
from typing import Optional

async def classify_intent(message: str, context: Optional[Dict] = None) -> Intent:
    """
    Classify the intent of a user message.
    
    Args:
        message: The user's message
        context: Optional conversation context
        
    Returns:
        Intent object with type and confidence
    """
    # Implementation
    pass

# Bad
async def classify_intent(message, context=None):
    # No docstring, no type hints
    pass
```

### React Components

```tsx
// Good
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export default function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  )
}

// Bad
export default function Button({ children, variant, onClick }: any) {
  return <button onClick={onClick}>{children}</button>
}
```

## Adding New Features

### New Frontend Page

1. Create page in `frontend/app/`
2. Add to navigation in `components/dashboard/sidebar.tsx`
3. Create necessary components in `components/`
4. Add API calls in `lib/api.ts`

### New API Endpoint

1. Create controller in appropriate module
2. Add service method
3. Update module imports
4. Add Swagger documentation
5. Add validation DTOs

### New AI Feature

1. Update `orchestrator.py`
2. Add service in `services/`
3. Update schemas if needed
4. Add to Gemini prompts
5. Test with various inputs

## Testing Guidelines

### Unit Tests

Focus on business logic:

```typescript
// admin-api
describe('AuthService', () => {
  it('should hash password correctly', async () => {
    const password = 'test123'
    const hashed = await authService.hashPassword(password)
    expect(hashed).not.toBe(password)
  })
})
```

### Integration Tests

Test API endpoints:

```typescript
describe('POST /auth/login', () => {
  it('should return token for valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
    
    expect(response.status).toBe(200)
    expect(response.body.accessToken).toBeDefined()
  })
})
```

### E2E Tests

Test user flows:

```typescript
// frontend
describe('Dashboard flow', () => {
  it('should allow user to create a bot', async () => {
    await page.goto('/dashboard/bots')
    await page.click('button:has-text("Create Bot")')
    await page.fill('input[name="name"]', 'Test Bot')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Test Bot')).toBeVisible()
  })
})
```

## Documentation

Update documentation when:
- Adding new features
- Changing APIs
- Modifying environment variables
- Updating dependencies

Files to update:
- README.md - Overview and features
- SETUP.md - Setup instructions
- DEPLOYMENT.md - Deployment steps
- Code comments - Inline documentation

## Review Process

### For Reviewers

- Check code quality
- Verify tests pass
- Test locally if possible
- Provide constructive feedback
- Approve or request changes

### For Contributors

- Address review comments
- Update PR description if needed
- Keep PR focused and small
- Be responsive to feedback

## Release Process

1. Update version in package.json files
2. Update CHANGELOG.md
3. Create release branch
4. Test thoroughly
5. Merge to main
6. Create GitHub release
7. Deploy to production

## Common Issues

### Merge Conflicts

```bash
git fetch upstream
git rebase upstream/main
# Resolve conflicts
git rebase --continue
git push --force-with-lease
```

### Failed Tests

```bash
# Run specific test
npm test -- --testNamePattern="test name"

# Run in watch mode
npm test -- --watch

# Check coverage
npm test -- --coverage
```

### Linting Errors

```bash
# Auto-fix
npm run lint -- --fix

# Check without fixing
npm run lint
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## Questions?

- Open a discussion on GitHub
- Ask in issues
- Contact maintainers

Thank you for contributing! 🎉
