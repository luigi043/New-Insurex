# InsureX Setup Guide

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

This guide will walk you through setting up the InsureX Insurance Management System on your local development environment.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup Instructions](#detailed-setup-instructions)
4. [Database Configuration](#database-configuration)
5. [Environment Configuration](#environment-configuration)
6. [Docker Setup](#docker-setup)
7. [Troubleshooting](#troubleshooting)
8. [Verification](#verification)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

| Requirement | Minimum Version | Recommended Version | Download Link |
|-------------|----------------|---------------------|---------------|
| **Node.js** | 18.x | 20.x LTS | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x | Latest | Comes with Node.js |
| **.NET SDK** | 8.0 | 8.0 | [dotnet.microsoft.com](https://dotnet.microsoft.com/download) |
| **SQL Server** | 2019 | 2022 | [SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads) or [SQL Server Express](https://www.microsoft.com/sql-server/sql-server-downloads) |
| **Git** | 2.30+ | Latest | [git-scm.com](https://git-scm.com/) |
| **Visual Studio** | 2022 | 2022 Community+ | [visualstudio.com](https://visualstudio.microsoft.com/) (Optional) |
| **VS Code** | Latest | Latest | [code.visualstudio.com](https://code.visualstudio.com/) (Optional) |

### Verify Installations

```bash
# Check Node.js version
node --version
# Should output: v18.x.x or higher

# Check npm version
npm --version
# Should output: 9.x.x or higher

# Check .NET SDK version
dotnet --version
# Should output: 8.0.x or higher

# Check Git version
git --version
# Should output: git version 2.30.x or higher

# Check SQL Server (if installed locally)
sqlcmd -S localhost -Q "SELECT @@VERSION"
```

---

## Quick Start

For experienced developers who want to get up and running quickly:

```bash
# 1. Clone the repository
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex

# 2. Backend Setup
cd InsureX.API
dotnet restore
# Update connection string in appsettings.Development.json
dotnet ef database update --project ../InsureX.Infrastructure
dotnet run

# 3. Frontend Setup (new terminal)
cd ../insurex-react
npm install
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5001/api
npm run dev

# 4. Access the application
# Frontend: http://localhost:5173
# Backend: https://localhost:7001/swagger
# Login: admin@insurex.com / Admin123!
```

---

## Detailed Setup Instructions

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/luigi043/New-Insurex.git

# Navigate to the project directory
cd New-Insurex

# Verify the structure
ls -la
```

Expected directory structure:
```
New-Insurex/
├── InsureX.API/
├── InsureX.Application/
├── InsureX.Domain/
├── InsureX.Infrastructure/
├── InsureX.Shared/
├── InsureX.Tests/
├── insurex-react/
├── IAPR_Web/
├── database/
├── .github/
├── docker-compose.yml
├── InsureX.sln
└── README.md
```

### Step 2: Backend Setup

#### 2.1 Install .NET Dependencies

```bash
# Navigate to the API project
cd InsureX.API

# Restore NuGet packages
dotnet restore

# Verify the project builds
dotnet build
```

If you encounter errors:
- Ensure you have .NET 8 SDK installed
- Check that all required NuGet packages are available
- Verify your internet connection for package downloads

#### 2.2 Configure Database Connection

Edit `InsureX.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

**For SQL Server Express:**
```json
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=InsureX_Dev;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
```

**For SQL Server with Authentication:**
```json
"DefaultConnection": "Server=localhost;Database=InsureX_Dev;User Id=sa;Password=YourPassword;TrustServerCertificate=True"
```

#### 2.3 Create Database and Run Migrations

```bash
# Ensure you're in the InsureX.API directory
cd InsureX.API

# Create the database and apply migrations
dotnet ef database update --project ../InsureX.Infrastructure

# Verify database creation
sqlcmd -S localhost -d InsureX_Dev -Q "SELECT name FROM sys.tables"
```

Expected output should show tables like:
- `AspNetUsers`
- `Policies`
- `Claims`
- `Assets`
- `Partners`
- `Invoices`
- etc.

#### 2.4 Seed Initial Data (Optional)

If a seed tool is available:

```bash
cd InsureX.SeedTool
dotnet run
```

This will create:
- Default admin user: `admin@insurex.com` / `Admin123!`
- Sample tenants
- Sample data for testing

#### 2.5 Run the Backend API

```bash
# From InsureX.API directory
dotnet run
```

The API should start on:
- **HTTPS**: `https://localhost:7001`
- **HTTP**: `http://localhost:5001`
- **Swagger UI**: `https://localhost:7001/swagger`

**Note**: On first run, you may need to trust the development certificate:
```bash
dotnet dev-certs https --trust
```

### Step 3: Frontend Setup

#### 3.1 Install Node Dependencies

Open a **new terminal** (keep the backend running):

```bash
# Navigate to the React app
cd insurex-react

# Install dependencies
npm install

# This may take a few minutes depending on your internet speed
```

#### 3.2 Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file (use your preferred editor)
# Windows: notepad .env
# Linux/Mac: nano .env or code .env
```

Update the `.env` file with your API URL:

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

**Important**: 
- Use `http://localhost:5001/api` if backend runs on HTTP
- Use `https://localhost:7001/api` if backend runs on HTTPS
- Ensure the port matches your backend configuration

#### 3.3 Start the Development Server

```bash
# From insurex-react directory
npm run dev
```

The frontend should start on:
- **Development Server**: `http://localhost:5173` (Vite default)
- Or `http://localhost:3000` if configured differently

You should see output like:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Database Configuration

### SQL Server Installation Options

#### Option 1: SQL Server LocalDB (Windows - Recommended for Development)

```bash
# LocalDB is included with Visual Studio
# Connection string:
"Server=(localdb)\\mssqllocaldb;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
```

#### Option 2: SQL Server Express (Free)

1. Download from [Microsoft SQL Server Downloads](https://www.microsoft.com/sql-server/sql-server-downloads)
2. Install SQL Server Express with default settings
3. Use connection string:
```json
"Server=localhost\\SQLEXPRESS;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
```

#### Option 3: SQL Server Developer Edition (Free)

1. Download from [Microsoft SQL Server Downloads](https://www.microsoft.com/sql-server/sql-server-downloads)
2. Install SQL Server Developer Edition
3. Use connection string:
```json
"Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
```

#### Option 4: Docker SQL Server

```bash
# Run SQL Server in Docker
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest

# Connection string:
"Server=localhost,1433;Database=InsureX_Dev;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True"
```

### Database Migration Commands

```bash
# Add a new migration
cd InsureX.API
dotnet ef migrations add MigrationName --project ../InsureX.Infrastructure

# Apply migrations to database
dotnet ef database update --project ../InsureX.Infrastructure

# Remove the last migration (if not applied)
dotnet ef migrations remove --project ../InsureX.Infrastructure

# Generate SQL script (without applying)
dotnet ef migrations script --project ../InsureX.Infrastructure

# Generate SQL script for specific migration
dotnet ef migrations script --from MigrationName1 --to MigrationName2 --project ../InsureX.Infrastructure
```

---

## Environment Configuration

### Backend Environment Variables

#### Development (`appsettings.Development.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "dev-secret-key-for-development-only-not-for-production",
    "Issuer": "InsureX",
    "Audience": "InsureXClient",
    "ExpirationHours": "168"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:4200"
    ]
  }
}
```

#### Production (`appsettings.json`)

**Important**: Change these values in production!

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your-server;Database=InsureX_Prod;User Id=your-user;Password=your-password;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-with-at-least-32-characters-long",
    "Issuer": "InsureX",
    "Audience": "InsureXClient",
    "ExpirationHours": "24"
  },
  "Cors": {
    "AllowedOrigins": [
      "https://your-production-domain.com"
    ]
  }
}
```

### Frontend Environment Variables

#### Development (`.env`)

```env
VITE_API_URL=http://localhost:5001/api
VITE_API_TIMEOUT=30000
VITE_TOKEN_KEY=accessToken
VITE_REFRESH_TOKEN_KEY=refreshToken
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=.jpg,.jpeg,.png,.pdf,.doc,.docx
VITE_DEFAULT_PAGE_SIZE=10
VITE_PAGE_SIZE_OPTIONS=5,10,25,50
```

#### Production (`.env.production`)

```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_API_TIMEOUT=30000
VITE_TOKEN_KEY=accessToken
VITE_REFRESH_TOKEN_KEY=refreshToken
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=.jpg,.jpeg,.png,.pdf,.doc,.docx
VITE_DEFAULT_PAGE_SIZE=10
VITE_PAGE_SIZE_OPTIONS=5,10,25,50
```

---

## Docker Setup

### Prerequisites for Docker

- Docker Desktop installed ([docker.com](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

### Quick Docker Setup

```bash
# From the project root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Docker Services

The `docker-compose.yml` includes:

1. **API Service** (`api`)
   - Port: `5000` (HTTP), `5001` (HTTPS)
   - Builds from `Dockerfile`
   - Depends on SQL Server

2. **SQL Server** (`sqlserver`)
   - Port: `1433`
   - Image: `mcr.microsoft.com/mssql/server:2022-latest`
   - Persistent volume: `sqlserver_data`

3. **Frontend** (`frontend`)
   - Port: `3000`
   - Builds from `insurex-react/Dockerfile`
   - Depends on API

### Building Individual Docker Images

```bash
# Build API image
docker build -t insurex-api -f Dockerfile .

# Build frontend image
docker build -t insurex-frontend -f insurex-react/Dockerfile ./insurex-react

# Run API container
docker run -p 5000:80 -e ConnectionStrings__DefaultConnection="Server=host.docker.internal;Database=InsureX;User Id=sa;Password=YourPassword" insurex-api

# Run frontend container
docker run -p 3000:3000 -e REACT_APP_API_URL=http://localhost:5000/api insurex-frontend
```

---

## Troubleshooting

### Common Issues and Solutions

#### Backend Issues

**Issue**: `dotnet ef` command not found
```bash
# Solution: Install EF Core tools
dotnet tool install --global dotnet-ef
```

**Issue**: Database connection failed
- Verify SQL Server is running: `sqlcmd -S localhost -Q "SELECT 1"`
- Check connection string in `appsettings.Development.json`
- Ensure SQL Server authentication is enabled
- Verify firewall allows connections on port 1433

**Issue**: Migration errors
```bash
# Solution: Drop and recreate database (WARNING: Deletes all data)
sqlcmd -S localhost -Q "DROP DATABASE InsureX_Dev"
dotnet ef database update --project ../InsureX.Infrastructure
```

**Issue**: Port already in use
```bash
# Solution: Change ports in launchSettings.json or use different ports
# Or kill the process using the port:
# Windows: netstat -ano | findstr :5001
# Linux/Mac: lsof -i :5001
```

**Issue**: HTTPS certificate errors
```bash
# Solution: Trust the development certificate
dotnet dev-certs https --trust
```

#### Frontend Issues

**Issue**: `npm install` fails
```bash
# Solution: Clear npm cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue**: API connection refused
- Verify backend is running on the correct port
- Check `.env` file has correct `VITE_API_URL`
- Ensure CORS is configured in backend
- Check browser console for detailed error messages

**Issue**: CORS errors
- Add your frontend URL to `Cors.AllowedOrigins` in `appsettings.Development.json`
- Restart the backend after changing CORS settings

**Issue**: Module not found errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules
npm install
```

#### Database Issues

**Issue**: Cannot connect to SQL Server
- Verify SQL Server service is running
- Check SQL Server Browser service is running (if using named instances)
- Verify connection string format
- Test connection with `sqlcmd`:
  ```bash
  sqlcmd -S localhost -U sa -P YourPassword -Q "SELECT @@VERSION"
  ```

**Issue**: Migration conflicts
```bash
# Solution: Reset migrations (WARNING: Deletes all data)
# 1. Delete all files in Migrations folder
# 2. Drop database
# 3. Create new initial migration
dotnet ef migrations add InitialCreate --project ../InsureX.Infrastructure
dotnet ef database update --project ../InsureX.Infrastructure
```

### Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/luigi043/New-Insurex/issues)
2. Review the logs:
   - Backend: Check console output or `logs/` directory
   - Frontend: Check browser console (F12)
3. Verify all prerequisites are installed correctly
4. Ensure you're using the correct versions of all tools

---

## Verification

### Verify Backend Setup

1. **Check API is running**:
   ```bash
   curl http://localhost:5001/api/health
   # Should return: {"status":"Healthy"}
   ```

2. **Access Swagger UI**:
   - Open browser: `https://localhost:7001/swagger`
   - You should see the API documentation

3. **Test Authentication**:
   ```bash
   curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@insurex.com","password":"Admin123!"}'
   # Should return JWT token
   ```

### Verify Frontend Setup

1. **Check frontend is running**:
   - Open browser: `http://localhost:5173`
   - You should see the login page

2. **Test login**:
   - Email: `admin@insurex.com`
   - Password: `Admin123!`
   - Should redirect to dashboard

3. **Check browser console**:
   - Press F12 to open developer tools
   - Should see no errors in Console tab
   - Network tab should show successful API calls

### Verify Database Setup

```bash
# Connect to database
sqlcmd -S localhost -d InsureX_Dev -Q "SELECT COUNT(*) FROM AspNetUsers"

# Should return a number (at least 1 for admin user)
```

### Complete System Check

Run this checklist:

- [ ] Backend API starts without errors
- [ ] Swagger UI is accessible
- [ ] Database connection works
- [ ] Migrations applied successfully
- [ ] Frontend starts without errors
- [ ] Frontend can connect to backend API
- [ ] Login functionality works
- [ ] Dashboard loads after login
- [ ] No console errors in browser
- [ ] API endpoints respond correctly

---

## Next Steps

Once setup is complete:

1. Read the [Usage Guide](./USAGE_GUIDE.md) to learn how to use the application
2. Review the [README.md](../README.md) for project overview
3. Check the [Checklist.md](../Checklist.md) for development progress
4. Explore the API documentation at `/swagger`
5. Start developing new features!

---

**Last Updated**: 2026-03-03  
**For issues or questions**: [GitHub Issues](https://github.com/luigi043/New-Insurex/issues)
