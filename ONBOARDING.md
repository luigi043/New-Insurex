# 🚀 InsureX Onboarding Guide

Welcome to **InsureX** - a modern, full-stack Insurance Management System! This guide will help you get started quickly and understand the platform.

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

---

## 📚 Table of Contents

1. [Quick Overview](#-quick-overview)
2. [What You'll Need](#-what-youll-need)
3. [First-Time Setup](#-first-time-setup)
4. [Understanding the Architecture](#-understanding-the-architecture)
5. [Your First Tasks](#-your-first-tasks)
6. [Useful Resources](#-useful-resources)
7. [Getting Help](#-getting-help)

---

## 🎯 Quick Overview

### What is InsureX?

InsureX is a comprehensive insurance management platform that helps insurance companies manage:

- **Policies** - Create, activate, renew, and cancel insurance policies
- **Claims** - Submit, review, approve/reject, and process claims
- **Assets** - Track insured assets across 11+ categories
- **Partners** - Manage agencies, brokers, and service providers
- **Billing** - Generate invoices and track payments
- **Users** - Multi-role system with fine-grained permissions

### Technology Stack

**Frontend (React)**
- React 18 + TypeScript
- Material-UI (MUI) v5 for UI components
- React Router v6 for navigation
- Axios for API calls
- Vite for fast development

**Backend (.NET)**
- .NET 8 Web API
- Entity Framework Core for database
- SQL Server database
- JWT authentication
- Serilog for logging
- Swagger for API documentation

### Project Structure

```
InsureX/
├── insurex-react/          # Frontend React application
│   ├── src/
│   │   ├── pages/          # Page components (Login, Dashboard, etc.)
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API service layer
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript type definitions
│   └── package.json
│
├── InsureX.API/            # Web API entry point
├── InsureX.Application/    # Business logic & DTOs
├── InsureX.Domain/         # Domain entities & enums
├── InsureX.Infrastructure/ # Data access & repositories
├── InsureX.Shared/         # Shared DTOs
└── InsureX.Tests/          # Unit tests
```

---

## 💻 What You'll Need

### Required Software

| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | 18.x or higher | https://nodejs.org/ |
| **.NET SDK** | 8.0 | https://dotnet.microsoft.com/download |
| **SQL Server** | 2019+ or LocalDB | https://www.microsoft.com/sql-server |
| **Git** | Latest | https://git-scm.com/ |

### Recommended Tools

| Tool | Purpose | Link |
|------|---------|------|
| **Visual Studio Code** | Code editor | https://code.visualstudio.com/ |
| **Visual Studio 2022** | .NET IDE | https://visualstudio.microsoft.com/ |
| **Postman** | API testing | https://www.postman.com/ |
| **SQL Server Management Studio** | Database management | https://aka.ms/ssmsfullsetup |

### VS Code Extensions (Recommended)

- C# Dev Kit
- ESLint
- Prettier
- React Developer Tools
- GitLens
- Thunder Client (API testing)

---

## 🛠️ First-Time Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/luigi043/New-Insurex.git

# Navigate to the project
cd New-Insurex
```

### Step 2: Backend Setup

#### 2.1 Install .NET Dependencies

```bash
# Restore NuGet packages
dotnet restore
```

#### 2.2 Configure Database Connection

1. Open `InsureX.API/appsettings.Development.json`
2. Update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

**Options:**
- **Windows Authentication**: `Trusted_Connection=True`
- **SQL Authentication**: `User Id=sa;Password=YourPassword`
- **LocalDB**: `Server=(localdb)\\mssqllocaldb;Database=InsureX_Dev;Trusted_Connection=True`

#### 2.3 Create the Database

```bash
# Navigate to API project
cd InsureX.API

# Apply migrations (creates database + tables)
dotnet ef database update --project ../InsureX.Infrastructure

# If migration fails, create migration first:
dotnet ef migrations add InitialCreate --project ../InsureX.Infrastructure
dotnet ef database update --project ../InsureX.Infrastructure
```

#### 2.4 Run the Backend

```bash
# From InsureX.API directory
dotnet run

# Or use watch mode for auto-reload
dotnet watch run
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7001
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5001
```

**Test the API:**
- Swagger UI: https://localhost:7001/swagger
- Health Check: https://localhost:7001/health

### Step 3: Frontend Setup

#### 3.1 Install Dependencies

```bash
# Navigate to React app (from project root)
cd insurex-react

# Install npm packages
npm install
```

#### 3.2 Configure Environment Variables

```bash
# Create environment file
cp .env.example .env
```

Edit `.env`:
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

#### 3.3 Run the Frontend

```bash
# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Step 4: Verify Installation

1. **Open the app**: http://localhost:3000
2. **You should see**: Login page
3. **Default credentials**:
   - Email: `admin@insurex.com`
   - Password: `Admin123!`

4. **After login**: Dashboard with navigation menu

---

## 🏗️ Understanding the Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────┐
│         InsureX.API                  │  ← Controllers, Middleware, Program.cs
│      (Presentation Layer)            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      InsureX.Application             │  ← Services, DTOs, Validators
│     (Application Layer)              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      InsureX.Infrastructure          │  ← EF Core, Repositories, Security
│    (Infrastructure Layer)            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│        InsureX.Domain                │  ← Entities, Enums, Interfaces
│       (Domain Layer)                 │
└─────────────────────────────────────┘
```

### Key Concepts

#### 1. **Domain Entities** (InsureX.Domain)
Core business objects like `Policy`, `Claim`, `Asset`, `User`, etc.

```csharp
public class Policy
{
    public Guid Id { get; set; }
    public string PolicyNumber { get; set; }
    public PolicyStatus Status { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Premium { get; set; }
    // ... more properties
}
```

#### 2. **Repositories** (InsureX.Infrastructure)
Data access layer implementing CRUD operations.

```csharp
public interface IPolicyRepository
{
    Task<Policy> GetByIdAsync(Guid id);
    Task<List<Policy>> GetAllAsync();
    Task<Policy> CreateAsync(Policy policy);
    Task UpdateAsync(Policy policy);
    Task DeleteAsync(Guid id);
}
```

#### 3. **Services** (InsureX.Application)
Business logic implementation.

```csharp
public interface IPolicyService
{
    Task<PolicyDto> CreatePolicyAsync(CreatePolicyDto dto);
    Task<PolicyDto> ActivatePolicyAsync(Guid id);
    Task<List<PolicyDto>> GetPoliciesAsync(PolicyFilterDto filter);
}
```

#### 4. **Controllers** (InsureX.API)
HTTP endpoints exposing the API.

```csharp
[ApiController]
[Route("api/[controller]")]
public class PoliciesController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<PolicyDto>>> GetPolicies()
    {
        // Implementation
    }
    
    [HttpPost]
    public async Task<ActionResult<PolicyDto>> CreatePolicy(CreatePolicyDto dto)
    {
        // Implementation
    }
}
```

### Frontend Architecture

#### Component Hierarchy

```
App.tsx
├── AuthProvider (contexts/AuthContext.tsx)
│   └── NotificationProvider
│       └── Router
│           ├── Public Routes
│           │   ├── Login
│           │   ├── Register
│           │   └── ForgotPassword
│           └── Protected Routes
│               ├── Dashboard Layout
│               │   ├── Sidebar
│               │   ├── TopBar
│               │   └── Content Area
│               ├── Policies Page
│               ├── Claims Page
│               ├── Assets Page
│               └── ... more pages
```

#### API Service Layer

```typescript
// services/api.service.ts - Axios setup with interceptors
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor adds JWT token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles 401 errors
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Refresh token logic
    }
    return Promise.reject(error);
  }
);
```

#### Custom Hooks Pattern

```typescript
// hooks/usePolicies.ts
export const usePolicies = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const data = await policyService.getAll();
      setPolicies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { policies, loading, error, fetchPolicies };
};
```

### Authentication Flow

```
┌──────────┐                 ┌──────────┐                 ┌──────────┐
│  Login   │   POST /login   │   API    │   Validate     │ Database │
│  Page    │ ───────────────>│          │ ──────────────>│          │
└──────────┘                 └──────────┘                 └──────────┘
     │                             │                            │
     │                             │<────────────────────────────┤
     │                             │   User + Roles             │
     │                             │                            │
     │      <──────────────────────┤                            │
     │      JWT Access Token       │                            │
     │      JWT Refresh Token      │                            │
     │                             │                            │
     ├─ Store in localStorage      │                            │
     │                             │                            │
     └─ Redirect to Dashboard      │                            │
```

**Token Structure:**
- **Access Token**: Short-lived (24 hours), used for API requests
- **Refresh Token**: Long-lived (7 days), used to get new access tokens

### State Machines

InsureX uses state machines for workflows:

#### Policy Lifecycle

```
Draft → Active → Renewed
  ↓       ↓         ↓
Cancelled Expired Cancelled
```

#### Claim Processing

```
Draft → Submitted → UnderReview → Approved → Paid
  ↓         ↓           ↓           ↓
Cancelled Rejected  Rejected    Cancelled
```

---

## ✅ Your First Tasks

### Task 1: Explore the Dashboard (5 minutes)

1. Login at http://localhost:3000
2. Explore the navigation menu
3. Click through different sections:
   - Dashboard (overview stats)
   - Policies (policy management)
   - Claims (claims processing)
   - Assets (asset tracking)

### Task 2: Test the API with Swagger (10 minutes)

1. Open https://localhost:7001/swagger
2. Click **Authorize** button
3. Login to get a token:
   - Use POST `/api/auth/login`
   - Request body:
     ```json
     {
       "email": "admin@insurex.com",
       "password": "Admin123!"
     }
     ```
   - Copy the `accessToken` from response

4. Paste token in Authorization dialog: `Bearer <your-token>`
5. Try endpoints:
   - GET `/api/policies` - List policies
   - GET `/api/policies/stats` - Policy statistics
   - GET `/api/claims` - List claims

### Task 3: Create Your First Policy (15 minutes)

#### Via UI:
1. Navigate to **Policies** page
2. Click **New Policy** button
3. Fill in the form:
   - Customer name
   - Policy type (Auto, Home, Life, etc.)
   - Coverage amount
   - Premium
   - Start/End dates
4. Click **Save**
5. View the created policy in the list

#### Via API:
```bash
# Using curl (replace <token> with your JWT)
curl -X POST https://localhost:7001/api/policies \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "policyType": "Auto",
    "coverageAmount": 50000,
    "premium": 1200,
    "startDate": "2026-03-03",
    "endDate": "2027-03-03"
  }'
```

### Task 4: Make a Simple Code Change (20 minutes)

Let's customize the dashboard welcome message:

1. Open `insurex-react/src/pages/dashboard/Dashboard.tsx`
2. Find the welcome text (around line 20-30)
3. Change:
   ```typescript
   <Typography variant="h4">Welcome to InsureX</Typography>
   ```
   to:
   ```typescript
   <Typography variant="h4">Welcome to InsureX, {user.name}!</Typography>
   ```
4. Save the file
5. The browser should auto-reload
6. See your change on the dashboard

### Task 5: Add a New API Endpoint (30 minutes)

Let's add a "hello world" endpoint:

1. Open `InsureX.API/Controllers/PoliciesController.cs`
2. Add a new method:
   ```csharp
   [HttpGet("hello")]
   [AllowAnonymous]
   public ActionResult<string> SayHello()
   {
       return Ok(new { message = "Hello from InsureX API!" });
   }
   ```
3. Save the file
4. Test at: https://localhost:7001/api/policies/hello
5. You should see: `{"message":"Hello from InsureX API!"}`

---

## 📖 Useful Resources

### Documentation

| Resource | Link |
|----------|------|
| **Project Checklist** | [Checklist.md](./Checklist.md) |
| **Setup Guide** | [SETUP.md](./SETUP.md) |
| **Developer Guide** | [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) |
| **Contributing** | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| **API Documentation** | https://localhost:7001/swagger |

### Technology Documentation

| Technology | Link |
|------------|------|
| **React** | https://react.dev/ |
| **TypeScript** | https://www.typescriptlang.org/docs/ |
| **Material-UI** | https://mui.com/material-ui/getting-started/ |
| **.NET** | https://learn.microsoft.com/en-us/dotnet/ |
| **Entity Framework Core** | https://learn.microsoft.com/en-us/ef/core/ |
| **React Router** | https://reactrouter.com/ |
| **Axios** | https://axios-http.com/docs/intro |

### Helpful Commands

#### Backend Commands

```bash
# Restore packages
dotnet restore

# Build solution
dotnet build

# Run API (with hot reload)
dotnet watch run --project InsureX.API

# Run tests
dotnet test

# Create migration
dotnet ef migrations add MigrationName --project InsureX.Infrastructure

# Apply migrations
dotnet ef database update --project InsureX.Infrastructure

# Rollback migration
dotnet ef database update PreviousMigrationName --project InsureX.Infrastructure

# List migrations
dotnet ef migrations list --project InsureX.Infrastructure

# Generate SQL script
dotnet ef migrations script --project InsureX.Infrastructure
```

#### Frontend Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run type-check
```

#### Database Commands (SQL Server)

```sql
-- Check database
SELECT name FROM sys.databases WHERE name = 'InsureX_Dev';

-- List tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';

-- Check applied migrations
SELECT * FROM __EFMigrationsHistory;

-- Clear all data (be careful!)
EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'
EXEC sp_MSforeachtable 'DELETE FROM ?'
EXEC sp_MSforeachtable 'ALTER TABLE ? CHECK CONSTRAINT ALL'
```

---

## 🆘 Getting Help

### Common Issues & Solutions

#### Issue: "Cannot connect to SQL Server"

**Solution:**
1. Check SQL Server is running:
   ```bash
   # Windows Services
   services.msc → SQL Server (MSSQLSERVER)
   ```
2. Verify connection string in `appsettings.Development.json`
3. Try using LocalDB:
   ```json
   "Server=(localdb)\\mssqllocaldb;Database=InsureX_Dev;Trusted_Connection=True"
   ```

#### Issue: "Port 3000 already in use"

**Solution:**
1. Change port in `insurex-react/vite.config.ts`:
   ```typescript
   server: {
     port: 3001  // Use different port
   }
   ```
2. Or kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```

#### Issue: "CORS error when calling API"

**Solution:**
1. Check `InsureX.API/appsettings.json`:
   ```json
   "Cors": {
     "AllowedOrigins": [
       "http://localhost:3000",
       "http://localhost:5173"
     ]
   }
   ```
2. Make sure your frontend URL is in the list

#### Issue: "JWT token expired"

**Solution:**
1. Login again to get a fresh token
2. The app should auto-refresh tokens
3. Check `usePolicies` hook for refresh logic

#### Issue: "EF Migration failed"

**Solution:**
```bash
# Remove last migration
dotnet ef migrations remove --project InsureX.Infrastructure

# Clean build
dotnet clean
dotnet build

# Try again
dotnet ef migrations add InitialCreate --project InsureX.Infrastructure
dotnet ef database update --project InsureX.Infrastructure
```

### Where to Ask Questions

1. **GitHub Issues**: https://github.com/luigi043/New-Insurex/issues
   - For bugs and feature requests
   - Search existing issues first

2. **GitHub Discussions**: https://github.com/luigi043/New-Insurex/discussions
   - For questions and help
   - For general discussions

3. **Team Chat**: [Your team's Slack/Discord/Teams]
   - For quick questions
   - For collaboration

### Debug Mode

#### Frontend Debugging

1. Open browser DevTools (F12)
2. Check Console for errors
3. Network tab for API calls
4. React DevTools extension

#### Backend Debugging

1. **Visual Studio**:
   - Set breakpoints
   - F5 to start debugging

2. **VS Code**:
   - Install C# extension
   - F5 to start debugging
   - `.vscode/launch.json` configured

3. **Logs**:
   - Check `InsureX.API/logs/` folder
   - Console output

---

## 🎉 Next Steps

Congratulations! You've completed the onboarding. Here's what to do next:

### For Developers

1. ✅ Read [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
2. ✅ Review [CONTRIBUTING.md](./CONTRIBUTING.md)
3. ✅ Pick a task from [GitHub Issues](https://github.com/luigi043/New-Insurex/issues)
4. ✅ Join the team standup/meetings
5. ✅ Set up your development environment fully

### For Project Managers / QA

1. ✅ Review [Checklist.md](./Checklist.md) for project status
2. ✅ Test all features in the UI
3. ✅ Create test cases
4. ✅ Report bugs via GitHub Issues

### For DevOps

1. ✅ Review `docker-compose.yml`
2. ✅ Set up CI/CD pipeline
3. ✅ Configure staging/production environments
4. ✅ Set up monitoring and logging

---

**Welcome to the InsureX team! 🚀**

Last Updated: 2026-03-03
