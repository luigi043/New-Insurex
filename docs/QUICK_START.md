# InsureX Quick Start Guide

Get InsureX running in 5 minutes!

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

---

## Prerequisites

- Node.js 18+
- .NET 8 SDK
- SQL Server (LocalDB, Express, or Docker)

---

## Option 1: Docker (Easiest)

```bash
# Clone repository
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# API: http://localhost:5000/swagger
```

**Default Login**: `admin@insurex.com` / `Admin123!`

---

## Option 2: Manual Setup

### Step 1: Clone & Setup Database

```bash
# Clone
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex

# Start SQL Server (Docker)
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name insurex-sql -d mcr.microsoft.com/mssql/server:2022-latest
```

### Step 2: Start Backend

```bash
# Terminal 1
cd InsureX.API
dotnet restore
dotnet ef database update --project ../InsureX.Infrastructure
dotnet run
```

API available at: `https://localhost:7001/swagger`

### Step 3: Start Frontend

```bash
# Terminal 2
cd insurex-react
npm install
cp .env.example .env
npm run dev
```

Frontend available at: `http://localhost:5173`

---

## Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@insurex.com | Admin123! | Admin |
| manager@insurex.com | Manager123! | Manager |
| agent@insurex.com | Agent123! | Agent |

---

## Key URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 (or 3000) |
| API | https://localhost:7001 |
| Swagger | https://localhost:7001/swagger |
| Health Check | https://localhost:7001/health |

---

## Quick Commands

```bash
# Run backend tests
dotnet test

# Run frontend lint
cd insurex-react && npm run lint

# Build frontend
cd insurex-react && npm run build

# Add database migration
dotnet ef migrations add MigrationName --project InsureX.Infrastructure

# Apply migrations
dotnet ef database update --project InsureX.Infrastructure
```

---

## Need Help?

- [Full Onboarding Guide](./ONBOARDING.md)
- [Usage Guide](./USAGE_GUIDE.md)
- [GitHub Issues](https://github.com/luigi043/New-Insurex/issues)

---

**Happy Coding!**
