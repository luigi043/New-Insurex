# InsureX Onboarding Guide

Welcome to the InsureX Insurance Management System! This guide will help you get started with the project, whether you're a developer, tester, or stakeholder.

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Development Environment Setup](#development-environment-setup)
5. [Architecture Overview](#architecture-overview)
6. [Project Structure](#project-structure)
7. [Development Workflow](#development-workflow)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)
10. [Resources](#resources)

---

## Project Overview

### What is InsureX?

InsureX is a modern, full-stack insurance management platform designed to streamline:

- **Policy Management**: Complete lifecycle from draft to renewal
- **Claims Processing**: Automated workflow with state transitions
- **Asset Tracking**: 11+ asset types across multiple categories
- **Partner Management**: Agencies, brokers, insurers, and service providers
- **Billing & Invoicing**: Automated invoice generation and payment tracking
- **Multi-tenancy**: Isolated tenant data with global query filters

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript + Material-UI + Vite |
| **Backend** | .NET 8 Web API + Clean Architecture |
| **Database** | SQL Server 2019+ |
| **Authentication** | JWT with refresh tokens |
| **ORM** | Entity Framework Core |
| **Logging** | Serilog |
| **API Docs** | Swagger/OpenAPI |

### Key Features

- Role-Based Access Control (6 user roles)
- Workflow state machines for policies and claims
- Audit trail for all entities
- Soft delete pattern
- Rate limiting (100 req/min)
- Security headers (XSS, CSRF protection)
- Responsive Material-UI design

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | 18.x or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | Latest (comes with Node.js) | - |
| **.NET SDK** | 8.0 | [dotnet.microsoft.com](https://dotnet.microsoft.com/download) |
| **SQL Server** | 2019+ or LocalDB | [microsoft.com/sql-server](https://www.microsoft.com/sql-server) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **Visual Studio Code** | Latest (recommended) | [code.visualstudio.com](https://code.visualstudio.com/) |

### Optional Tools

- **Visual Studio 2022** (for backend development)
- **SQL Server Management Studio** (SSMS)
- **Postman** (for API testing)
- **Docker Desktop** (for containerized deployment)

### Verify Installation

Run these commands to verify your setup:

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
# Expected: 2.x.x or higher
```

---

## Quick Start

Get the project running in **5 minutes**:

### Step 1: Clone the Repository

```bash
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex
```

### Step 2: Setup Backend

```bash
# Navigate to API project
cd InsureX.API

# Restore NuGet packages
dotnet restore

# Update appsettings.Development.json with your SQL Server connection string
# Example: "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"

# Apply database migrations
dotnet ef database update --project ../InsureX.Infrastructure

# Run the API
dotnet run
```

**Backend will run at:**
- HTTPS: `https://localhost:7001`
- HTTP: `http://localhost:5001`
- Swagger: `https://localhost:7001/swagger`

### Step 3: Setup Frontend (New Terminal)

```bash
# Navigate to React app
cd insurex-react

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set API URL
# VITE_API_URL=http://localhost:5001/api

# Start development server
npm run dev
```

**Frontend will run at:** `http://localhost:5173`

### Step 4: Access the Application

1. Open browser to `http://localhost:5173`
2. Default credentials:
   - **Email**: `admin@insurex.com`
   - **Password**: `Admin123!`

---

## Development Environment Setup

### Backend Setup (Detailed)

#### 1. Configure Database Connection

Edit `InsureX.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

**Connection String Options:**

- **Windows Authentication**: `Trusted_Connection=True`
- **SQL Authentication**: `User Id=sa;Password=YourPassword`
- **LocalDB**: `Server=(localdb)\\mssqllocaldb;Database=InsureX_Dev;Trusted_Connection=True`

#### 2. Configure JWT Settings

Edit `InsureX.API/appsettings.Development.json`:

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

**Important**: Change `SecretKey` to a secure random string in production.

#### 3. Run Database Migrations

```bash
cd InsureX.API

# Create initial migration (if not exists)
dotnet ef migrations add InitialCreate --project ../InsureX.Infrastructure

# Apply migrations to database
dotnet ef database update --project ../InsureX.Infrastructure

# Verify database was created
# Use SSMS or Azure Data Studio to connect and check
```

#### 4. Seed Initial Data (Optional)

```bash
cd InsureX.SeedTool
dotnet run
```

This will create:
- Default admin user
- Sample policies
- Sample claims
- Sample partners

#### 5. Run the API

```bash
cd InsureX.API
dotnet run

# Or with hot reload
dotnet watch run
```

### Frontend Setup (Detailed)

#### 1. Install Dependencies

```bash
cd insurex-react
npm install
```

#### 2. Configure Environment Variables

Create `.env` file:

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

#### 3. Run Development Server

```bash
npm run dev
```

#### 4. Build for Production

```bash
npm run build
```

Build output will be in `dist/` folder.

### IDE Setup

#### Visual Studio Code (Recommended for Frontend)

**Recommended Extensions:**

1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **TypeScript Vue Plugin (Volar)** - TypeScript support
4. **Material Icon Theme** - File icons
5. **GitLens** - Git integration
6. **Thunder Client** - API testing

**Settings (`.vscode/settings.json`):**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "eslint.validate": ["javascript", "typescript", "typescriptreact"]
}
```

#### Visual Studio 2022 (Recommended for Backend)

**Recommended Extensions:**

1. **ReSharper** (optional, paid)
2. **CodeMaid** - Code cleanup
3. **Productivity Power Tools**

**Settings:**
- Enable "Hot Reload on File Save"
- Set startup project to `InsureX.API`
- Configure multiple startup projects (API + React)

---

## Architecture Overview

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│                   (InsureX.API)                              │
│  Controllers, Middleware, Filters, DTOs                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│                 (InsureX.Application)                         │
│  Services, Commands, Queries, Validators, Interfaces         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                       │
│                (InsureX.Infrastructure)                       │
│  DbContext, Repositories, Security, External Services        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Domain Layer                            │
│                   (InsureX.Domain)                            │
│  Entities, Enums, Value Objects, Domain Events               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Request
    │
    ▼
React Component
    │
    ▼
API Service (Axios)
    │
    ▼
API Controller
    │
    ▼
Application Service
    │
    ▼
Repository
    │
    ▼
Database (SQL Server)
    │
    ▼
Response back through layers
```

### Authentication Flow

```
1. User Login → AuthController.Login()
2. Validate credentials → AuthService.Login()
3. Generate JWT + Refresh Token → JwtService
4. Store refresh token in DB
5. Return tokens to client
6. Client stores in localStorage
7. Subsequent requests include JWT in Authorization header
8. API validates JWT → JwtBearerMiddleware
9. Token expires → Client uses refresh token
10. Get new JWT → AuthController.Refresh()
```

---

## Project Structure

### Backend Structure

```
InsureX.API/                          # API Layer
├── Controllers/                      # API endpoints
│   ├── AuthController.cs            # Authentication
│   ├── PoliciesController.cs        # Policy management
│   ├── ClaimsController.cs          # Claims processing
│   ├── AssetsController.cs          # Asset management
│   ├── PartnersController.cs        # Partner management
│   ├── InvoicesController.cs        # Billing
│   ├── DashboardController.cs       # Dashboard stats
│   └── ReportsController.cs         # Reporting
├── Middleware/                       # Custom middleware
│   ├── ExceptionHandlingMiddleware.cs
│   ├── RateLimitingMiddleware.cs
│   ├── SecurityHeadersMiddleware.cs
│   └── TenantResolutionMiddleware.cs
├── appsettings.json                 # Configuration
├── appsettings.Development.json     # Dev config
└── Program.cs                       # App entry point

InsureX.Application/                  # Business Logic
├── Services/                         # Application services
│   ├── AuthService.cs
│   ├── PolicyService.cs
│   ├── ClaimService.cs
│   ├── AssetService.cs
│   ├── PartnerService.cs
│   └── InvoiceService.cs
├── DTOs/                            # Data Transfer Objects
│   ├── Auth/
│   ├── Policy/
│   ├── Dashboard/
│   └── Filters/
├── Interfaces/                      # Service contracts
└── Validators/                      # FluentValidation

InsureX.Domain/                      # Domain Layer
├── Entities/                        # Domain entities
│   ├── User.cs
│   ├── Policy.cs
│   ├── Claim.cs
│   ├── Asset.cs
│   ├── Partner.cs
│   ├── Invoice.cs
│   └── Tenant.cs
├── Enums/                          # Enumerations
│   ├── PolicyEnums.cs
│   ├── ClaimEnums.cs
│   └── UserEnums.cs
├── ValueObjects/                   # Value objects
│   ├── Money.cs
│   ├── PolicyNumber.cs
│   └── DateRange.cs
└── Interfaces/                     # Repository contracts

InsureX.Infrastructure/             # Infrastructure
├── Context/
│   └── ApplicationDbContext.cs    # EF Core context
├── Repositories/                  # Data access
│   ├── PolicyRepository.cs
│   ├── ClaimRepository.cs
│   └── ...
├── Security/
│   ├── JwtService.cs             # JWT generation
│   └── PasswordHasher.cs         # Password hashing
└── Reporting/
    └── ReportQueries.cs          # Complex queries
```

### Frontend Structure

```
insurex-react/
├── public/                          # Static assets
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/                  # Reusable components
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── Layout/
│   │   │   ├── AppBar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── Common/
│   │   │   ├── DataTable.tsx
│   │   │   ├── FormField.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── Notifications/
│   │       └── NotificationSnackbar.tsx
│   ├── pages/                       # Page components
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.tsx
│   │   ├── policies/
│   │   │   ├── PolicyList.tsx
│   │   │   ├── PolicyForm.tsx
│   │   │   └── PolicyDetails.tsx
│   │   ├── Claims/
│   │   ├── Assets/
│   │   ├── partners/
│   │   ├── Billing/
│   │   └── Reports/
│   ├── hooks/                       # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── usePolicies.ts
│   │   ├── useClaims.ts
│   │   ├── useAssets.ts
│   │   ├── usePartners.ts
│   │   └── useBilling.ts
│   ├── services/                    # API services
│   │   ├── api.service.ts          # Axios instance
│   │   ├── auth.service.ts
│   │   ├── policy.service.ts
│   │   └── ...
│   ├── types/                       # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── policy.types.ts
│   │   └── common.types.ts
│   ├── utils/                       # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── contexts/
│   │   └── AuthContext.tsx         # Auth state
│   ├── routes/
│   │   └── index.tsx               # Route config
│   ├── App.tsx                     # Root component
│   └── main.tsx                    # Entry point
├── .env.example                    # Environment template
├── .eslintrc.json                  # ESLint config
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
└── package.json                    # Dependencies
```

---

## Development Workflow

### Git Workflow

We follow **Git Flow** branching strategy:

```
main (production)
  │
  ├── develop (integration)
  │     │
  │     ├── feature/policy-management
  │     ├── feature/claims-processing
  │     ├── bugfix/login-issue
  │     └── hotfix/critical-bug
```

#### Branch Naming Convention

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical production fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

#### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```bash
git commit -m "feat(policies): add policy renewal functionality"
git commit -m "fix(auth): resolve token refresh issue"
git commit -m "docs(readme): update installation instructions"
```

### Daily Development Workflow

#### 1. Start Your Day

```bash
# Pull latest changes
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Start backend
cd InsureX.API
dotnet watch run

# Start frontend (new terminal)
cd insurex-react
npm run dev
```

#### 2. Make Changes

- Write code following project conventions
- Test your changes locally
- Ensure no console errors
- Check API responses in Swagger

#### 3. Commit Changes

```bash
# Stage changes
git add .

# Commit with conventional message
git commit -m "feat(module): description of changes"

# Push to remote
git push origin feature/your-feature-name
```

#### 4. Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in PR template
5. Request review from team members
6. Address review comments
7. Merge when approved

### Code Review Checklist

**Before submitting PR:**

- [ ] Code follows project style guide
- [ ] No console.log() or debugging code
- [ ] All TypeScript types defined
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] API endpoints tested in Swagger
- [ ] No hardcoded values
- [ ] Environment variables used for config
- [ ] Comments added for complex logic
- [ ] No merge conflicts

---

## Common Tasks

### Backend Tasks

#### Add New Entity

1. **Create Entity** in `InsureX.Domain/Entities/`:

```csharp
public class YourEntity : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    // Add properties
}
```

2. **Add DbSet** in `ApplicationDbContext.cs`:

```csharp
public DbSet<YourEntity> YourEntities { get; set; }
```

3. **Create Migration**:

```bash
cd InsureX.API
dotnet ef migrations add AddYourEntity --project ../InsureX.Infrastructure
dotnet ef database update --project ../InsureX.Infrastructure
```

#### Add New API Endpoint

1. **Create DTO** in `InsureX.Application/DTOs/`:

```csharp
public class CreateYourEntityDto
{
    public string Name { get; set; } = string.Empty;
}
```

2. **Create Service Interface** in `InsureX.Application/Interfaces/`:

```csharp
public interface IYourEntityService
{
    Task<YourEntity> CreateAsync(CreateYourEntityDto dto);
}
```

3. **Implement Service** in `InsureX.Application/Services/`:

```csharp
public class YourEntityService : IYourEntityService
{
    // Implementation
}
```

4. **Create Controller** in `InsureX.API/Controllers/`:

```csharp
[ApiController]
[Route("api/[controller]")]
public class YourEntitiesController : ControllerBase
{
    private readonly IYourEntityService _service;
    
    [HttpPost]
    public async Task<IActionResult> Create(CreateYourEntityDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(result);
    }
}
```

5. **Register Service** in `Program.cs`:

```csharp
builder.Services.AddScoped<IYourEntityService, YourEntityService>();
```

### Frontend Tasks

#### Add New Page

1. **Create Page Component** in `src/pages/`:

```tsx
// src/pages/YourPage/YourPage.tsx
import React from 'react';
import { Container, Typography } from '@mui/material';

const YourPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4">Your Page</Typography>
    </Container>
  );
};

export default YourPage;
```

2. **Add Route** in `src/routes/index.tsx`:

```tsx
{
  path: '/your-page',
  element: <ProtectedRoute><YourPage /></ProtectedRoute>
}
```

3. **Add Navigation Link** in `src/components/Layout/Sidebar.tsx`:

```tsx
<ListItem button component={Link} to="/your-page">
  <ListItemIcon><YourIcon /></ListItemIcon>
  <ListItemText primary="Your Page" />
</ListItem>
```

#### Add New API Service

1. **Create Service** in `src/services/`:

```typescript
// src/services/yourEntity.service.ts
import apiClient from './api.service';

export const yourEntityService = {
  getAll: async () => {
    const response = await apiClient.get('/your-entities');
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await apiClient.post('/your-entities', data);
    return response.data;
  }
};
```

2. **Create Custom Hook** in `src/hooks/`:

```typescript
// src/hooks/useYourEntity.ts
import { useState, useEffect } from 'react';
import { yourEntityService } from '../services/yourEntity.service';

export const useYourEntity = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await yourEntityService.getAll();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return { data, loading, refetch: fetchData };
};
```

### Database Tasks

#### Reset Database

```bash
cd InsureX.API

# Drop database
dotnet ef database drop --project ../InsureX.Infrastructure

# Recreate and apply migrations
dotnet ef database update --project ../InsureX.Infrastructure

# Seed data
cd ../InsureX.SeedTool
dotnet run
```

#### View Database Schema

```bash
# Generate SQL script for all migrations
cd InsureX.API
dotnet ef migrations script --project ../InsureX.Infrastructure -o schema.sql
```

#### Backup Database

```sql
-- In SQL Server Management Studio
BACKUP DATABASE InsureX_Dev
TO DISK = 'C:\Backups\InsureX_Dev.bak'
WITH FORMAT, INIT, NAME = 'Full Backup of InsureX_Dev';
```

---

## Troubleshooting

### Common Backend Issues

#### Issue: Database Connection Failed

**Error:**
```
Microsoft.Data.SqlClient.SqlException: A network-related or instance-specific error occurred
```

**Solutions:**

1. **Check SQL Server is running:**
   ```bash
   # Windows Services
   services.msc
   # Look for "SQL Server (MSSQLSERVER)"
   ```

2. **Verify connection string:**
   ```json
   "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
   ```

3. **Test connection:**
   ```bash
   sqlcmd -S localhost -E
   ```

#### Issue: Migration Failed

**Error:**
```
Build failed. Use dotnet build to see the errors.
```

**Solutions:**

1. **Build solution first:**
   ```bash
   dotnet build
   ```

2. **Check for compilation errors**

3. **Remove last migration:**
   ```bash
   dotnet ef migrations remove --project ../InsureX.Infrastructure
   ```

#### Issue: JWT Token Invalid

**Error:**
```
401 Unauthorized
```

**Solutions:**

1. **Check token expiration** (default 24 hours)

2. **Verify JWT secret key** matches in appsettings.json

3. **Clear browser localStorage:**
   ```javascript
   localStorage.clear();
   ```

4. **Login again** to get new token

### Common Frontend Issues

#### Issue: API Connection Refused

**Error:**
```
Network Error: ERR_CONNECTION_REFUSED
```

**Solutions:**

1. **Verify backend is running:**
   ```bash
   curl http://localhost:5001/api/health
   ```

2. **Check .env file:**
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

3. **Restart Vite dev server:**
   ```bash
   npm run dev
   ```

#### Issue: CORS Error

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**

1. **Check CORS configuration** in `Program.cs`:
   ```csharp
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowReactApp",
           builder => builder
               .WithOrigins("http://localhost:5173")
               .AllowAnyMethod()
               .AllowAnyHeader());
   });
   ```

2. **Verify frontend URL** in appsettings.json

#### Issue: TypeScript Errors

**Error:**
```
Type 'X' is not assignable to type 'Y'
```

**Solutions:**

1. **Check type definitions** in `src/types/`

2. **Install missing types:**
   ```bash
   npm install --save-dev @types/package-name
   ```

3. **Restart TypeScript server** in VS Code:
   - Ctrl+Shift+P → "TypeScript: Restart TS Server"

### Performance Issues

#### Slow API Response

**Solutions:**

1. **Enable response caching**
2. **Add database indexes**
3. **Optimize queries** (use `.AsNoTracking()` for read-only)
4. **Implement pagination**

#### Slow Frontend Loading

**Solutions:**

1. **Enable code splitting:**
   ```tsx
   const LazyComponent = React.lazy(() => import('./Component'));
   ```

2. **Optimize images**
3. **Use React.memo** for expensive components
4. **Implement virtual scrolling** for large lists

---

## Resources

### Documentation

- **Project Wiki**: [GitHub Wiki](https://github.com/luigi043/New-Insurex/wiki)
- **API Documentation**: `https://localhost:7001/swagger`
- **Checklist**: See `Checklist.md` for development progress

### Learning Resources

#### React + TypeScript
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Docs](https://mui.com/)

#### .NET + EF Core
- [.NET 8 Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [EF Core Documentation](https://learn.microsoft.com/en-us/ef/core/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

#### SQL Server
- [SQL Server Documentation](https://learn.microsoft.com/en-us/sql/sql-server/)
- [T-SQL Reference](https://learn.microsoft.com/en-us/sql/t-sql/)

### Team Communication

- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code reviews
- **Discussions**: Architecture decisions

### Useful Commands Reference

See `notes.md` for comprehensive command reference.

---

## Next Steps

Now that you're set up, here's what to do next:

1. **Explore the codebase**
   - Review existing controllers and services
   - Understand the domain models
   - Check out the React components

2. **Run the application**
   - Test login functionality
   - Navigate through different modules
   - Try creating a policy or claim

3. **Pick a task**
   - Check `Checklist.md` for pending tasks
   - Look at GitHub Issues for open items
   - Start with small bug fixes or UI improvements

4. **Ask questions**
   - Create GitHub Discussion for architecture questions
   - Open GitHub Issue for bugs
   - Request code review on your PRs

---

**Welcome to the team! Happy coding!**

Last Updated: 2024-01-15
