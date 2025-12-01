# Meo Veo

Web application for creating Veo 3 video prompts through an intuitive visual
interface.

## 🌟 Key Features

### 📝 Visual Prompt Builder

Build Veo JSON prompts with an intuitive form-based interface. No need to write
JSON by hand!

- **Organized Sections**: Camera, Subject, Props, Setting, Lighting, Action,
  Dialogue, Audio, Style
- **Helpful Guidance**: Placeholders, help text, and examples in every field
- **Validation**: Real-time Veo-specific validation with error and warning
  detection

### 🎨 Template System

Start quickly with 6 pre-built domain templates:

- 🍳 Cooking & Food
- 💪 Fitness & Health
- 🎮 Gaming & Tech
- 📚 Education & Learning
- 🌍 Travel & Adventure
- 💼 Business & Professional

### 🎞️ Multi-Scene Support

Create videos with multiple scenes while maintaining consistency:

- **Add Scenes**: Create multiple scenes for longer videos
- **Duplicate Scenes**: Copy scenes to maintain verbatim character/setting
  descriptions
- **Scene Tabs**: Easy navigation between scenes
- **Consistency Checking**: Validation warns if descriptions differ across
  scenes

### ✅ Veo Validation

Real-time validation ensures your prompts follow Veo best practices:

- ❌ **Errors**: CAPS LOCK words, missing required fields, invalid JSON
- ⚠️ **Warnings**: Long dialogue, missing flags, inconsistent descriptions
- ✅ **Success**: Green light when everything is perfect

### 🔄 Dual Editor Modes

- **Visual Builder**: Form-based interface (recommended for most users)
- **JSON Editor**: Direct JSON editing for advanced users
- **Switch Anytime**: Toggle between modes without losing data

### 💾 Full CRUD

- Create, Read, Update, Delete prompts
- Search prompts by name or description
- Sort by date or name
- Duplicate prompts with one click
- Export as JSON files
- Import existing JSON files

### 🎨 Beautiful UI

- 🌓 **Dark/Light Mode**: Toggle theme with persistence
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎯 **Modern Design**: Clean interface with Tailwind CSS
- ⚡ **Fast**: Optimized performance with React Query

### 🐳 Production Ready

- **Docker Compose**: Complete stack with one command
- **Nginx Reverse Proxy**: All services on single port (43800)
- **Health Checks**: Automatic monitoring of all services
- **Auto Restart**: Services restart automatically on crash
- **Persistent Data**: PostgreSQL data survives restarts
- **Multi-stage Builds**: Optimized Docker images

### 🔐 Secure

- JWT authentication
- Password hashing with bcrypt
- Protected API endpoints
- User profile management
- Password change functionality

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: NestJS + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **Deployment**: Docker Compose
- **Quality**: ESLint (strict) + Prettier + Husky hooks

## Quick Start

```bash
# 1. Install dependencies
yarn install

# 2. Generate Prisma client
cd apps/backend && npx prisma generate && cd ../..

# 3. Start PostgreSQL
docker-compose up -d postgres

# 4. Run migrations
cd apps/backend && npx prisma migrate dev && cd ../..

# 5. Start backend (terminal 1)
yarn dev:backend

# 6. Start frontend (terminal 2)
yarn dev:frontend
```

**Then open** <http://localhost:5173> and create your account!

For detailed setup instructions, see [docs/QUICKSTART.md](docs/QUICKSTART.md) or
[docs/SETUP.md](docs/SETUP.md).

## 📖 Documentation

- **[docs/QUICKSTART.md](docs/QUICKSTART.md)**: 5-minute setup guide
- **[docs/DOCKER.md](docs/DOCKER.md)**: Complete Docker setup with Nginx
- **[docs/SETUP.md](docs/SETUP.md)**: Detailed setup and development guide
- **[docs/API.md](docs/API.md)**: Complete API documentation
- **[docs/FEATURES.md](docs/FEATURES.md)**: Comprehensive feature list
- **[docs/PROJECT_COMPLETE.md](docs/PROJECT_COMPLETE.md)**: Project completion
  summary
- **Swagger UI**:
  - Development: <http://localhost:3000/api/docs>
  - Production: <http://localhost:43800/api/docs>

## 🎯 Use Cases

Perfect for content creators who need to generate Veo JSON prompts for:

- Cooking videos
- Fitness tutorials
- Gaming content
- Educational videos
- Travel vlogs
- Business presentations
- And any other domain!

## 🚀 Production Deployment

### Docker con Nginx Reverse Proxy (TUTTO su porta 80!)

```bash
# Build and start ALL services (PostgreSQL + Backend + Frontend + Nginx)
docker-compose build
docker-compose up -d

# Wait for startup
sleep 30

# Everything is now available at http://localhost:43800
# - Frontend: http://localhost:43800/
# - API: http://localhost:43800/api
# - Docs: http://localhost:43800/api/docs
```

**Architettura:**

```text
        Nginx (:80)
            │
    ┌───────┴───────┐
    │               │
Frontend        Backend (:3000)
(:80)               │
            PostgreSQL (:5432)
```

**Tutto accessibile tramite Nginx reverse proxy su porta 43800!**

Don't forget to:

1. Set a strong `JWT_SECRET` in `docker-compose.yml`
2. Setup SSL/TLS certificates for HTTPS (see [docs/DOCKER.md](docs/DOCKER.md))
3. Configure backups for PostgreSQL data
4. Setup monitoring and health checks

## 📝 Example Workflow

1. **Login/Register**: Create your account
2. **Choose Template**: Pick from 6 domain templates or start blank
3. **Fill Form**: Use the visual builder to create your scene
4. **Add Scenes**: Create multiple scenes if needed (duplicate for consistency)
5. **Validate**: Check for errors and warnings
6. **Save**: Store in database for later use
7. **Export**: Download as JSON file for Veo 3

## 🎨 Screenshots

### Visual Builder

Intuitive form-based editor with organized sections and helpful guidance.

### Template Selector

Choose from 6 pre-built templates for common video domains.

### Validation Panel

Real-time feedback on errors and warnings specific to Veo requirements.

### Multi-Scene UI

Manage multiple scenes with tabs, add, duplicate, and remove functionality.

## 🤝 Contributing

This is a private project. For internal use only.

## 📄 License

Private - All rights reserved

## 🆘 Support

For issues or questions:

1. Check [docs/SETUP.md](docs/SETUP.md) for troubleshooting
2. Review [docs/FEATURES.md](docs/FEATURES.md) for feature documentation
3. Check [docs/DOCKER.md](docs/DOCKER.md) for Docker help
4. Check API documentation at `/api/docs` (Swagger UI)

---

Built with ❤️ for creating amazing Veo video prompts
