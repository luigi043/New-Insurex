# InsureX Setup Guide

Complete setup instructions for the InsureX Insurance Management System.

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Docker Setup](#docker-setup)
7. [Troubleshooting](#troubleshooting)
8. [Verification](#verification)

---

## Prerequisites

### Required Software

| Software | Version | Download Link | Purpose |
|----------|---------|---------------|---------|
| **Node.js** | 18.x or higher | [nodejs.org](https://nodejs.org/) | Frontend runtime |
| **npm** | 9.x or higher | Included with Node.js | Package manager |
| **.NET SDK** | 8.0 | [dotnet.microsoft.com](https://dotnet.microsoft.com/download) | Backend framework |
| **SQL Server** | 2019+ or LocalDB | [microsoft.com/sql-server](https://www.microsoft.com/sql-server) | Database |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) | Version control |
| **Visual Studio Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com/) | IDE (recommended) |

### Optional Software

| Software | Purpose |
|----------|---------|
| **Visual Studio 2022** | Full-featured .NET IDE |
| **SQL Server Management Studio (SSMS)** | Database management |
| **Postman** | API testing |
| **Docker Desktop** | Containerization |

### Verify Installations

```bash
# Check Node.js version
node --version
# Expected: v18.x.x or higher

# Check npm version
npm --version
# Expected: 9.x.x or higher

# Check .NET SDK version
dotnet --version
# Expected: 8.0.x

# Check Git version
git --version
# Expected: git version 2.x.x
```

---

## Environment Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/luigi043/New-Insurex.git

# Navigate to project directory
cd New-Insurex

# Check current branch
git branch
# Should be on 'main' or 'master'
```

### 2. Project Structure Overview

```
New-Insurex/
├── InsureX.API/              # Web API project
├── InsureX.Application/      # Business logic layer
├── InsureX.Domain/           # Domain entities
├── InsureX.Infrastructure/   # Data access & services
├── InsureX.Shared/           # Shared DTOs
├── InsureX.Tests/            # Unit tests
├── insurex-react/            # React frontend
├── database/                 # Database scripts
└── docker-compose.yml        # Docker configuration
```

---

## Database Setup

### Option 1: SQL Server LocalDB (Recommended for Development)

LocalDB is included with Visual Studio and SQL Server Express.

#### Install SQL Server Express with LocalDB

1. Download [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
2. Run installer and select "Custom" installation
3. Select "LocalDB" feature
4. Complete installation

#### Verify LocalDB Installation

```bash
# List LocalDB instances
sqllocaldb info

# Create a new instance (if needed)
sqllocaldb create MSSQLLocalDB

# Start the instance
sqllocaldb start MSSQLLocalDB

# Get connection info
sqllocaldb info MSSQLLocalDB
```

#### Connection String for LocalDB

```
Server=(localdb)\\MSSQLLocalDB;Database=InsureX;Trusted_Connection=True;TrustServerCertificate=True
```

### Option 2: SQL Server (Full Installation)

#### Install SQL Server

1. Download [SQL Server Developer Edition](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (free)
2. Run installer
3. Choose "Basic" installation
4. Note the connection string provided at the end

#### Enable SQL Server Authentication (Optional)

1. Open SQL Server Management Studio (SSMS)
2. Connect to your server
3. Right-click server → Properties → Security
4. Select "SQL Server and Windows Authentication mode"
5. Restart SQL Server service

#### Connection String for SQL Server

```
Server=localhost;Database=InsureX;Trusted_Connection=True;TrustServerCertificate=True
```

Or with SQL authentication:

```
Server=localhost;Database=InsureX;User Id=sa;Password=YourPassword;TrustServerCertificate=True
```

### Option 3: Docker SQL Server

```bash
# Run SQL Server in Docker
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name insurex-sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest

# Connection string
Server=localhost,1433;Database=InsureX;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True
```

---

## Backend Setup

### 1. Configure Connection String

Navigate to the API project:

```bash
cd InsureX.API
```

Create or edit `appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=InsureX;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-with-at-least-32-characters-long-for-development",
    "Issuer": "InsureX",
    "Audience": "InsureXClient",
    "ExpirationHours": "24"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173"
    ]
  }
}
```

### 2. Restore NuGet Packages

```bash
# From the solution root directory
cd ..

# Restore all packages
dotnet restore

# Or restore for specific project
cd InsureX.API
dotnet restore
```

### 3. Apply Database Migrations

```bash
# From InsureX.API directory
cd InsureX.API

# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Update EF Core tools (if already installed)
dotnet tool update --global dotnet-ef

# Apply migrations to create database
dotnet ef database update --project ../InsureX.Infrastructure

# Verify database was created
dotnet ef database list --project ../InsureX.Infrastructure
```

### 4. Seed Initial Data (Optional)

```bash
# Run the seed tool
cd ../InsureX.SeedTool
dotnet run

# Or seed from API startup (if configured)
cd ../InsureX.API
dotnet run --seed
```

### 5. Run the Backend API

```bash
# From InsureX.API directory
cd InsureX.API

# Run in development mode
dotnet run

# Or with watch mode (auto-restart on changes)
dotnet watch run
```

**Expected Output:**

```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7001
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5001
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

### 6. Verify API is Running

Open browser and navigate to:

- **Swagger UI**: https://localhost:7001/swagger
- **Health Check**: https://localhost:7001/health

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd insurex-react
```

### 2. Install Dependencies

```bash
# Install all npm packages
npm install

# Or use yarn
yarn install

# Or use pnpm
pnpm install
```

**Expected Output:**

```
added 1234 packages, and audited 1235 packages in 45s

found 0 vulnerabilities
```

### 3. Configure Environment Variables

Create `.env` file in `insurex-react` directory:

```bash
# Copy example file
cp .env.example .env

# Or create manually
touch .env
```

Edit `.env` file:

```env
# API Configuration
VITE_API_URL=http://localhost:5001/api

# Application Configuration
VITE_APP_NAME=InsureX
VITE_APP_VERSION=1.0.0

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### 4. Run the Frontend

```bash
# Start development server
npm run dev

# Or with specific port
npm run dev -- --port 3000

# Or with host binding
npm run dev -- --host 0.0.0.0
```

**Expected Output:**

```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### 5. Access the Application

Open browser and navigate to:

- **Frontend**: http://localhost:5173 (or http://localhost:3000)

### 6. Default Login Credentials

Use these credentials to log in:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@insurex.com | Admin123! |
| **Manager** | manager@insurex.com | Manager123! |
| **Insurer** | insurer@insurex.com | Insurer123! |
| **Agent** | agent@insurex.com | Agent123! |

---

## Docker Setup

### Prerequisites

- Docker Desktop installed and running
- Docker Compose installed (included with Docker Desktop)

### 1. Build and Run with Docker Compose

```bash
# From project root directory
cd New-Insurex

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### 2. Individual Container Setup

#### Build Backend Image

```bash
# Build API image
docker build -t insurex-api -f Dockerfile .

# Run API container
docker run -d -p 5000:80 -p 5001:443 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ConnectionStrings__DefaultConnection="Server=host.docker.internal;Database=InsureX;Trusted_Connection=True;TrustServerCertificate=True" \
  --name insurex-api \
  insurex-api
```

#### Build Frontend Image

```bash
# Navigate to frontend
cd insurex-react

# Create Dockerfile if not exists
cat > Dockerfile << 'EOF'
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Build frontend image
docker build -t insurex-frontend .

# Run frontend container
docker run -d -p 3000:80 \
  --name insurex-frontend \
  insurex-frontend
```

### 3. Access Dockerized Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/swagger
- **SQL Server**: localhost:1433

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Errors

**Error**: `Cannot open database "InsureX" requested by the login`

**Solution**:
```bash
# Verify SQL Server is running
# For LocalDB:
sqllocaldb info MSSQLLocalDB

# For SQL Server service:
# Windows: Check Services app for "SQL Server (MSSQLSERVER)"
# Linux: sudo systemctl status mssql-server

# Recreate database
dotnet ef database drop --project ../InsureX.Infrastructure --force
dotnet ef database update --project ../InsureX.Infrastructure
```

#### 2. Port Already in Use

**Error**: `Failed to bind to address http://127.0.0.1:5001: address already in use`

**Solution**:
```bash
# Find process using port
# Windows:
netstat -ano | findstr :5001
taskkill /PID <process_id> /F

# Linux/Mac:
lsof -i :5001
kill -9 <process_id>

# Or change port in launchSettings.json
```

#### 3. CORS Errors in Browser

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
- Verify `appsettings.Development.json` includes frontend URL in `Cors.AllowedOrigins`
- Ensure frontend is using correct API URL in `.env`
- Clear browser cache and restart both servers

#### 4. JWT Token Errors

**Error**: `IDX10503: Signature validation failed`

**Solution**:
- Ensure `JwtSettings.SecretKey` is at least 32 characters
- Verify same secret key in all environments
- Clear browser localStorage and login again

#### 5. npm Install Fails

**Error**: `ERESOLVE unable to resolve dependency tree`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps
```

#### 6. Entity Framework Migrations Fail

**Error**: `Build failed`

**Solution**:
```bash
# Build the solution first
dotnet build

# Then run migrations
dotnet ef database update --project ../InsureX.Infrastructure

# If still failing, specify startup project
dotnet ef database update --project ../InsureX.Infrastructure --startup-project ../InsureX.API
```

#### 7. Docker Build Fails

**Error**: `failed to solve with frontend dockerfile.v0`

**Solution**:
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Docker daemon is running
docker info
```

---

## Verification

### Backend Verification Checklist

- [ ] API runs without errors
- [ ] Swagger UI loads at https://localhost:7001/swagger
- [ ] Health check returns 200 OK at https://localhost:7001/health
- [ ] Database exists and has tables
- [ ] Can login with default credentials via Swagger
- [ ] JWT token is returned on successful login

### Frontend Verification Checklist

- [ ] React app runs without errors
- [ ] Login page loads
- [ ] Can login with default credentials
- [ ] Dashboard displays after login
- [ ] Navigation menu works
- [ ] No console errors in browser DevTools

### Integration Verification Checklist

- [ ] Frontend can communicate with backend
- [ ] API calls return data
- [ ] Authentication flow works end-to-end
- [ ] Protected routes require authentication
- [ ] Logout clears session

### Test API Endpoints

```bash
# Health check
curl https://localhost:7001/health

# Login (get token)
curl -X POST https://localhost:7001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@insurex.com","password":"Admin123!"}'

# Get current user (replace TOKEN with actual token)
curl https://localhost:7001/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## Next Steps

After successful setup:

1. **Read the Usage Guide**: See [USAGE.md](./USAGE.md) for development workflows
2. **Review Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. **Check Contributing Guidelines**: See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution process
4. **Explore the Codebase**: Start with `InsureX.API/Program.cs` and `insurex-react/src/App.tsx`
5. **Run Tests**: Execute `dotnet test` to verify everything works

---

## Additional Resources

- **Project Checklist**: [Checklist.md](./Checklist.md) - Development progress tracking
- **Command Reference**: [notes.md](./notes.md) - Common commands and snippets
- **GitHub Repository**: https://github.com/luigi043/New-Insurex
- **Issue Tracker**: https://github.com/luigi043/New-Insurex/issues

---

## Support

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search [GitHub Issues](https://github.com/luigi043/New-Insurex/issues)
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, versions)
   - Relevant logs

---

**Last Updated**: 2026-03-03
