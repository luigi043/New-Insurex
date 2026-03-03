# 🛠️ InsureX Setup Guide

This comprehensive guide walks you through setting up the InsureX Insurance Management System on different platforms and environments.

---

## 📋 Table of Contents

1. [Windows Setup](#-windows-setup)
2. [macOS Setup](#-macos-setup)
3. [Linux Setup](#-linux-setup)
4. [Docker Setup](#-docker-setup)
5. [Production Deployment](#-production-deployment)
6. [CI/CD Configuration](#-cicd-configuration)
7. [Advanced Configuration](#-advanced-configuration)

---

## 🪟 Windows Setup

### Prerequisites Installation

#### 1. Install .NET 8 SDK

```powershell
# Download from https://dotnet.microsoft.com/download/dotnet/8.0
# Or use winget
winget install Microsoft.DotNet.SDK.8
```

Verify installation:
```powershell
dotnet --version  # Should show 8.0.x
```

#### 2. Install Node.js

```powershell
# Download from https://nodejs.org
# Or use winget
winget install OpenJS.NodeJS.LTS
```

Verify installation:
```powershell
node --version  # Should show v18.x or higher
npm --version   # Should show 9.x or higher
```

#### 3. Install SQL Server

**Option A: SQL Server LocalDB (Recommended for Development)**

```powershell
# Included with Visual Studio 2022
# Or download SQL Server Express with LocalDB
# https://www.microsoft.com/en-us/sql-server/sql-server-downloads

# Start LocalDB
sqllocaldb start MSSQLLocalDB

# Check status
sqllocaldb info
```

**Option B: SQL Server Express**

1. Download from [microsoft.com/sql-server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
2. Choose "Express" edition
3. Select "Basic" installation
4. Note the instance name (usually `localhost\SQLEXPRESS`)

**Option C: SQL Server Developer Edition**

Same as Express but with full features (free for development).

#### 4. Install Git

```powershell
winget install Git.Git
```

#### 5. Install Visual Studio 2022 (Optional but Recommended)

```powershell
winget install Microsoft.VisualStudio.2022.Community
```

During installation, select:
- ASP.NET and web development
- .NET desktop development
- Data storage and processing

### Project Setup

#### 1. Clone Repository

```powershell
# Open PowerShell or Command Prompt
cd C:\Dev  # or your preferred directory

git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex
```

#### 2. Configure Database

**Using LocalDB:**

Update `InsureX.API/appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

**Using SQL Server Express:**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

**Using SQL Server with Authentication:**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;User Id=your_user;Password=your_password;TrustServerCertificate=True"
  }
}
```

#### 3. Setup Backend

```powershell
# Navigate to API project
cd InsureX.API

# Restore NuGet packages
dotnet restore

# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Create and seed database
dotnet ef database update --project ..\InsureX.Infrastructure

# Run the API
dotnet run
```

API will be available at:
- HTTPS: `https://localhost:7001`
- HTTP: `http://localhost:5001`
- Swagger: `https://localhost:7001/swagger`

#### 4. Setup Frontend

Open a **new PowerShell window**:

```powershell
cd C:\Dev\New-Insurex\insurex-react

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### IDE Setup (Visual Studio)

1. Open `InsureX.sln` in Visual Studio 2022
2. Set `InsureX.API` as startup project
3. Press `F5` to run with debugging
4. API will start automatically

For React development:
1. Install VS Code from [code.visualstudio.com](https://code.visualstudio.com)
2. Open the `insurex-react` folder
3. Install recommended extensions:
   - ESLint
   - Prettier
   - TypeScript Vue Plugin (Volar)
   - Material Icon Theme

---

## 🍎 macOS Setup

### Prerequisites Installation

#### 1. Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install .NET 8 SDK

```bash
brew install --cask dotnet-sdk
```

Verify:
```bash
dotnet --version  # Should show 8.0.x
```

#### 3. Install Node.js

```bash
brew install node@18
```

Verify:
```bash
node --version  # Should show v18.x or higher
npm --version   # Should show 9.x or higher
```

#### 4. Install SQL Server

**Option A: SQL Server in Docker (Recommended)**

```bash
# Install Docker Desktop
brew install --cask docker

# Start Docker Desktop, then:
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sql-server \
   -d mcr.microsoft.com/mssql/server:2022-latest

# Verify it's running
docker ps
```

**Option B: Azure SQL Database**

Use a cloud-hosted SQL Database (requires Azure account).

#### 5. Install Git

```bash
brew install git
```

#### 6. Install Azure Data Studio (for database management)

```bash
brew install --cask azure-data-studio
```

### Project Setup

#### 1. Clone Repository

```bash
cd ~/Development  # or your preferred directory

git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex
```

#### 2. Configure Database

Create `InsureX.API/appsettings.Development.json`:

**For Docker SQL Server:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=InsureX_Dev;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "development-secret-key-minimum-32-characters-long-please",
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

#### 3. Setup Backend

```bash
# Navigate to API project
cd InsureX.API

# Restore packages
dotnet restore

# Install EF Core tools
dotnet tool install --global dotnet-ef

# Create database
dotnet ef database update --project ../InsureX.Infrastructure

# Run the API
dotnet run
```

#### 4. Setup Frontend

Open a **new terminal**:

```bash
cd ~/Development/New-Insurex/insurex-react

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### IDE Setup (VS Code)

```bash
# Install VS Code
brew install --cask visual-studio-code

# Open project
cd ~/Development/New-Insurex
code .
```

Install recommended extensions:
- C# Dev Kit
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- REST Client

---

## 🐧 Linux Setup

### Prerequisites Installation (Ubuntu/Debian)

#### 1. Install .NET 8 SDK

```bash
# Add Microsoft package repository
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Install .NET SDK
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0
```

Verify:
```bash
dotnet --version
```

#### 2. Install Node.js

```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:
```bash
node --version
npm --version
```

#### 3. Install Docker

```bash
# Install Docker
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### 4. Install SQL Server in Docker

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sql-server \
   -v sqlserver-data:/var/opt/mssql \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

#### 5. Install Git

```bash
sudo apt-get install -y git
```

### Project Setup

```bash
cd ~/projects

git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex
```

Follow the same configuration steps as macOS setup above.

### Prerequisites Installation (RHEL/CentOS/Fedora)

```bash
# Install .NET 8
sudo dnf install dotnet-sdk-8.0

# Install Node.js
sudo dnf install nodejs

# Install Docker
sudo dnf install docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

---

## 🐳 Docker Setup

### Full Stack with Docker Compose

#### 1. Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose

#### 2. Review docker-compose.yml

The project includes a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      SA_PASSWORD: "YourStrong@Passw0rd"
      ACCEPT_EULA: "Y"
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:80"
      - "5001:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=InsureX;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True
    depends_on:
      - sqlserver

  frontend:
    build:
      context: ./insurex-react
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000/api
    depends_on:
      - backend

volumes:
  sqlserver_data:
```

#### 3. Start All Services

```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

#### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/swagger
- **Database**: localhost:1433

#### 5. Stop Services

```bash
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Individual Docker Containers

#### Backend Only

```bash
# Build image
docker build -t insurex-api -f Dockerfile .

# Run container
docker run -d -p 8080:80 \
  -e ConnectionStrings__DefaultConnection="Server=host.docker.internal;Database=InsureX;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True" \
  --name insurex-api \
  insurex-api
```

#### Frontend Only

```bash
# Navigate to frontend
cd insurex-react

# Build image
docker build -t insurex-frontend .

# Run container
docker run -d -p 3000:3000 \
  -e VITE_API_URL=http://localhost:8080/api \
  --name insurex-frontend \
  insurex-frontend
```

---

## 🚀 Production Deployment

### Prerequisites

- Production SQL Server instance
- Web server (IIS, Nginx, or Apache)
- SSL certificate
- Domain name

### Backend Deployment

#### 1. Publish Application

```bash
cd InsureX.API

# Publish for Linux
dotnet publish -c Release -r linux-x64 --self-contained -o ./publish

# Or for Windows
dotnet publish -c Release -r win-x64 --self-contained -o ./publish
```

#### 2. Configure Production Settings

Create `appsettings.Production.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_PROD_SERVER;Database=InsureX_Prod;User Id=prod_user;Password=SECURE_PASSWORD;Encrypt=True"
  },
  "JwtSettings": {
    "SecretKey": "VERY_SECURE_PRODUCTION_KEY_MINIMUM_32_CHARACTERS_LONG",
    "Issuer": "InsureX",
    "Audience": "InsureXClient",
    "ExpirationHours": "8"
  },
  "Cors": {
    "AllowedOrigins": [
      "https://app.yourcompany.com"
    ]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

#### 3. Deploy to Server

**Using systemd (Linux):**

Create `/etc/systemd/system/insurex-api.service`:

```ini
[Unit]
Description=InsureX API Service
After=network.target

[Service]
Type=notify
WorkingDirectory=/var/www/insurex-api
ExecStart=/var/www/insurex-api/InsureX.API
Restart=always
RestartSec=10
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable insurex-api
sudo systemctl start insurex-api
sudo systemctl status insurex-api
```

**Using IIS (Windows):**

1. Install IIS and ASP.NET Core Hosting Bundle
2. Create new website in IIS Manager
3. Point to publish folder
4. Configure application pool (.NET CLR Version: No Managed Code)

#### 4. Configure Reverse Proxy

**Nginx:**

```nginx
server {
    listen 80;
    server_name api.yourcompany.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourcompany.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Frontend Deployment

#### 1. Build Production Bundle

```bash
cd insurex-react

# Update .env.production
echo "VITE_API_URL=https://api.yourcompany.com/api" > .env.production

# Build
npm run build
```

This creates a `dist/` folder with optimized static files.

#### 2. Deploy Static Files

**Using Nginx:**

```nginx
server {
    listen 80;
    server_name app.yourcompany.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.yourcompany.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/insurex-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Using Apache:**

```apache
<VirtualHost *:443>
    ServerName app.yourcompany.com
    DocumentRoot /var/www/insurex-frontend/dist

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem

    <Directory /var/www/insurex-frontend/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        FallbackResource /index.html
    </Directory>
</VirtualHost>
```

### Database Migration

```bash
# Generate SQL script
cd InsureX.API
dotnet ef migrations script --project ../InsureX.Infrastructure -o migration.sql

# Review and execute script on production database
```

---

## 🔄 CI/CD Configuration

### GitHub Actions

The project includes `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: 8.0.x
      - name: Restore dependencies
        run: dotnet restore
      - name: Build
        run: dotnet build --no-restore
      - name: Test
        run: dotnet test --no-build --verbosity normal

  frontend-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: cd insurex-react && npm ci
      - name: Lint
        run: cd insurex-react && npm run lint
      - name: Build
        run: cd insurex-react && npm run build
```

### Azure DevOps

Create `azure-pipelines.yml`:

```yaml
trigger:
  - main
  - develop

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: Build
    jobs:
      - job: BackendBuild
        steps:
          - task: UseDotNet@2
            inputs:
              version: '8.0.x'
          - script: dotnet build
          - script: dotnet test

      - job: FrontendBuild
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '18.x'
          - script: cd insurex-react && npm ci && npm run build
```

---

## ⚙️ Advanced Configuration

### Environment Variables

#### Backend

All settings can be overridden with environment variables:

```bash
# Connection string
export ConnectionStrings__DefaultConnection="Server=...;Database=..."

# JWT settings
export JwtSettings__SecretKey="your-secret-key"
export JwtSettings__ExpirationHours="24"

# Run application
dotnet run
```

#### Frontend

Create environment-specific files:

- `.env.development` - Development settings
- `.env.staging` - Staging settings
- `.env.production` - Production settings

### Health Checks

Access health endpoints:

- **Liveness**: `https://localhost:7001/health/live`
- **Readiness**: `https://localhost:7001/health/ready`

### Logging Configuration

Configure Serilog in `appsettings.json`:

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning"
      }
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
  }
}
```

### Performance Tuning

#### Backend

```json
{
  "Kestrel": {
    "Limits": {
      "MaxConcurrentConnections": 100,
      "MaxRequestBodySize": 52428800
    }
  }
}
```

#### Frontend

Update `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material']
        }
      }
    }
  }
});
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Use strong JWT secret key (minimum 32 characters)
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Update allowed origins
- [ ] Configure firewall rules
- [ ] Enable database encryption
- [ ] Set up backup strategy
- [ ] Configure monitoring and alerting
- [ ] Review security headers
- [ ] Perform security audit

---

## 📞 Support

If you encounter issues during setup:

1. Check the [Troubleshooting](#) section in ONBOARDING.md
2. Search [GitHub Issues](https://github.com/luigi043/New-Insurex/issues)
3. Contact the development team

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-03  
**Maintained By**: InsureX Development Team
