# Veo Prompt Builder

Modern full-stack web application for creating and managing video prompts for Google Veo 3.1.

## Features

- Tab-based wizard interface with zero scrolling
- Real-time validation with instant feedback
- Pre-built templates for common scenarios
- Glassmorphism UI with smooth animations
- JWT authentication and user management
- Full CRUD operations for prompts
- Export/Import JSON functionality

## Quick Start

### Using Pre-built Images (Recommended)

For Intel/AMD64 servers, use pre-built Docker images:

```bash
git clone https://github.com/gabry-ts/veo-prompt-builder.git
cd veo-prompt-builder
cp .env.example .env
# Edit .env with your credentials
docker-compose -f docker-compose.prod.yml up -d
```

### Build from Source

For local development or custom builds:

```bash
git clone https://github.com/gabry-ts/veo-prompt-builder.git
cd veo-prompt-builder
cp .env.example .env
# Edit .env with your credentials
docker-compose up -d
```

Access the application at <http://localhost:43800>

## Environment Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Required variables:

```env
DEFAULT_USER_EMAIL=your-email@example.com
DEFAULT_USER_PASSWORD=your-secure-password
DEFAULT_USER_NAME=Your Name
JWT_SECRET=your-secret-key
```

## Tech Stack

- Frontend: React 18 + TypeScript + Vite + TailwindCSS
- Backend: NestJS + Prisma + PostgreSQL
- Deployment: Docker Compose + Nginx

## API Documentation

Swagger UI available at:

- Development: <http://localhost:3000/api/docs>
- Production: <http://localhost:43800/api/docs>

## License

MIT
