# 🛠️ InsureX Setup Guide

Complete installation and configuration guide for the InsureX Insurance Management System.

---

## 📚 Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [Database Setup](#database-setup)
5. [Docker Deployment](#docker-deployment)
6. [Troubleshooting](#troubleshooting)

---

## 💻 System Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | Windows 10/11, macOS 11+, Ubuntu 20.04+ |
| **RAM** | 8 GB |
| **Storage** | 10 GB free space |
| **CPU** | 2 cores |
| **Internet** | Required for package downloads |

### Recommended Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | Windows 11, macOS 12+, Ubuntu 22.04+ |
| **RAM** | 16 GB or more |
| **Storage** | 20 GB SSD |
| **CPU** | 4 cores or more |
| **Internet** | High-speed connection |

---

## 📥 Installation Steps

### Step 1: Install Prerequisites

#### Git

**Windows:**
```bash
# Download from https://git-scm.com/download/win
# Or use winget
winget install Git.Git
```

**macOS:**
```bash
# Using Homebrew
brew install git
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install git

# Fedora
sudo dnf install git
```

Verify installation:
```bash
git --version
# Expected output: git version 2.x.x
```

#### Node.js and npm

**Windows:**
```bash
# Download from https://nodejs.org/
# Or use winget
winget install OpenJS.NodeJS.LTS
```

**macOS:**
```bash
# Using Homebrew
brew install node@18
```

**Linux:**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:
```bash
node --version
# Expected: v18.x.x or higher

npm --version
# Expected: 9.x.x or higher
```

#### .NET 8 SDK

**Windows:**
```bash
# Download from https://dotnet.microsoft.com/download/dotnet/8.0
# Or use winget
winget install Microsoft.DotNet.SDK.8
```

**macOS:**
```bash
# Download from https://dotnet.microsoft.com/download/dotnet/8.0
# Or use Homebrew
brew install --cask dotnet-sdk
```

**Linux:**
```bash
# Ubuntu 22.04
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0
```

Verify installation:
```bash
dotnet --version
# Expected: 8.0.x
```

#### SQL Server

**Windows:**

1. Download SQL Server 2019+ Developer Edition from Microsoft
2. Or install SQL Server Express LocalDB:
```bash
# Download from: https://go.microsoft.com/fwlink/?linkid=866658
```

**macOS/Linux:**

Use Docker to run SQL Server:
```bash
docker pull mcr.microsoft.com/mssql/server:2022-latest

docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sql_server \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

Verify SQL Server is running:
```bash
# Windows
sqlcmd -S localhost -U sa -P YourPassword -Q "SELECT @@VERSION"

# macOS/Linux (using Docker)
docker exec -it sql_server /opt/mssql-tools/bin/sqlcmd \
   -S localhost -U sa -P "YourStrong@Passw0rd" \
   -Q "SELECT @@VERSION"
```

#### Docker (Optional but Recommended)

**Windows:**
```bash
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
```

**macOS:**
```bash
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
# Or use Homebrew
brew install --cask docker
```

**Linux:**
```bash
# Ubuntu
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

Verify installation:
```bash
docker --version
# Expected: Docker version 20.x.x or higher

docker-compose --version
# Expected: docker-compose version 1.x.x or higher
```

### Step 2: Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/luigi043/New-Insurex.git

# Or via SSH (if you have SSH key configured)
git clone git@github.com:luigi043/New-Insurex.git

# Navigate to project directory
cd New-Insurex
```

### Step 3: Backend Setup

#### 3.1 Restore NuGet Packages

```bash
# From project root
cd InsureX.API

# Restore packages
dotnet restore

# This will download all required NuGet packages
# Expected output: Restore completed in X ms
```

#### 3.2 Configure Database Connection

Edit `appsettings.Development.json`:

```bash
# Windows (using notepad)
notepad appsettings.Development.json

# macOS
open -e appsettings.Development.json

# Linux
nano appsettings.Development.json
```

Update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

**Connection String Options:**

For **SQL Server Express LocalDB** (Windows):
```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
```

For **SQL Server with username/password**:
```json
"DefaultConnection": "Server=localhost;Database=InsureX_Dev;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True"
```

For **Docker SQL Server** (macOS/Linux):
```json
"DefaultConnection": "Server=localhost,1433;Database=InsureX_Dev;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True"
```

#### 3.3 Apply Database Migrations

```bash
# Make sure you're in InsureX.API directory
cd InsureX.API

# Install EF Core tools globally (if not already installed)
dotnet tool install --global dotnet-ef

# Verify EF Core tools
dotnet ef --version
# Expected: Entity Framework Core .NET Command-line Tools 8.0.x

# Apply migrations to create database
dotnet ef database update --project ../InsureX.Infrastructure

# Expected output:
# Build started...
# Build succeeded.
# Applying migration '20240101_InitialCreate'.
# Done.
```

#### 3.4 Seed Initial Data (Optional)

```bash
# Run the seed tool to populate initial data
cd ../InsureX.SeedTool
dotnet run

# This will create:
# - Admin user (admin@insurex.com / Admin123!)
# - Sample policies, claims, assets
# - Test partners and invoices
```

#### 3.5 Run the Backend API

```bash
# Navigate back to API directory
cd ../InsureX.API

# Run the application
dotnet run

# Expected output:
# info: Microsoft.Hosting.Lifetime[14]
#       Now listening on: https://localhost:7001
# info: Microsoft.Hosting.Lifetime[14]
#       Now listening on: http://localhost:5001
```

**Test the API:**
Open your browser and navigate to:
- Swagger UI: https://localhost:7001/swagger
- Health Check: https://localhost:7001/health

### Step 4: Frontend Setup

Open a **new terminal window/tab**.

#### 4.1 Install Dependencies

```bash
# Navigate to React app directory
cd insurex-react

# Install npm packages
npm install

# This will download all required packages
# Expected output: added XXX packages in XX seconds
```

If you encounter errors, try:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### 4.2 Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file
# Windows
notepad .env

# macOS
open -e .env

# Linux
nano .env
```

Update `.env` with your configuration:

```env
# API Configuration
VITE_API_URL=https://localhost:7001/api

# Application Settings
VITE_APP_NAME=InsureX
VITE_APP_VERSION=1.0.0

# Optional: Enable debug mode
VITE_DEBUG=true
```

#### 4.3 Run the Frontend

```bash
# Start development server
npm run dev

# Expected output:
#   VITE v5.x.x  ready in XXX ms
#
#   ➜  Local:   http://localhost:3000/
#   ➜  Network: use --host to expose
```

**Access the Application:**
Open your browser and navigate to: http://localhost:3000

### Step 5: Verify Installation

#### Backend Verification

1. **Swagger UI**: https://localhost:7001/swagger
   - Should display API documentation
   - Try the `/api/health` endpoint

2. **Database**: 
   ```bash
   # Connect to SQL Server and verify tables exist
   # Windows
   sqlcmd -S localhost -d InsureX_Dev -Q "SELECT COUNT(*) FROM Users"
   
   # Docker
   docker exec -it sql_server /opt/mssql-tools/bin/sqlcmd \
      -S localhost -U sa -P "YourStrong@Passw0rd" \
      -d InsureX_Dev -Q "SELECT COUNT(*) FROM Users"
   ```

3. **Authentication**:
   - Use Swagger UI
   - POST to `/api/auth/login`
   - Body: `{ "email": "admin@insurex.com", "password": "Admin123!" }`
   - Should return a JWT token

#### Frontend Verification

1. **Login Page**: http://localhost:3000
   - Should display the login form
   - No console errors

2. **Login Test**:
   - Email: `admin@insurex.com`
   - Password: `Admin123!`
   - Should redirect to dashboard

3. **Dashboard**:
   - Should display stats cards
   - Navigation menu should work
   - No console errors

---

## ⚙️ Configuration

### Backend Configuration

#### appsettings.json Structure

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Serilog": {
    "MinimumLevel": "Information",
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "File",
        "Args": {
          "path": "logs/insurex-.log",
          "rollingInterval": "Day"
        }
      }
    ]
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-minimum-32-characters-long-for-production",
    "Issuer": "InsureX",
    "Audience": "InsureXClient",
    "ExpirationHours": 24,
    "RefreshTokenExpirationDays": 7
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "noreply@insurex.com",
    "SenderName": "InsureX System",
    "Username": "",
    "Password": "",
    "EnableSsl": true
  },
  "CorsSettings": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://localhost:3000"
    ]
  },
  "RateLimiting": {
    "PermitLimit": 100,
    "Window": 1,
    "QueueLimit": 10
  }
}
```

#### Environment-Specific Configuration

**Development** (`appsettings.Development.json`):
- Detailed logging
- Local database
- Permissive CORS
- Email disabled or using test SMTP

**Production** (`appsettings.Production.json`):
- Minimal logging (errors only)
- Production database with connection pooling
- Strict CORS
- Production email settings
- Strong JWT secret key

### Frontend Configuration

#### Environment Variables

Create `.env.development` for development:
```env
VITE_API_URL=https://localhost:7001/api
VITE_APP_NAME=InsureX (Dev)
VITE_DEBUG=true
```

Create `.env.production` for production:
```env
VITE_API_URL=https://api.insurex.com/api
VITE_APP_NAME=InsureX
VITE_DEBUG=false
```

---

## 🗄️ Database Setup

### Option 1: Using EF Core Migrations (Recommended)

Already covered in Step 3.3 above.

### Option 2: Using SQL Scripts

```bash
# Navigate to database scripts directory
cd database

# Connect to SQL Server
sqlcmd -S localhost -U sa -P YourPassword

# Create database
CREATE DATABASE InsureX_Dev;
GO

# Run initialization scripts (if available)
:r init.sql
GO
```

### Database Schema Overview

The database includes the following main tables:

**Core Tables:**
- `Users` - User accounts
- `Tenants` - Multi-tenant organizations
- `Roles` - User roles

**Business Tables:**
- `Policies` - Insurance policies
- `Claims` - Insurance claims
- `Assets` - Insured assets
- `Partners` - Business partners
- `Invoices` - Billing invoices
- `Payments` - Payment records

**Audit Tables:**
- `AuditLogs` - Change tracking
- `RefreshTokens` - Authentication tokens

### Backup and Restore

**Create Backup:**
```bash
# Using sqlcmd
sqlcmd -S localhost -Q "BACKUP DATABASE InsureX_Dev TO DISK='C:\Backups\InsureX_Dev.bak'"

# Using Docker
docker exec -it sql_server /opt/mssql-tools/bin/sqlcmd \
   -S localhost -U sa -P "YourStrong@Passw0rd" \
   -Q "BACKUP DATABASE InsureX_Dev TO DISK='/var/opt/mssql/backup/InsureX_Dev.bak'"
```

**Restore Backup:**
```bash
sqlcmd -S localhost -Q "RESTORE DATABASE InsureX_Dev FROM DISK='C:\Backups\InsureX_Dev.bak' WITH REPLACE"
```

---

## 🐳 Docker Deployment

### Quick Start with Docker Compose

```bash
# From project root
docker-compose up -d

# This will start:
# - SQL Server on port 1433
# - Backend API on ports 5000/5001
# - Frontend on port 3000
```

### Access Services

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| SQL Server | localhost:1433 |

### Docker Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove volumes (clean slate)
docker-compose down -v
```

### Manual Docker Setup

#### Backend Dockerfile

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["InsureX.API/InsureX.API.csproj", "InsureX.API/"]
RUN dotnet restore "InsureX.API/InsureX.API.csproj"
COPY . .
WORKDIR "/src/InsureX.API"
RUN dotnet build "InsureX.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "InsureX.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "InsureX.API.dll"]
```

#### Frontend Dockerfile

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

#### Build and Run Images

```bash
# Build backend
docker build -t insurex-api -f Dockerfile .

# Build frontend
cd insurex-react
docker build -t insurex-frontend .

# Run backend
docker run -d -p 5000:80 --name insurex-api insurex-api

# Run frontend
docker run -d -p 3000:3000 --name insurex-frontend insurex-frontend
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: "dotnet: command not found"

**Solution:**
```bash
# Verify .NET is in PATH
echo $PATH

# Add to PATH (macOS/Linux)
export PATH="$PATH:/usr/local/share/dotnet"

# Windows: Add to System Environment Variables
# C:\Program Files\dotnet\
```

#### Issue: "Cannot connect to SQL Server"

**Solutions:**

1. **Verify SQL Server is running:**
```bash
# Windows
net start MSSQLSERVER

# Docker
docker ps | grep sql_server
```

2. **Check connection string:**
- Verify server name
- Check credentials
- Ensure TrustServerCertificate=True for local development

3. **Firewall:**
```bash
# Windows: Allow port 1433
netsh advfirewall firewall add rule name="SQL Server" dir=in action=allow protocol=TCP localport=1433
```

#### Issue: "Migration failed"

**Solution:**
```bash
# Drop database and recreate
dotnet ef database drop --project ../InsureX.Infrastructure
dotnet ef database update --project ../InsureX.Infrastructure

# Or manually delete database in SSMS
```

#### Issue: "Frontend can't connect to API (CORS error)"

**Solution:**

1. **Check CORS settings in appsettings.json:**
```json
"CorsSettings": {
  "AllowedOrigins": [
    "http://localhost:3000",
    "https://localhost:3000"
  ]
}
```

2. **Verify API URL in .env:**
```env
VITE_API_URL=https://localhost:7001/api
```

3. **Trust HTTPS certificate (first time):**
```bash
dotnet dev-certs https --trust
```

#### Issue: "npm install fails"

**Solutions:**

1. **Clear cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Use legacy peer deps:**
```bash
npm install --legacy-peer-deps
```

3. **Check Node version:**
```bash
node --version
# Should be 18.x or higher
```

#### Issue: "Port already in use"

**Solution:**

1. **Find process using port:**
```bash
# Windows
netstat -ano | findstr :7001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :7001
kill -9 <PID>
```

2. **Change port in launchSettings.json:**
```json
"applicationUrl": "https://localhost:7002;http://localhost:5002"
```

---

## ✅ Post-Installation Checklist

- [ ] Git installed and configured
- [ ] Node.js 18+ installed
- [ ] .NET 8 SDK installed
- [ ] SQL Server running
- [ ] Repository cloned
- [ ] Backend packages restored
- [ ] Database created and migrated
- [ ] Backend API running on https://localhost:7001
- [ ] Frontend dependencies installed
- [ ] Frontend running on http://localhost:3000
- [ ] Can login with admin credentials
- [ ] Dashboard displays correctly
- [ ] No console errors

---

## 📞 Need Help?

If you encounter issues not covered here:

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more solutions
2. Search existing [GitHub Issues](https://github.com/luigi043/New-Insurex/issues)
3. Create a new issue with:
   - Operating system
   - Software versions
   - Error messages
   - Steps to reproduce

---

**Last Updated**: 2026-03-03  
**Next**: See [USAGE.md](./USAGE.md) for how to use the application
