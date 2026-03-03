# InsureX Setup Guide

Complete step-by-step setup instructions for the InsureX Insurance Management System.

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Database Setup](#database-setup)
4. [Backend Configuration](#backend-configuration)
5. [Frontend Configuration](#frontend-configuration)
6. [Running the Application](#running-the-application)
7. [Docker Setup](#docker-setup)
8. [Verification](#verification)
9. [Common Setup Issues](#common-setup-issues)

---

## System Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+) |
| **RAM** | 8 GB minimum, 16 GB recommended |
| **Storage** | 10 GB free space |
| **CPU** | Dual-core processor, Quad-core recommended |

### Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | 18.x or higher | Frontend runtime |
| **npm** | 9.x or higher | Package manager |
| **.NET SDK** | 8.0 | Backend framework |
| **SQL Server** | 2019+ or LocalDB | Database |
| **Git** | 2.x or higher | Version control |

---

## Installation Steps

### Step 1: Install Node.js and npm

#### Windows

1. Download installer from [nodejs.org](https://nodejs.org/)
2. Run the installer (choose LTS version)
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### macOS

```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

#### Linux (Ubuntu/Debian)

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

### Step 2: Install .NET 8 SDK

#### Windows

1. Download from [dotnet.microsoft.com](https://dotnet.microsoft.com/download)
2. Run the installer
3. Verify installation:
   ```bash
   dotnet --version
   ```

#### macOS

```bash
# Download and install from Microsoft
# Or use Homebrew
brew install --cask dotnet-sdk

# Verify
dotnet --version
```

#### Linux (Ubuntu/Debian)

```bash
# Add Microsoft package repository
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Install .NET SDK
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0

# Verify
dotnet --version
```

### Step 3: Install SQL Server

#### Windows

**Option 1: SQL Server Express (Recommended for development)**

1. Download [SQL Server 2022 Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
2. Run installer
3. Choose "Basic" installation
4. Note the connection string provided

**Option 2: SQL Server LocalDB**

```bash
# Install via Visual Studio Installer
# Or download SQL Server Express with LocalDB
```

#### macOS / Linux

**Use Docker:**

```bash
# Pull SQL Server image
docker pull mcr.microsoft.com/mssql/server:2022-latest

# Run SQL Server container
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sql-server \
   -d mcr.microsoft.com/mssql/server:2022-latest

# Verify
docker ps
```

### Step 4: Install Git

#### Windows

1. Download from [git-scm.com](https://git-scm.com/)
2. Run installer (use default settings)
3. Verify:
   ```bash
   git --version
   ```

#### macOS

```bash
# Using Homebrew
brew install git

# Verify
git --version
```

#### Linux

```bash
sudo apt-get install git

# Verify
git --version
```

### Step 5: Install Code Editor

**Visual Studio Code (Recommended)**

1. Download from [code.visualstudio.com](https://code.visualstudio.com/)
2. Install recommended extensions:
   - C# Dev Kit
   - ESLint
   - Prettier
   - GitLens
   - Thunder Client

**Visual Studio 2022 (Optional for backend)**

1. Download Community Edition
2. Select workloads:
   - ASP.NET and web development
   - .NET desktop development

---

## Database Setup

### Option 1: Using SQL Server Express

#### 1. Verify SQL Server is Running

**Windows:**
```bash
# Open Services (services.msc)
# Look for "SQL Server (SQLEXPRESS)" or "SQL Server (MSSQLSERVER)"
# Ensure it's running
```

**Docker:**
```bash
docker ps
# Should show sql-server container running
```

#### 2. Test Connection

**Using sqlcmd:**
```bash
# Windows Authentication
sqlcmd -S localhost -E

# SQL Authentication
sqlcmd -S localhost -U sa -P YourStrong@Passw0rd
```

**Using Azure Data Studio or SSMS:**
- Server: `localhost` or `localhost\SQLEXPRESS`
- Authentication: Windows Authentication or SQL Server Authentication
- Click "Connect"

### Option 2: Using LocalDB

```bash
# List LocalDB instances
sqllocaldb info

# Create instance if needed
sqllocaldb create MSSQLLocalDB

# Start instance
sqllocaldb start MSSQLLocalDB

# Get connection info
sqllocaldb info MSSQLLocalDB
```

Connection string for LocalDB:
```
Server=(localdb)\MSSQLLocalDB;Database=InsureX_Dev;Trusted_Connection=True;
```

---

## Backend Configuration

### Step 1: Clone Repository

```bash
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex
```

### Step 2: Restore NuGet Packages

```bash
# Restore all projects
dotnet restore

# Or restore specific project
cd InsureX.API
dotnet restore
```

### Step 3: Configure Connection String

Create `InsureX.API/appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "InsureX-Super-Secret-Key-For-Development-Only-Change-In-Production-32-Chars",
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

**Connection String Examples:**

**Windows Authentication:**
```json
"DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
```

**SQL Authentication:**
```json
"DefaultConnection": "Server=localhost;Database=InsureX_Dev;User Id=sa;Password=YourPassword;TrustServerCertificate=True"
```

**LocalDB:**
```json
"DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=InsureX_Dev;Trusted_Connection=True"
```

**Docker SQL Server:**
```json
"DefaultConnection": "Server=localhost,1433;Database=InsureX_Dev;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True"
```

### Step 4: Install EF Core Tools

```bash
# Install globally
dotnet tool install --global dotnet-ef

# Or update if already installed
dotnet tool update --global dotnet-ef

# Verify
dotnet ef --version
```

### Step 5: Create Database

```bash
cd InsureX.API

# Create migration (if not exists)
dotnet ef migrations add InitialCreate --project ../InsureX.Infrastructure

# Apply migrations to database
dotnet ef database update --project ../InsureX.Infrastructure
```

**Expected Output:**
```
Build started...
Build succeeded.
Applying migration '20240115000000_InitialCreate'.
Done.
```

### Step 6: Seed Initial Data (Optional)

```bash
cd ../InsureX.SeedTool
dotnet run
```

This creates:
- Admin user: `admin@insurex.com` / `Admin123!`
- Sample policies, claims, and partners

---

## Frontend Configuration

### Step 1: Navigate to Frontend Directory

```bash
cd insurex-react
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected Output:**
```
added 1234 packages in 45s
```

### Step 3: Create Environment File

```bash
# Copy example file
cp .env.example .env

# Or create manually
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

**Important:** Ensure `VITE_API_URL` matches your backend URL.

---

## Running the Application

### Method 1: Separate Terminals

#### Terminal 1: Backend

```bash
cd InsureX.API
dotnet run

# Or with hot reload
dotnet watch run
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7001
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5001
```

#### Terminal 2: Frontend

```bash
cd insurex-react
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Method 2: Using Visual Studio

1. Open `InsureX.sln`
2. Set `InsureX.API` as startup project
3. Press F5 or click "Start"
4. In separate terminal, run frontend:
   ```bash
   cd insurex-react
   npm run dev
   ```

### Method 3: Using VS Code

1. Open project folder in VS Code
2. Open integrated terminal
3. Run backend:
   ```bash
   cd InsureX.API
   dotnet watch run
   ```
4. Open new terminal (Ctrl+Shift+`)
5. Run frontend:
   ```bash
   cd insurex-react
   npm run dev
   ```

---

## Docker Setup

### Prerequisites

- Docker Desktop installed
- Docker Compose installed

### Step 1: Build Images

```bash
# Build all services
docker-compose build

# Or build individually
docker build -t insurex-api -f InsureX.API/Dockerfile .
docker build -t insurex-frontend -f insurex-react/Dockerfile .
```

### Step 2: Run Containers

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Step 3: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger
- **SQL Server**: localhost:1433

### Docker Compose Configuration

The `docker-compose.yml` includes:
- SQL Server 2022
- .NET 8 API
- React Frontend

All services are networked and configured automatically.

---

## Verification

### Backend Verification

#### 1. Check API Health

```bash
curl http://localhost:5001/api/health
```

**Expected Response:**
```json
{
  "status": "Healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 2. Access Swagger UI

Open browser: `https://localhost:7001/swagger`

You should see:
- List of all API endpoints
- Authentication section
- Try it out functionality

#### 3. Test Authentication

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@insurex.com",
    "password": "Admin123!"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "abc123...",
  "user": {
    "id": 1,
    "email": "admin@insurex.com",
    "role": "Admin"
  }
}
```

### Frontend Verification

#### 1. Access Application

Open browser: `http://localhost:5173`

You should see:
- Login page
- InsureX branding
- Email and password fields

#### 2. Test Login

- Email: `admin@insurex.com`
- Password: `Admin123!`
- Click "Login"

You should be redirected to the dashboard.

#### 3. Check Console

Open browser DevTools (F12):
- No errors in Console tab
- Network tab shows successful API calls
- Application tab shows tokens in localStorage

### Database Verification

#### Using SSMS or Azure Data Studio

1. Connect to server: `localhost`
2. Expand "Databases"
3. Find "InsureX_Dev"
4. Expand "Tables"

**Expected Tables:**
- Users
- Policies
- Claims
- Assets
- Partners
- Invoices
- RefreshTokens
- Tenants

#### Using SQL Query

```sql
-- Check database exists
SELECT name FROM sys.databases WHERE name = 'InsureX_Dev';

-- Check tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Check admin user
SELECT Id, Email, Role FROM Users WHERE Email = 'admin@insurex.com';
```

---

## Common Setup Issues

### Issue 1: Port Already in Use

**Error:**
```
Failed to bind to address http://localhost:5001: address already in use
```

**Solution:**

**Windows:**
```bash
# Find process using port
netstat -ano | findstr :5001

# Kill process
taskkill /PID <process_id> /F
```

**macOS/Linux:**
```bash
# Find process
lsof -i :5001

# Kill process
kill -9 <process_id>
```

**Or change port** in `launchSettings.json`:
```json
"applicationUrl": "https://localhost:7002;http://localhost:5002"
```

### Issue 2: Database Connection Failed

**Error:**
```
A network-related or instance-specific error occurred while establishing a connection to SQL Server
```

**Solutions:**

1. **Check SQL Server is running:**
   ```bash
   # Windows
   services.msc
   
   # Docker
   docker ps
   ```

2. **Enable TCP/IP:**
   - Open SQL Server Configuration Manager
   - SQL Server Network Configuration → Protocols
   - Enable TCP/IP
   - Restart SQL Server service

3. **Check firewall:**
   ```bash
   # Windows: Allow port 1433
   netsh advfirewall firewall add rule name="SQL Server" dir=in action=allow protocol=TCP localport=1433
   ```

### Issue 3: EF Core Tools Not Found

**Error:**
```
Could not execute because the specified command or file was not found
```

**Solution:**

```bash
# Install EF Core tools
dotnet tool install --global dotnet-ef

# Add to PATH (if needed)
export PATH="$PATH:$HOME/.dotnet/tools"

# Verify
dotnet ef --version
```

### Issue 4: npm Install Fails

**Error:**
```
npm ERR! code EACCES
```

**Solution:**

**Windows:**
```bash
# Run as administrator
# Or clear npm cache
npm cache clean --force
npm install
```

**macOS/Linux:**
```bash
# Fix permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config

# Reinstall
npm install
```

### Issue 5: CORS Error in Browser

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

1. **Check frontend URL** in `appsettings.Development.json`:
   ```json
   "Cors": {
     "AllowedOrigins": [
       "http://localhost:5173"
     ]
   }
   ```

2. **Verify CORS middleware** in `Program.cs`:
   ```csharp
   app.UseCors("AllowReactApp");
   ```

3. **Restart backend** after changes

### Issue 6: JWT Token Invalid

**Error:**
```
401 Unauthorized
```

**Solution:**

1. **Check JWT secret** is at least 32 characters
2. **Clear browser storage:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```
3. **Login again**

### Issue 7: Migration Already Applied

**Error:**
```
The migration '20240115000000_InitialCreate' has already been applied to the database
```

**Solution:**

```bash
# Skip to next step
dotnet ef database update --project ../InsureX.Infrastructure

# Or reset database
dotnet ef database drop --project ../InsureX.Infrastructure
dotnet ef database update --project ../InsureX.Infrastructure
```

---

## Next Steps

After successful setup:

1. **Explore the application**
   - Login with admin credentials
   - Navigate through modules
   - Test creating policies and claims

2. **Review documentation**
   - Read `ONBOARDING.md` for development workflow
   - Check `Checklist.md` for project status
   - Review API documentation in Swagger

3. **Start development**
   - Pick a task from the checklist
   - Create a feature branch
   - Make your first contribution

---

## Support

If you encounter issues not covered here:

1. **Check existing issues**: [GitHub Issues](https://github.com/luigi043/New-Insurex/issues)
2. **Create new issue**: Provide error messages, logs, and steps to reproduce
3. **Review logs**:
   - Backend: `InsureX.API/logs/`
   - Frontend: Browser DevTools Console

---

**Setup complete! You're ready to start developing.**

Last Updated: 2024-01-15
