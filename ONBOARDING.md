# 🚀 InsureX Onboarding Guide

Welcome to the **InsureX Insurance Management System**! This guide will help you get up and running quickly, whether you're a developer, tester, or stakeholder.

---

## 📑 Table of Contents

1. [Quick Start (5 minutes)](#-quick-start-5-minutes)
2. [Prerequisites](#-prerequisites)
3. [Detailed Setup](#-detailed-setup)
4. [Project Overview](#-project-overview)
5. [Development Workflow](#-development-workflow)
6. [Testing Guide](#-testing-guide)
7. [Common Tasks](#-common-tasks)
8. [Troubleshooting](#-troubleshooting)
9. [Additional Resources](#-additional-resources)

---

## ⚡ Quick Start (5 minutes)

The fastest way to get InsureX running on your machine:

### Step 1: Clone the Repository
```bash
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex
```

### Step 2: Start the Backend
```bash
# Navigate to API project
cd InsureX.API

# Restore dependencies
dotnet restore

# Update connection string in appsettings.json if needed
# Default: Server=localhost;Database=InsureX;Trusted_Connection=True

# Apply database migrations
dotnet ef database update --project ../InsureX.Infrastructure

# Run the API
dotnet run
```

✅ **Backend running at**: `https://localhost:7001` and `http://localhost:5001`  
✅ **Swagger UI**: `https://localhost:7001/swagger`

### Step 3: Start the Frontend (New Terminal)
```bash
# Navigate to React app
cd insurex-react

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

✅ **Frontend running at**: `http://localhost:5173`

### Step 4: Login
Navigate to `http://localhost:5173` and login with:
- **Email**: `admin@insurex.com`
- **Password**: `Admin123!`

🎉 **You're all set!** The application is now running.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software | Version | Download Link | Purpose |
|----------|---------|---------------|---------|
| **Node.js** | 18.x or higher | [nodejs.org](https://nodejs.org) | Frontend development |
| **npm** | 9.x or higher | Included with Node.js | Package management |
| **.NET SDK** | 8.0 | [dotnet.microsoft.com](https://dotnet.microsoft.com/download) | Backend development |
| **SQL Server** | 2019+ or LocalDB | [microsoft.com/sql-server](https://www.microsoft.com/sql-server) | Database |
| **Git** | Latest | [git-scm.com](https://git-scm.com) | Version control |

### Optional (Recommended)

| Software | Purpose |
|----------|---------|
| **Visual Studio 2022** or **VS Code** | IDE/Code Editor |
| **SQL Server Management Studio** or **Azure Data Studio** | Database management |
| **Postman** or **Insomnia** | API testing |
| **Docker Desktop** | Containerized deployment |

### Verify Installation

```bash
# Check Node.js
node --version  # Should be v18.x or higher

# Check npm
npm --version   # Should be 9.x or higher

# Check .NET
dotnet --version  # Should be 8.0.x

# Check SQL Server (Windows)
sqllocaldb info

# Check Git
git --version
```

---

## 🔧 Detailed Setup

### 1. Database Setup

#### Option A: SQL Server LocalDB (Windows)

```bash
# Start LocalDB
sqllocaldb start MSSQLLocalDB

# Create database (done automatically by EF migrations)
cd InsureX.API
dotnet ef database update --project ../InsureX.Infrastructure
```

#### Option B: SQL Server Express/Standard

1. Open `InsureX.API/appsettings.json`
2. Update the connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=InsureX;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True"
  }
}
```

3. Apply migrations:
```bash
cd InsureX.API
dotnet ef database update --project ../InsureX.Infrastructure
```

#### Option C: Docker SQL Server

```bash
# Start SQL Server container
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sql-server \
   -d mcr.microsoft.com/mssql/server:2022-latest

# Update connection string to:
# Server=localhost,1433;Database=InsureX;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True
```

### 2. Backend Configuration

#### Update `appsettings.Development.json`

Create this file in `InsureX.API/` if it doesn't exist:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
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
  },
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information"
    }
  }
}
```

#### Seed Initial Data

```bash
cd InsureX.API
dotnet run --seed
```

This creates:
- Admin user: `admin@insurex.com` / `Admin123!`
- Manager user: `manager@insurex.com` / `Manager123!`
- Sample policies, claims, and assets

### 3. Frontend Configuration

#### Update `.env` file in `insurex-react/`

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

### 4. Install Dependencies

#### Backend
```bash
# From root directory
dotnet restore

# Or from specific project
cd InsureX.API
dotnet restore
```

#### Frontend
```bash
cd insurex-react
npm install
```

---

## 📚 Project Overview

### Architecture

InsureX follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│          Presentation Layer              │
│  (insurex-react - React + TypeScript)   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           API Layer                      │
│     (InsureX.API - Controllers)         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Application Layer                  │
│  (InsureX.Application - Services/DTOs)  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Domain Layer                     │
│   (InsureX.Domain - Entities/Logic)     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Infrastructure Layer                │
│ (InsureX.Infrastructure - Data/Services)│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           Database                       │
│      (SQL Server - InsureX)             │
└─────────────────────────────────────────┘
```

### Key Modules

| Module | Description | Status |
|--------|-------------|--------|
| **Authentication** | JWT-based auth with refresh tokens | ✅ Complete |
| **Policies** | Policy lifecycle management | ✅ Backend Complete |
| **Claims** | Claims processing workflow | ✅ Backend Complete |
| **Assets** | Multi-category asset tracking | ✅ Backend Complete |
| **Partners** | Partner/broker management | ✅ Backend Complete |
| **Billing** | Invoice and payment processing | ✅ Backend Complete |
| **Multi-tenancy** | Tenant isolation | ✅ Complete |
| **Audit Trail** | Change tracking | ✅ Complete |

### Technology Stack

#### Backend
- **.NET 8** - Latest LTS framework
- **Entity Framework Core** - ORM
- **SQL Server** - Database
- **JWT** - Authentication
- **Serilog** - Structured logging
- **Swagger** - API documentation
- **xUnit** - Testing framework

#### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

---

## 🔄 Development Workflow

### Daily Workflow

#### 1. Pull Latest Changes
```bash
git checkout main
git pull origin main
```

#### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# Or for bug fixes
git checkout -b fix/bug-description
```

#### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd InsureX.API
dotnet watch run
```

**Terminal 2 - Frontend:**
```bash
cd insurex-react
npm run dev
```

#### 4. Make Changes
- Write code following project conventions
- Test your changes locally
- Ensure code compiles without errors

#### 5. Test Your Changes
```bash
# Backend tests
cd InsureX.API
dotnet test

# Frontend linting
cd insurex-react
npm run lint
```

#### 6. Commit Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

#### 7. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

### Code Review Checklist

Before submitting a PR, ensure:
- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] No linting errors
- [ ] Code follows project conventions
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] No sensitive data committed

---

## 🧪 Testing Guide

### Backend Testing

#### Run All Tests
```bash
cd InsureX.Tests
dotnet test
```

#### Run Specific Test Class
```bash
dotnet test --filter "FullyQualifiedName~PolicyServiceTests"
```

#### Run with Coverage
```bash
dotnet test --collect:"XPlat Code Coverage"
```

#### Generate Coverage Report
```bash
dotnet tool install -g dotnet-reportgenerator-globaltool
reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:"coveragereport" -reporttypes:Html
```

### Frontend Testing

#### Run Tests (when implemented)
```bash
cd insurex-react
npm run test
```

#### Run with UI
```bash
npm run test:ui
```

#### E2E Tests with Cypress
```bash
npx cypress open
```

### Manual Testing

#### Test User Accounts

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@insurex.com | Admin123! | Full access |
| Manager | manager@insurex.com | Manager123! | Manage policies/claims |
| Agent | agent@insurex.com | Agent123! | Create policies |
| Viewer | viewer@insurex.com | Viewer123! | Read-only |

#### Test Scenarios

**Policy Management:**
1. Create a new policy
2. Activate the policy
3. Submit a claim against it
4. Approve/reject the claim
5. Renew the policy

**Asset Tracking:**
1. Add a new asset (e.g., Real Estate)
2. Update valuation
3. Schedule inspection
4. View asset history

**Partner Management:**
1. Register new partner
2. Configure commission structure
3. Assign policies
4. View performance metrics

---

## 📝 Common Tasks

### Adding a New Feature

#### Backend

1. **Create Entity** (if needed) in `InsureX.Domain/Entities/`
```csharp
public class YourEntity : BaseEntity
{
    public string Name { get; set; }
    // ... other properties
}
```

2. **Add DbSet** in `InsureX.Infrastructure/Data/ApplicationDbContext.cs`
```csharp
public DbSet<YourEntity> YourEntities { get; set; }
```

3. **Create Migration**
```bash
cd InsureX.API
dotnet ef migrations add AddYourEntity --project ../InsureX.Infrastructure
dotnet ef database update --project ../InsureX.Infrastructure
```

4. **Create DTOs** in `InsureX.Application/DTOs/`
```csharp
public class YourEntityDto
{
    public int Id { get; set; }
    public string Name { get; set; }
}
```

5. **Create Service** in `InsureX.Application/Services/`
```csharp
public interface IYourEntityService
{
    Task<List<YourEntityDto>> GetAllAsync();
    // ... other methods
}
```

6. **Create Controller** in `InsureX.API/Controllers/`
```csharp
[ApiController]
[Route("api/[controller]")]
public class YourEntitiesController : ControllerBase
{
    // ... implementation
}
```

#### Frontend

1. **Create Type** in `insurex-react/src/types/`
```typescript
export interface YourEntity {
  id: number;
  name: string;
  // ... other properties
}
```

2. **Create Service** in `insurex-react/src/services/`
```typescript
export const yourEntityService = {
  getAll: () => api.get<YourEntity[]>('/yourentities'),
  getById: (id: number) => api.get<YourEntity>(`/yourentities/${id}`),
  // ... other methods
};
```

3. **Create Hook** in `insurex-react/src/hooks/`
```typescript
export const useYourEntities = () => {
  const [entities, setEntities] = useState<YourEntity[]>([]);
  // ... implementation
};
```

4. **Create Page** in `insurex-react/src/pages/`
```typescript
export const YourEntitiesPage: React.FC = () => {
  // ... implementation
};
```

### Database Migrations

#### Create Migration
```bash
cd InsureX.API
dotnet ef migrations add MigrationName --project ../InsureX.Infrastructure
```

#### Apply Migration
```bash
dotnet ef database update --project ../InsureX.Infrastructure
```

#### Rollback Migration
```bash
dotnet ef database update PreviousMigrationName --project ../InsureX.Infrastructure
```

#### Remove Last Migration
```bash
dotnet ef migrations remove --project ../InsureX.Infrastructure
```

#### Generate SQL Script
```bash
dotnet ef migrations script --project ../InsureX.Infrastructure -o migration.sql
```

### Adding New Dependencies

#### Backend
```bash
cd InsureX.API  # or appropriate project
dotnet add package PackageName
```

#### Frontend
```bash
cd insurex-react
npm install package-name

# For dev dependencies
npm install -D package-name
```

---

## 🔍 Troubleshooting

### Common Issues

#### Issue: Backend won't start

**Error**: `Unable to connect to database`

**Solution**:
1. Check SQL Server is running:
```bash
sqllocaldb info
sqllocaldb start MSSQLLocalDB
```

2. Verify connection string in `appsettings.json`
3. Run migrations:
```bash
dotnet ef database update --project ../InsureX.Infrastructure
```

---

**Error**: `Port 5001 already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID [PID] /F

# Linux/Mac
lsof -i :5001
kill -9 [PID]
```

---

#### Issue: Frontend build fails

**Error**: `Module not found`

**Solution**:
```bash
cd insurex-react
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

**Error**: `TypeScript errors`

**Solution**:
```bash
# Check TypeScript version
npm list typescript

# Run type check
npm run type-check

# Fix auto-fixable issues
npm run lint -- --fix
```

---

#### Issue: Database migration fails

**Error**: `The migration 'XXX' has already been applied`

**Solution**:
```bash
# Check migration history
dotnet ef migrations list --project ../InsureX.Infrastructure

# Remove migration from database (if needed)
dotnet ef database update PreviousMigration --project ../InsureX.Infrastructure

# Remove migration file
dotnet ef migrations remove --project ../InsureX.Infrastructure
```

---

#### Issue: CORS errors in browser

**Error**: `Access to fetch at '...' has been blocked by CORS policy`

**Solution**:
1. Check frontend URL is in `appsettings.json`:
```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173"
    ]
  }
}
```

2. Restart backend server

---

#### Issue: JWT token expired

**Error**: `401 Unauthorized`

**Solution**:
1. Frontend should auto-refresh tokens
2. If not working, clear local storage and login again
3. Check token expiration in `appsettings.json`

---

### Getting Help

1. **Check existing documentation**:
   - [README.md](README.md)
   - [notes.md](notes.md) - Command reference
   - [Checklist.md](Checklist.md) - Progress tracking

2. **Search GitHub Issues**: [github.com/luigi043/New-Insurex/issues](https://github.com/luigi043/New-Insurex/issues)

3. **Ask the team**: Contact project maintainers

4. **Stack Overflow**: Search for similar issues

---

## 📖 Additional Resources

### Learning Resources

#### .NET & C#
- [.NET 8 Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

#### React & TypeScript
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI](https://mui.com)

#### Tools
- [Git Documentation](https://git-scm.com/doc)
- [Docker Documentation](https://docs.docker.com)
- [Postman Learning Center](https://learning.postman.com)

### Project-Specific Documentation

- **API Documentation**: `https://localhost:7001/swagger`
- **Architecture Diagram**: See [README.md](README.md)
- **Database Schema**: Check migrations in `InsureX.Infrastructure/Migrations/`

### Code Conventions

#### Naming Conventions
- **C# Classes**: PascalCase (e.g., `PolicyService`)
- **C# Methods**: PascalCase (e.g., `GetPolicyById`)
- **C# Variables**: camelCase (e.g., `policyId`)
- **TypeScript Components**: PascalCase (e.g., `PolicyList`)
- **TypeScript Functions**: camelCase (e.g., `fetchPolicies`)
- **TypeScript Files**: kebab-case (e.g., `policy-list.tsx`)

#### File Organization
```
Backend:
- Controllers: API endpoints
- Services: Business logic
- Repositories: Data access
- DTOs: Data transfer objects
- Entities: Domain models

Frontend:
- components/: Reusable UI components
- pages/: Route components
- services/: API calls
- hooks/: Custom React hooks
- types/: TypeScript definitions
- utils/: Utility functions
```

---

## 🎯 Next Steps

Now that you're set up, here are some suggested next steps:

### For New Developers

1. **Explore the codebase**:
   - Read through key files in `InsureX.API/Controllers/`
   - Review React components in `insurex-react/src/components/`
   - Understand the data models in `InsureX.Domain/Entities/`

2. **Run the application**:
   - Create a test policy
   - Submit a claim
   - Explore the admin dashboard

3. **Pick a starter task**:
   - Check [Checklist.md](Checklist.md) for uncompleted tasks
   - Look for "good first issue" labels in GitHub Issues
   - Fix a minor bug or add a small feature

### For Contributors

1. **Review the development checklist**: [Checklist.md](Checklist.md)
2. **Check priority tasks**: See "Next Priorities" section
3. **Set up your development environment fully**
4. **Join team discussions**

### For Stakeholders

1. **Review the README**: [README.md](README.md)
2. **Explore the live application**
3. **Review progress**: [Checklist.md](Checklist.md)
4. **Provide feedback**

---

## 🎉 Welcome to the Team!

You're now ready to start contributing to InsureX! If you have any questions or run into issues, don't hesitate to:

- Open a GitHub Issue
- Contact the project maintainers
- Check the troubleshooting section above

**Happy coding!** 🚀

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-03  
**Maintained By**: InsureX Development Team
