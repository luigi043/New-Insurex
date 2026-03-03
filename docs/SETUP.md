# InsureX — Setup & Installation Guide

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)  
**Last Updated**: 2026-03-03

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone the Repository](#1-clone-the-repository)
3. [Backend Setup (.NET 8 API)](#2-backend-setup-net-8-api)
4. [Frontend Setup (React + Vite)](#3-frontend-setup-react--vite)
5. [Database Setup (SQL Server)](#4-database-setup-sql-server)
6. [Docker Setup (Optional)](#5-docker-setup-optional)
7. [Verify the Installation](#6-verify-the-installation)
8. [IDE & Editor Configuration](#7-ide--editor-configuration)
9. [Environment Variables Reference](#8-environment-variables-reference)

---

## Prerequisites

Ensure the following tools are installed on your development machine before proceeding.

| Tool | Minimum Version | Download |
|------|----------------|----------|
| **Git** | 2.x | [git-scm.com](https://git-scm.com/) |
| **.NET SDK** | 8.0 | [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet/8.0) |
| **Node.js** | 18.x+ | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x+ | Bundled with Node.js |
| **SQL Server** | 2019+ or LocalDB | [microsoft.com/sql-server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) |
| **Docker** *(optional)* | 24.x+ | [docker.com](https://www.docker.com/products/docker-desktop/) |

### Verify Prerequisites

```bash
# Check installed versions
git --version          # git version 2.x+
dotnet --version       # 8.0.x
node --version         # v18.x+ or v20.x+
npm --version          # 9.x+
docker --version       # Docker version 24.x+ (optional)
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex
```

### Repository Structure (High-Level)

```
New-Insurex/
├── InsureX.API/              # .NET 8 Web API (entry point)
├── InsureX.Application/      # Business logic, services, DTOs
├── InsureX.Domain/           # Domain entities, enums, interfaces
├── InsureX.Infrastructure/   # EF Core, repositories, security
├── InsureX.Shared/           # Shared DTOs and contracts
├── InsureX.Tests/            # xUnit test project
├── InsureX.SeedTool/         # Database seeding utility
├── insurex-react/            # React + Vite frontend
├── IAPR_Web/                 # Legacy ASP.NET Web Forms (reference)
├── IAPR_API/                 # Legacy API (reference)
├── IAPR_Data/                # Legacy data layer (reference)
├── database/                 # SQL migration scripts
├── .github/workflows/        # CI/CD pipeline
├── docker-compose.yml        # Docker orchestration
├── Dockerfile                # Backend Docker image
├── Directory.Packages.props  # Central NuGet package management
└── InsureX.sln               # Visual Studio solution file
```

---

## 2. Backend Setup (.NET 8 API)

### Step 2.1 — Restore NuGet Packages

```bash
# From the repository root
dotnet restore
```

> **Note:** This project uses **Central Package Management** via `Directory.Packages.props`. All NuGet package versions are defined centrally — individual `.csproj` files reference packages without version numbers.

### Step 2.2 — Configure the Connection String

Edit `InsureX.API/appsettings.json` (or create `appsettings.Development.json` for local overrides):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

**Common connection string patterns:**

| Scenario | Connection String |
|----------|------------------|
| **LocalDB** | `Server=(localdb)\\MSSQLLocalDB;Database=InsureX;Trusted_Connection=True;TrustServerCertificate=True` |
| **SQL Server (Windows Auth)** | `Server=localhost;Database=InsureX;Trusted_Connection=True;TrustServerCertificate=True` |
| **SQL Server (SQL Auth)** | `Server=localhost;Database=InsureX;User Id=sa;Password=YourPassword;TrustServerCertificate=True` |
| **Docker SQL Server** | `Server=localhost,1433;Database=InsureX;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True` |

### Step 2.3 — Configure JWT Settings

In `appsettings.json`, update the JWT secret key:

```json
{
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-with-at-least-32-characters-long",
    "Issuer": "InsureX",
    "Audience": "InsureXClient",
    "ExpirationHours": "24"
  }
}
```

> ⚠️ **Security:** For production, store the secret key in environment variables or a secrets manager — never commit real secrets to source control. Use `dotnet user-secrets` for local development:
> ```bash
> cd InsureX.API
> dotnet user-secrets set "JwtSettings:SecretKey" "your-production-secret-key-here"
> ```

### Step 2.4 — Apply Database Migrations

```bash
cd InsureX.API

# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Apply migrations to create/update the database
dotnet ef database update --project ../InsureX.Infrastructure
```

> **Note:** The API also auto-applies pending migrations on startup (see `Program.cs`), so this step is optional if you prefer to let the app handle it.

### Step 2.5 — Run the Backend

```bash
cd InsureX.API
dotnet run
```

The API will start on:
- **HTTPS**: `https://localhost:7001`
- **HTTP**: `http://localhost:5001`

### Step 2.6 — Verify the Backend

Open your browser and navigate to:
- **Swagger UI**: [https://localhost:7001/swagger](https://localhost:7001/swagger)
- **Health Check**: [https://localhost:7001/health](https://localhost:7001/health)
- **Liveness Probe**: [https://localhost:7001/health/live](https://localhost:7001/health/live)
- **Readiness Probe**: [https://localhost:7001/health/ready](https://localhost:7001/health/ready)

---

## 3. Frontend Setup (React + Vite)

### Step 3.1 — Install Dependencies

```bash
cd insurex-react
npm install
```

### Step 3.2 — Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` to point to your running backend:

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

### Step 3.3 — Start the Development Server

```bash
npm run dev
```

The frontend will start on: **http://localhost:3000**

### Step 3.4 — Available NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on all TS/TSX files |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |
| `npm run test` | Run Vitest unit tests |
| `npm run test:coverage` | Run tests with coverage report |

---

## 4. Database Setup (SQL Server)

### Option A: SQL Server LocalDB (Windows)

```bash
# Create a LocalDB instance
sqllocaldb create InsureXDB
sqllocaldb start InsureXDB
```

Connection string: `Server=(localdb)\\MSSQLLocalDB;Database=InsureX;Trusted_Connection=True;TrustServerCertificate=True`

### Option B: SQL Server via Docker

```bash
# Pull and run SQL Server container
docker run -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 \
  --name insurex-sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

Connection string: `Server=localhost,1433;Database=InsureX;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True`

### Option C: Existing SQL Server Instance

Update the connection string in `appsettings.json` to point to your existing SQL Server instance.

### Applying Migrations

```bash
cd InsureX.API
dotnet ef database update --project ../InsureX.Infrastructure
```

### Manual SQL Scripts

If you prefer to run SQL scripts directly, the `database/` directory contains:
- `migration_upgrade.sql` — Creates tables for Claims, and other entities with proper constraints and indexes.

---

## 5. Docker Setup (Optional)

### Full Stack with Docker Compose

```bash
# Build and start all services (API + SQL Server + Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Services started by Docker Compose:**

| Service | Port | Description |
|---------|------|-------------|
| `api` | 5000 (HTTP), 5001 (HTTPS) | .NET 8 Web API |
| `sqlserver` | 1433 | SQL Server 2022 |
| `frontend` | 3000 | React development server |

### Build Individual Images

```bash
# Backend only
docker build -t insurex-api -f Dockerfile .

# Run backend container
docker run -p 8080:8080 insurex-api
```

---

## 6. Verify the Installation

After starting both the backend and frontend, verify everything is working:

### Backend Checks

| Check | URL | Expected |
|-------|-----|----------|
| Swagger UI | https://localhost:7001/swagger | Interactive API docs |
| Health Check | https://localhost:7001/health | `{"status":"Healthy"}` |
| Liveness | https://localhost:7001/health/live | `{"status":"Healthy"}` |
| Readiness | https://localhost:7001/health/ready | `{"status":"Healthy"}` |

### Frontend Checks

| Check | URL | Expected |
|-------|-----|----------|
| App Home | http://localhost:3000 | Login page |
| Dev Server | Terminal output | `VITE vX.X.X ready` |

### Default Login Credentials

| Field | Value |
|-------|-------|
| **Email** | `admin@insurex.com` |
| **Password** | `Admin123!` |

> ⚠️ **Important:** Change the default admin password immediately after first login in any non-development environment.

---

## 7. IDE & Editor Configuration

### Visual Studio 2022+ (Recommended for Backend)

1. Open `InsureX.sln` from the repository root.
2. Set `InsureX.API` as the startup project.
3. Press **F5** to run with debugging.

### Visual Studio Code (Recommended for Frontend)

1. Open the `insurex-react/` folder.
2. Install recommended extensions:
   - **ESLint** — `dbaeumer.vscode-eslint`
   - **Prettier** — `esbenp.prettier-vscode`
   - **TypeScript** — Built-in
   - **Vite** — `antfu.vite`
3. Use the integrated terminal to run `npm run dev`.

### JetBrains Rider (Full-Stack Alternative)

1. Open `InsureX.sln` for backend development.
2. Open `insurex-react/` as a separate project for frontend.

---

## 8. Environment Variables Reference

### Backend (`InsureX.API/appsettings.json`)

| Variable | Description | Default |
|----------|-------------|---------|
| `ConnectionStrings:DefaultConnection` | SQL Server connection string | `Server=localhost;Database=InsureX;...` |
| `JwtSettings:SecretKey` | JWT signing key (min 32 chars) | *(must be set)* |
| `JwtSettings:Issuer` | JWT token issuer | `InsureX` |
| `JwtSettings:Audience` | JWT token audience | `InsureXClient` |
| `JwtSettings:ExpirationHours` | Token expiry in hours | `24` |
| `Cors:AllowedOrigins` | Allowed CORS origins (array) | `["http://localhost:3000", "http://localhost:5173"]` |
| `EmailSettings:SmtpServer` | SMTP server for emails | `smtp.gmail.com` |
| `EmailSettings:SmtpPort` | SMTP port | `587` |
| `Serilog:MinimumLevel:Default` | Logging level | `Information` |

### Frontend (`insurex-react/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_API_TIMEOUT` | HTTP request timeout (ms) | `30000` |
| `VITE_TOKEN_KEY` | localStorage key for access token | `accessToken` |
| `VITE_REFRESH_TOKEN_KEY` | localStorage key for refresh token | `refreshToken` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics feature | `true` |
| `VITE_ENABLE_NOTIFICATIONS` | Enable notification system | `true` |
| `VITE_MAX_FILE_SIZE` | Max upload file size (bytes) | `10485760` (10 MB) |
| `VITE_ALLOWED_FILE_TYPES` | Allowed upload file extensions | `.jpg,.jpeg,.png,.pdf,.doc,.docx` |
| `VITE_DEFAULT_PAGE_SIZE` | Default pagination page size | `10` |

---

## Next Steps

Once your environment is running:

1. 📖 Read the **[Getting Started Guide](./GETTING_STARTED.md)** for a walkthrough of the application.
2. 🏗️ Read the **[Architecture Guide](./ARCHITECTURE.md)** to understand the codebase structure.
3. 🔌 Read the **[API Guide](./API_GUIDE.md)** for endpoint documentation and usage.
4. 🤝 Read the **[Contributing Guide](./CONTRIBUTING.md)** before making changes.
5. 🔧 Read the **[Troubleshooting Guide](./TROUBLESHOOTING.md)** if you encounter issues.
