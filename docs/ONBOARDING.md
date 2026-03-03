# InsureX Developer Onboarding Guide

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

Welcome to InsureX! This guide will help you get up and running with the InsureX Insurance Management System. Whether you're a new team member or an external contributor, follow this guide to set up your development environment and understand the codebase.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Backend Setup (.NET 8)](#backend-setup-net-8)
5. [Frontend Setup (React)](#frontend-setup-react)
6. [Database Setup](#database-setup)
7. [Running the Full Stack](#running-the-full-stack)
8. [Docker Development](#docker-development)
9. [Project Architecture](#project-architecture)
10. [Development Workflow](#development-workflow)
11. [Code Style & Conventions](#code-style--conventions)
12. [Troubleshooting](#troubleshooting)
13. [Getting Help](#getting-help)

---

## Overview

InsureX is a comprehensive insurance management platform consisting of:

- **Backend**: .NET 8 Web API with Clean Architecture
- **Frontend**: React 18 + TypeScript + Material-UI
- **Database**: SQL Server
- **Legacy**: IAPR_Web (ASP.NET Web Forms - being migrated)

The system handles policy management, claims processing, asset tracking, partner management, and billing operations with full multi-tenancy support.

---

## Prerequisites

Ensure you have the following installed on your development machine:

### Required Software

| Software | Version | Download Link |
|----------|---------|---------------|
| Node.js | 18.x or higher | [nodejs.org](https://nodejs.org/) |
| .NET SDK | 8.0 | [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet/8.0) |
| SQL Server | 2019+ or LocalDB | [SQL Server](https://www.microsoft.com/sql-server) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |
| VS Code or Visual Studio | Latest | [code.visualstudio.com](https://code.visualstudio.com/) |

### Optional (Recommended)

| Software | Purpose |
|----------|---------|
| Docker Desktop | Containerized development |
| Azure Data Studio | SQL Server management |
| Postman | API testing |

### Verify Installation

```bash
# Check Node.js
node --version
# Expected: v18.x.x or higher

# Check npm
npm --version
# Expected: 9.x.x or higher

# Check .NET SDK
dotnet --version
# Expected: 8.0.x

# Check Git
git --version
# Expected: git version 2.x.x
```

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex
```

### 2. Understand the Directory Structure

```
New-Insurex/
├── insurex-react/              # Frontend React application
├── InsureX.API/                # Backend API entry point
├── InsureX.Application/        # Business logic layer
├── InsureX.Domain/             # Domain entities & interfaces
├── InsureX.Infrastructure/     # Data access & external services
├── InsureX.Shared/             # Shared DTOs & utilities
├── InsureX.Tests/              # Unit & integration tests
├── InsureX.SeedTool/           # Database seeding utility
├── IAPR_Web/                   # Legacy ASP.NET application
├── database/                   # Database scripts
├── docker-compose.yml          # Docker composition
└── InsureX.sln                 # Visual Studio solution
```

---

## Backend Setup (.NET 8)

### Step 1: Navigate to API Project

```bash
cd InsureX.API
```

### Step 2: Restore NuGet Packages

```bash
dotnet restore
```

### Step 3: Configure Database Connection

Edit `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "your-development-secret-key-minimum-32-characters",
    "Issuer": "InsureX",
    "Audience": "InsureXClient",
    "ExpirationHours": "168"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173"
    ]
  }
}
```

**Connection String Options:**

| Scenario | Connection String |
|----------|-------------------|
| SQL Server LocalDB | `Server=(localdb)\\MSSQLLocalDB;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True` |
| SQL Server Express | `Server=localhost\\SQLEXPRESS;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True` |
| Docker SQL Server | `Server=localhost,1433;Database=InsureX_Dev;User Id=sa;Password=YourPassword;TrustServerCertificate=True` |

### Step 4: Apply Database Migrations

```bash
# Ensure EF tools are installed
dotnet tool install --global dotnet-ef

# Apply migrations
dotnet ef database update --project ../InsureX.Infrastructure
```

### Step 5: Run the API

```bash
dotnet run
```

The API will be available at:
- **HTTPS**: https://localhost:7001
- **HTTP**: http://localhost:5001
- **Swagger UI**: https://localhost:7001/swagger

---

## Frontend Setup (React)

### Step 1: Navigate to Frontend Directory

```bash
cd insurex-react
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:5001/api
VITE_API_TIMEOUT=30000

# Authentication
VITE_TOKEN_KEY=accessToken
VITE_REFRESH_TOKEN_KEY=refreshToken

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# File Upload
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=.jpg,.jpeg,.png,.pdf,.doc,.docx

# Pagination Defaults
VITE_DEFAULT_PAGE_SIZE=10
VITE_PAGE_SIZE_OPTIONS=5,10,25,50
```

### Step 4: Start Development Server

```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173** (or http://localhost:3000)

---

## Database Setup

### Option 1: SQL Server LocalDB (Windows)

LocalDB is automatically installed with Visual Studio. No additional setup needed.

### Option 2: Docker SQL Server

```bash
# Start SQL Server container
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name insurex-sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

### Seed Initial Data

The database seeder creates default users and sample data:

```bash
cd InsureX.SeedTool
dotnet run
```

### Default Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@insurex.com | Admin123! | Admin |
| manager@insurex.com | Manager123! | Manager |
| agent@insurex.com | Agent123! | Agent |

---

## Running the Full Stack

### Method 1: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd InsureX.API
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd insurex-react
npm run dev
```

### Method 2: Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Docker Services:**
| Service | URL | Port |
|---------|-----|------|
| API | http://localhost:5000 | 5000 |
| Frontend | http://localhost:3000 | 3000 |
| SQL Server | localhost | 1433 |

---

## Docker Development

### Build Images

```bash
# Build backend
docker build -t insurex-api -f Dockerfile .

# Build frontend (if Dockerfile exists in insurex-react)
docker build -t insurex-frontend -f insurex-react/Dockerfile ./insurex-react
```

### Docker Compose Commands

```bash
# Start all services
docker-compose up -d

# Rebuild and start
docker-compose up -d --build

# View running containers
docker-compose ps

# View logs for a specific service
docker-compose logs -f api

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

---

## Project Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│              InsureX.API                │
│    Controllers, Middleware, Program.cs  │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│          InsureX.Application            │
│    Services, DTOs, Commands, Queries    │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│            InsureX.Domain               │
│    Entities, Enums, Interfaces          │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│        InsureX.Infrastructure           │
│    EF Core, Repositories, Security      │
└─────────────────────────────────────────┘
```

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `InsureX.API/Controllers` | API endpoints |
| `InsureX.API/Middleware` | Request pipeline |
| `InsureX.Application/Services` | Business logic |
| `InsureX.Application/DTOs` | Data transfer objects |
| `InsureX.Domain/Entities` | Domain models |
| `InsureX.Domain/Enums` | Enumerations |
| `InsureX.Infrastructure/Repositories` | Data access |
| `InsureX.Infrastructure/Context` | EF DbContext |

### Frontend Structure

```
insurex-react/src/
├── components/        # Reusable UI components
├── pages/             # Route page components
├── hooks/             # Custom React hooks
├── services/          # API service layer
├── types/             # TypeScript definitions
├── utils/             # Utility functions
├── contexts/          # React Context providers
└── store/             # State management
```

---

## Development Workflow

### Git Branching Strategy

```
main
  └── develop
       ├── feature/INS-123-policy-crud
       ├── feature/INS-456-claims-workflow
       └── bugfix/INS-789-login-issue
```

### Branch Naming Convention

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/INS-{ticket}-description` | `feature/INS-123-add-policy-search` |
| Bugfix | `bugfix/INS-{ticket}-description` | `bugfix/INS-456-fix-login` |
| Hotfix | `hotfix/INS-{ticket}-description` | `hotfix/INS-789-critical-fix` |

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(policies): add policy search functionality
fix(auth): resolve token refresh loop
docs(readme): update setup instructions
refactor(claims): simplify claim state machine
test(policies): add unit tests for PolicyService
chore(deps): upgrade MUI to v5.15
```

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Push branch and create PR
4. Request code review
5. Address feedback
6. Merge after approval

---

## Code Style & Conventions

### C# (.NET Backend)

- Follow Microsoft C# coding conventions
- Use async/await for I/O operations
- Use dependency injection
- Keep controllers thin, logic in services

```csharp
// Good
public async Task<PolicyDto> GetPolicyAsync(int id)
{
    var policy = await _policyRepository.GetByIdAsync(id);
    return _mapper.Map<PolicyDto>(policy);
}
```

### TypeScript (React Frontend)

- Use functional components with hooks
- Prefer TypeScript strict mode
- Use interface for object shapes

```typescript
// Good
interface PolicyProps {
  policy: Policy;
  onUpdate: (policy: Policy) => void;
}

const PolicyCard: React.FC<PolicyProps> = ({ policy, onUpdate }) => {
  // ...
};
```

### ESLint & Prettier

Frontend code is automatically formatted:

```bash
# Lint check
npm run lint

# Format code
npm run format
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error**: `Cannot open database "InsureX_Dev" requested by the login`

**Solution**:
```bash
# Ensure SQL Server is running
# Apply migrations
dotnet ef database update --project ../InsureX.Infrastructure
```

#### 2. CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Verify `Cors.AllowedOrigins` in `appsettings.Development.json` includes your frontend URL.

#### 3. Node Modules Issues

**Error**: Module resolution or dependency errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 4. Port Already in Use

**Error**: `Port 5001 is already in use`

**Solution**:
```bash
# Find process using port
lsof -i :5001
# or on Windows
netstat -ano | findstr :5001

# Kill the process or use a different port
```

#### 5. EF Migration Errors

**Error**: `No migrations were applied`

**Solution**:
```bash
# Create a new migration
dotnet ef migrations add InitialCreate --project ../InsureX.Infrastructure

# Apply migration
dotnet ef database update --project ../InsureX.Infrastructure
```

---

## Getting Help

### Resources

| Resource | Link |
|----------|------|
| GitHub Issues | [New-Insurex Issues](https://github.com/luigi043/New-Insurex/issues) |
| Project Checklist | `Checklist.md` in root |
| API Documentation | `/swagger` when API is running |

### Team Communication

- Create GitHub issues for bugs and feature requests
- Use pull requests for code reviews
- Document any architectural decisions in the `docs/` folder

### Additional Documentation

| Document | Location |
|----------|----------|
| Project Checklist | `/Checklist.md` |
| API README | `/README.md` |
| Frontend README | `/insurex-react/README.md` |
| Usage Guide | `/docs/USAGE_GUIDE.md` |

---

## Next Steps After Onboarding

1. **Explore the codebase** - Familiarize yourself with the architecture
2. **Run the tests** - `dotnet test` for backend, `npm test` for frontend
3. **Try the API** - Use Swagger UI to explore endpoints
4. **Pick a task** - Check `Checklist.md` for pending items
5. **Make your first PR** - Start with a small improvement

---

**Welcome to the team! Happy coding!** 🚀
