# InsureX Onboarding Guide

Welcome to InsureX! This guide will help you get up and running quickly.

---

## Quick Start (5 Minutes)

### 1. Clone & Setup
```bash
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex
```

### 2. Start Backend
```bash
cd InsureX.API
dotnet restore
dotnet run
```
- API: `https://localhost:7001`
- Swagger: `https://localhost:7001/swagger`

### 3. Start Frontend (new terminal)
```bash
cd insurex-react
npm install
cp .env.example .env
npm run dev
```
- App: `http://localhost:3000`

### 4. Login
- **Email**: `admin@insurex.com`
- **Password**: `Admin123!`

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| .NET SDK | 8.0 |
| SQL Server | 2019+ |
| npm | Latest |

---

## Project Structure

```
insurex-react/     # React frontend (Vite + TypeScript + MUI)
InsureX.API/       # Web API layer
InsureX.Application/ # Business logic
InsureX.Domain/    # Entities & domain models
InsureX.Infrastructure/ # EF Core, repositories
InsureX.Tests/     # Unit tests
```

---

## Environment Setup

### Backend Connection String
Edit `InsureX.API/appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

### Frontend Environment
Edit `insurex-react/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

---

## Docker Setup (Alternative)

```bash
docker-compose up -d
```

Services:
- Frontend: `http://localhost:3000`
- API: `http://localhost:5000`
- SQL Server: `localhost:1433`

---

## Database Migrations

```bash
# Add migration
dotnet ef migrations add Init --project ../InsureX.Infrastructure

# Apply migrations
dotnet ef database update --project ../InsureX.Infrastructure
```

---

## Key Features

| Module | Description |
|--------|-------------|
| **Policies** | Full lifecycle: Draft → Active → Expired |
| **Claims** | Submit → Review → Approve/Reject → Pay |
| **Assets** | 11 types: Vehicle, Property, Health, etc. |
| **Partners** | Agencies, Brokers, Insurers |
| **Billing** | Invoices, Payments, Transactions |

---

## User Roles

| Role | Access Level |
|------|-------------|
| Admin | Full system access |
| Manager | Policies, Claims, Reports |
| Insurer | Process claims, manage policies |
| Broker/Agent | Create policies, submit claims |
| Accountant | Invoices, payments |
| Viewer | Read-only |

---

## Common Tasks

### Run Tests
```bash
# Backend
dotnet test

# Frontend
cd insurex-react && npm test
```

### Build for Production
```bash
# Backend
dotnet publish -c Release

# Frontend
cd insurex-react && npm run build
```

---

## Troubleshooting

**Port in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

**Clear caches:**
```bash
# npm
rm -rf node_modules package-lock.json && npm install

# .NET
dotnet nuget locals all --clear
```

---

## Resources

- GitHub: https://github.com/luigi043/New-Insurex
- Swagger API Docs: `/swagger`
- Full Documentation: See `README.md` and `notes.md`

---

# Usage Guide

## Using the Application

### Login Flow
1. Navigate to `http://localhost:3000`
2. Enter credentials: `admin@insurex.com` / `Admin123!`
3. You'll be redirected to the dashboard

### Navigation
- **Dashboard**: Overview with stats and quick actions
- **Policies**: Manage insurance policies (CRUD)
- **Claims**: Process insurance claims
- **Assets**: Track insured assets
- **Partners**: Manage agencies/brokers
- **Billing**: Handle invoices and payments
- **Settings**: System configuration (admin only)

### Creating a Policy
1. Go to Policies → Click "New Policy"
2. Fill in: Policy Type, Holder, Coverage, Premium
3. Save as Draft → Activate when ready

### Processing a Claim
1. Claims appear in queue
2. Review details and documents
3. Approve or Reject with notes
4. Mark as Paid after approval

### API Authentication
```bash
# Get token
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@insurex.com","password":"Admin123!"}'

# Use token
curl -H "Authorization: Bearer <token>" \
  http://localhost:5001/api/policies
```

---

## Development Workflow

### Creating a Feature
```bash
# 1. Create branch
git checkout -b feature/my-feature

# 2. Make changes
# ...

# 3. Commit
git add .
git commit -m "feat: add my feature"

# 4. Push
git push origin feature/my-feature
```

### Code Standards
- Use meaningful variable names
- Add TypeScript types
- Follow existing patterns in codebase
- Run linting before committing

---

**Need Help?** Check the main `README.md` or `notes.md` for detailed documentation.
