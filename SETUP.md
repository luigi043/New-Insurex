# 🛠️ InsureX Setup Guide

Complete setup instructions for the InsureX Insurance Management System.

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Environment Setup](#-environment-setup)
3. [Backend Setup](#-backend-setup)
4. [Frontend Setup](#-frontend-setup)
5. [Database Setup](#-database-setup)
6. [Docker Setup](#-docker-setup)
7. [Configuration](#-configuration)
8. [Verification](#-verification)
9. [Troubleshooting](#-troubleshooting)

---

## 📦 Prerequisites

### Required Software

#### 1. Node.js and npm

**Version**: Node.js 18.x or higher

**Download**: https://nodejs.org/

**Verification**:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

**Alternative Package Managers**:
- **Yarn**: `npm install -g yarn`
- **pnpm**: `npm install -g pnpm`

---

#### 2. .NET SDK

**Version**: .NET 8.0

**Download**: https://dotnet.microsoft.com/download/dotnet/8.0

**Verification**:
```bash
dotnet --version  # Should show 8.0.x
dotnet --list-sdks # Should include 8.0.x
```

**Install .NET EF Core Tools**:
```bash
dotnet tool install --global dotnet-ef --version 8.0.*

# Verify installation
dotnet ef --version  # Should show 8.0.x
```

---

#### 3. SQL Server

**Options**:

**A. SQL Server Express** (Recommended for production-like setup)
- Download: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- Free edition, full-featured
- Includes SQL Server Management Studio (SSMS)

**B. SQL Server LocalDB** (Recommended for development)
- Included with Visual Studio
- Lightweight, auto-starts on demand
- Perfect for local development

**C. SQL Server on Docker** (Recommended for containerized setup)
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name insurex-sql \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

**Verification**:
```bash
# For LocalDB
sqllocaldb info

# For SQL Server/Docker
sqlcmd -S localhost -U sa -P YourPassword
```

---

#### 4. Git

**Download**: https://git-scm.com/

**Verification**:
```bash
git --version  # Should show 2.x.x or higher
```

**Configuration**:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

### Optional but Recommended Tools

#### Visual Studio Code

**Download**: https://code.visualstudio.com/

**Recommended Extensions**:
```bash
# Install via command line
code --install-extension ms-dotnettools.csdevkit
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension eamodio.gitlens
code --install-extension rangav.vscode-thunder-client
```

Or install via VS Code Extensions marketplace:
- C# Dev Kit
- ESLint
- Prettier - Code formatter
- ES7+ React/Redux/React-Native snippets
- GitLens
- Thunder Client

#### Visual Studio 2022

**Download**: https://visualstudio.microsoft.com/

**Workloads Required**:
- ASP.NET and web development
- .NET desktop development

#### SQL Server Management Studio (SSMS)

**Download**: https://aka.ms/ssmsfullsetup

**Alternative**: Azure Data Studio (cross-platform)

#### Postman or Insomnia

**Postman**: https://www.postman.com/
**Insomnia**: https://insomnia.rest/

For testing API endpoints.

---

## 🌍 Environment Setup

### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/luigi043/New-Insurex.git

# Or via SSH (if you have SSH keys configured)
git clone git@github.com:luigi043/New-Insurex.git

# Navigate to project directory
cd New-Insurex
```

### 2. Verify Project Structure

```bash
# List main directories
ls -la

# You should see:
# - insurex-react/          (Frontend)
# - InsureX.API/            (Backend API)
# - InsureX.Application/    (Business Logic)
# - InsureX.Domain/         (Domain Models)
# - InsureX.Infrastructure/ (Data Access)
# - docker-compose.yml
# - InsureX.sln
```

---

## 🔧 Backend Setup

### Step 1: Restore Dependencies

```bash
# From project root
dotnet restore

# Or restore specific project
dotnet restore InsureX.API/InsureX.API.csproj
```

### Step 2: Build the Solution

```bash
# Build entire solution
dotnet build

# Build in Release mode
dotnet build --configuration Release

# Build specific project
dotnet build InsureX.API/InsureX.API.csproj
```

**Expected Output**:
```
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

### Step 3: Configure Application Settings

#### Option A: Using appsettings.Development.json (Recommended)

Create/edit `InsureX.API/appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-development-key-with-at-least-32-characters",
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

#### Option B: Using Environment Variables

**Windows (PowerShell)**:
```powershell
$env:ConnectionStrings__DefaultConnection = "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True"
$env:JwtSettings__SecretKey = "your-secret-key-here"
```

**Linux/Mac (Bash)**:
```bash
export ConnectionStrings__DefaultConnection="Server=localhost;Database=InsureX_Dev;Trusted_Connection=True"
export JwtSettings__SecretKey="your-secret-key-here"
```

#### Option C: Using User Secrets (Most Secure for Development)

```bash
# Navigate to API project
cd InsureX.API

# Initialize user secrets
dotnet user-secrets init

# Set secrets
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
dotnet user-secrets set "JwtSettings:SecretKey" "your-super-secret-key-with-at-least-32-characters"

# List all secrets
dotnet user-secrets list
```

### Step 4: Run the API

```bash
# From InsureX.API directory
cd InsureX.API

# Run with hot reload (recommended for development)
dotnet watch run

# Or run normally
dotnet run

# Run on specific port
dotnet run --urls "https://localhost:7001;http://localhost:5001"
```

**Expected Output**:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7001
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5001
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

**Verify API is running**:
- Open browser: https://localhost:7001/swagger
- Should see Swagger UI with API documentation

---

## ⚛️ Frontend Setup

### Step 1: Install Dependencies

```bash
# Navigate to React app
cd insurex-react

# Install with npm
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

**Expected Output**:
```
added XXX packages in XXs
```

### Step 2: Configure Environment Variables

```bash
# Create .env file from example
cp .env.example .env

# Or manually create .env
touch .env
```

Edit `insurex-react/.env`:

```env
# API Configuration
VITE_API_URL=https://localhost:7001/api
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

**Important Notes**:
- Use `VITE_` prefix for all environment variables
- Variables are embedded at build time
- Restart dev server after changing `.env`

### Step 3: Run the Development Server

```bash
# Start dev server
npm run dev

# Or with yarn
yarn dev

# Or with pnpm
pnpm dev
```

**Expected Output**:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Verify Frontend is running**:
- Open browser: http://localhost:3000
- Should see InsureX login page

### Step 4: Build for Production

```bash
# Create production build
npm run build

# Output will be in dist/ folder
ls dist/

# Preview production build
npm run preview
```

---

## 🗄️ Database Setup

### Option 1: Using Entity Framework Migrations (Recommended)

#### Step 1: Update Connection String

Edit `InsureX.API/appsettings.Development.json`:

**For Windows Authentication**:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
```

**For SQL Authentication**:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=InsureX_Dev;User Id=sa;Password=YourStrong@Passw0rd;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
```

**For LocalDB**:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=InsureX_Dev;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```

#### Step 2: Create Initial Migration (if not exists)

```bash
# From project root
cd InsureX.API

# Create migration
dotnet ef migrations add InitialCreate --project ../InsureX.Infrastructure --context ApplicationDbContext

# View migration files
ls ../InsureX.Infrastructure/Migrations/
```

#### Step 3: Apply Migrations

```bash
# Apply all pending migrations
dotnet ef database update --project ../InsureX.Infrastructure --context ApplicationDbContext

# Apply to specific migration
dotnet ef database update SpecificMigrationName --project ../InsureX.Infrastructure

# Rollback to previous migration
dotnet ef database update PreviousMigrationName --project ../InsureX.Infrastructure
```

**Expected Output**:
```
Build started...
Build succeeded.
Applying migration '20260303_InitialCreate'.
Done.
```

#### Step 4: Verify Database Creation

**Using SSMS**:
1. Open SQL Server Management Studio
2. Connect to `localhost` or `(localdb)\mssqllocaldb`
3. Expand Databases
4. Find `InsureX_Dev`
5. Expand Tables - should see all entity tables

**Using Command Line**:
```bash
sqlcmd -S localhost -d InsureX_Dev -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
```

### Option 2: Using SQL Scripts

#### Step 1: Generate SQL Script from Migrations

```bash
# Generate script for all migrations
dotnet ef migrations script --project InsureX.Infrastructure --output database/schema.sql

# Generate script for specific range
dotnet ef migrations script FromMigration ToMigration --project InsureX.Infrastructure
```

#### Step 2: Execute SQL Script

**Using SSMS**:
1. Open `database/schema.sql` in SSMS
2. Select target database
3. Click Execute (F5)

**Using sqlcmd**:
```bash
sqlcmd -S localhost -d InsureX_Dev -i database/schema.sql
```

### Option 3: Using Seed Data Tool

```bash
# Run the seed tool to populate initial data
cd InsureX.SeedTool
dotnet run

# This will create:
# - Default admin user
# - Sample policies
# - Sample claims
# - Sample assets
# - Test data
```

---

## 🐳 Docker Setup

### Option 1: Using Docker Compose (Full Stack)

#### Step 1: Install Docker

**Download**: https://www.docker.com/get-started

**Verify**:
```bash
docker --version
docker-compose --version
```

#### Step 2: Configure docker-compose.yml

The `docker-compose.yml` is already configured in the project root:

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:80"
      - "5001:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=InsurexDb;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;
    depends_on:
      - sqlserver

  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong@Passw0rd
      - MSSQL_PID=Developer
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql

  frontend:
    build:
      context: ./insurex-react
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000/api
    depends_on:
      - api

volumes:
  sqlserver_data:
```

#### Step 3: Build and Run

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

#### Step 4: Verify Docker Containers

```bash
# List running containers
docker ps

# Should see:
# - insurex-api
# - insurex-frontend
# - insurex-sqlserver

# Access services:
# Frontend: http://localhost:3000
# API: http://localhost:5000/swagger
# Database: localhost:1433
```

### Option 2: Individual Docker Containers

#### Backend Container

```bash
# Build backend image
docker build -t insurex-api -f Dockerfile .

# Run backend container
docker run -d \
  --name insurex-api \
  -p 5000:80 \
  -e ConnectionStrings__DefaultConnection="Server=host.docker.internal;Database=InsureX_Dev;User Id=sa;Password=YourPass" \
  insurex-api

# View logs
docker logs insurex-api -f
```

#### Frontend Container

```bash
# Build frontend image
cd insurex-react
docker build -t insurex-frontend -f Dockerfile .

# Run frontend container
docker run -d \
  --name insurex-frontend \
  -p 3000:3000 \
  -e VITE_API_URL=http://localhost:5000/api \
  insurex-frontend

# View logs
docker logs insurex-frontend -f
```

#### SQL Server Container

```bash
# Run SQL Server
docker run -d \
  --name insurex-sql \
  -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 \
  -v insurex-sql-data:/var/opt/mssql \
  mcr.microsoft.com/mssql/server:2022-latest

# Connect to SQL Server
docker exec -it insurex-sql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd
```

---

## ⚙️ Configuration

### Backend Configuration Files

#### 1. appsettings.json (Base Configuration)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX;Trusted_Connection=True"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-minimum-32-characters-long",
    "Issuer": "InsureX",
    "Audience": "InsureXClient",
    "ExpirationHours": "24",
    "RefreshTokenExpirationDays": "7"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000"
    ]
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "noreply@insurex.com",
    "SenderName": "InsureX",
    "Username": "",
    "Password": "",
    "UseSsl": true
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information"
    },
    "WriteTo": [
      { "Name": "Console" },
      { 
        "Name": "File",
        "Args": { 
          "path": "logs/log-.txt",
          "rollingInterval": "Day"
        }
      }
    ]
  },
  "RateLimiting": {
    "PermitLimit": 100,
    "Window": "1m"
  }
}
```

#### 2. appsettings.Development.json (Development Overrides)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

#### 3. appsettings.Production.json (Production Configuration)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=prod-server;Database=InsureX;User Id=prod_user;Password=***"
  },
  "Cors": {
    "AllowedOrigins": [
      "https://insurex.com",
      "https://www.insurex.com"
    ]
  }
}
```

### Frontend Configuration

#### .env (Development)

```env
VITE_API_URL=https://localhost:7001/api
VITE_API_TIMEOUT=30000
VITE_TOKEN_KEY=accessToken
VITE_REFRESH_TOKEN_KEY=refreshToken
```

#### .env.production (Production)

```env
VITE_API_URL=https://api.insurex.com/api
VITE_API_TIMEOUT=30000
VITE_TOKEN_KEY=accessToken
VITE_REFRESH_TOKEN_KEY=refreshToken
```

---

## ✅ Verification

### Step 1: Verify Backend

```bash
# Health check
curl https://localhost:7001/health

# Should return: Healthy

# Swagger documentation
open https://localhost:7001/swagger
```

### Step 2: Verify Frontend

```bash
# Open browser
open http://localhost:3000

# Should see login page
```

### Step 3: Verify Database

```bash
# List tables
sqlcmd -S localhost -d InsureX_Dev -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'"

# Expected tables:
# - Users
# - Policies
# - Claims
# - Assets
# - Partners
# - Invoices
# - Tenants
# - AuditLogs
```

### Step 4: Test Authentication

```bash
# Login via API
curl -X POST https://localhost:7001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@insurex.com",
    "password": "Admin123!"
  }'

# Should return access token and user info
```

### Step 5: Full Integration Test

1. Open http://localhost:3000
2. Login with:
   - Email: `admin@insurex.com`
   - Password: `Admin123!`
3. Navigate to Dashboard
4. Click on Policies
5. Create a new policy
6. Verify policy appears in list

---

## 🔧 Troubleshooting

### Backend Issues

#### Issue: "Unable to connect to SQL Server"

**Symptoms**:
```
A network-related or instance-specific error occurred while establishing a connection to SQL Server.
```

**Solutions**:

1. **Check SQL Server is running**:
   ```bash
   # Windows Services
   services.msc
   # Look for "SQL Server (MSSQLSERVER)"
   
   # Or use PowerShell
   Get-Service MSSQLSERVER
   ```

2. **Verify connection string**:
   ```json
   // For LocalDB
   "Server=(localdb)\\mssqllocaldb;..."
   
   // For SQL Server Express
   "Server=localhost\\SQLEXPRESS;..."
   
   // For default instance
   "Server=localhost;..."
   ```

3. **Enable TCP/IP**:
   - Open SQL Server Configuration Manager
   - Expand "SQL Server Network Configuration"
   - Click "Protocols for MSSQLSERVER"
   - Enable TCP/IP
   - Restart SQL Server service

4. **Check firewall**:
   ```powershell
   # Allow SQL Server through firewall
   New-NetFirewallRule -DisplayName "SQL Server" -Direction Inbound -Protocol TCP -LocalPort 1433 -Action Allow
   ```

#### Issue: "EF Core tools not found"

**Symptoms**:
```
Could not execute because the specified command or file was not found.
```

**Solution**:
```bash
# Install EF Core tools globally
dotnet tool install --global dotnet-ef

# Or update if already installed
dotnet tool update --global dotnet-ef

# Verify installation
dotnet ef --version
```

#### Issue: "Migration already applied"

**Symptoms**:
```
The migration 'xxx' has already been applied to the database.
```

**Solutions**:

1. **Check migration history**:
   ```bash
   dotnet ef migrations list --project InsureX.Infrastructure
   ```

2. **Remove migration**:
   ```bash
   # Remove last migration
   dotnet ef migrations remove --project InsureX.Infrastructure
   ```

3. **Force update**:
   ```bash
   # Drop database and recreate
   dotnet ef database drop --project InsureX.Infrastructure
   dotnet ef database update --project InsureX.Infrastructure
   ```

#### Issue: "Port already in use"

**Symptoms**:
```
Failed to bind to address https://127.0.0.1:7001: address already in use.
```

**Solutions**:

1. **Find and kill process**:
   ```bash
   # Windows
   netstat -ano | findstr :7001
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:7001 | xargs kill -9
   ```

2. **Change port**:
   Edit `Properties/launchSettings.json`:
   ```json
   "applicationUrl": "https://localhost:7002;http://localhost:5002"
   ```

### Frontend Issues

#### Issue: "Module not found"

**Symptoms**:
```
Error: Cannot find module '@mui/material'
```

**Solution**:
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### Issue: "CORS error"

**Symptoms**:
```
Access to XMLHttpRequest at 'https://localhost:7001/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**:

1. **Check backend CORS configuration** in `appsettings.json`:
   ```json
   "Cors": {
     "AllowedOrigins": [
       "http://localhost:3000",
       "http://localhost:5173"
     ]
   }
   ```

2. **Verify Program.cs** has CORS enabled:
   ```csharp
   app.UseCors(policy => policy
       .WithOrigins(corsOrigins)
       .AllowAnyMethod()
       .AllowAnyHeader()
       .AllowCredentials());
   ```

3. **Clear browser cache** and restart dev server

#### Issue: "Environment variables not working"

**Symptoms**:
```
VITE_API_URL is undefined
```

**Solutions**:

1. **Check .env file exists** in `insurex-react/`

2. **Verify variable prefix** (must start with `VITE_`):
   ```env
   VITE_API_URL=https://localhost:7001/api  # ✅ Correct
   API_URL=https://localhost:7001/api       # ❌ Wrong
   ```

3. **Restart dev server** after changing .env

4. **Access in code**:
   ```typescript
   // Correct
   const apiUrl = import.meta.env.VITE_API_URL;
   
   // Not: process.env.VITE_API_URL (that's for Node.js)
   ```

### Database Issues

#### Issue: "Login failed for user"

**Symptoms**:
```
Login failed for user 'sa'
```

**Solutions**:

1. **Reset SA password**:
   ```bash
   # Stop SQL Server
   net stop MSSQLSERVER
   
   # Start in single-user mode
   sqlservr -m
   
   # In another terminal, reset password
   sqlcmd -E -S localhost
   ALTER LOGIN sa WITH PASSWORD = 'NewStrong@Password';
   GO
   ```

2. **Use Windows Authentication** instead:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
   }
   ```

#### Issue: "Database does not exist"

**Solution**:
```bash
# Create database manually
sqlcmd -S localhost -Q "CREATE DATABASE InsureX_Dev"

# Then run migrations
dotnet ef database update --project InsureX.Infrastructure
```

### Docker Issues

#### Issue: "Cannot connect to Docker daemon"

**Solution**:
```bash
# Start Docker Desktop (Windows/Mac)
# Or start Docker service (Linux)
sudo systemctl start docker
```

#### Issue: "Port conflicts in docker-compose"

**Solution**:

Edit `docker-compose.yml` to use different ports:
```yaml
services:
  api:
    ports:
      - "5050:80"  # Change from 5000 to 5050
```

---

## 🎉 Next Steps

After successful setup:

1. ✅ Read [ONBOARDING.md](./ONBOARDING.md) for getting started
2. ✅ Review [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for development workflows
3. ✅ Check [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
4. ✅ Explore the API at https://localhost:7001/swagger
5. ✅ Start developing!

---

## 📞 Support

If you encounter issues not covered here:

1. Check [GitHub Issues](https://github.com/luigi043/New-Insurex/issues)
2. Search existing discussions
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, .NET version, Node version)
   - Screenshots if applicable

---

**Last Updated**: 2026-03-03
