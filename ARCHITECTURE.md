# InsureX Architecture Documentation

Technical architecture and design documentation for the InsureX Insurance Management System.

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [Technology Stack](#technology-stack)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Database Design](#database-design)
7. [Security Architecture](#security-architecture)
8. [API Design](#api-design)
9. [Deployment Architecture](#deployment-architecture)
10. [Performance Considerations](#performance-considerations)

---

## System Overview

InsureX is a full-stack insurance management platform built with modern technologies and following industry best practices. The system is designed to be scalable, maintainable, and secure.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │    Mobile    │  │   Desktop    │          │
│  │  (React SPA) │  │  (Future)    │  │  (Future)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  .NET 8 Web API (InsureX.API)                            │  │
│  │  - JWT Authentication                                     │  │
│  │  - Rate Limiting                                          │  │
│  │  - CORS Policy                                            │  │
│  │  - Request/Response Logging                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  InsureX.Application                                      │  │
│  │  - Business Logic                                         │  │
│  │  - DTOs & Mapping                                         │  │
│  │  - Validation (FluentValidation)                          │  │
│  │  - CQRS Handlers                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  InsureX.Infrastructure                                   │  │
│  │  - Entity Framework Core                                  │  │
│  │  - Repository Pattern                                     │  │
│  │  - Multi-tenancy Support                                  │  │
│  │  - Audit Trail                                            │  │
│  │  - Email Service                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Domain Layer                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  InsureX.Domain                                           │  │
│  │  - Entities                                               │  │
│  │  - Value Objects                                          │  │
│  │  - Domain Events                                          │  │
│  │  - Business Rules                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SQL Server Database                                      │  │
│  │  - Relational Tables                                      │  │
│  │  - Stored Procedures                                      │  │
│  │  - Indexes & Constraints                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Architecture Patterns

### 1. Clean Architecture

The backend follows Clean Architecture principles with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│                    (InsureX.API)                         │
│  - Controllers                                           │
│  - Middleware                                            │
│  - Filters                                               │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│                 (InsureX.Application)                    │
│  - Use Cases / Handlers                                  │
│  - DTOs                                                  │
│  - Validators                                            │
│  - Interfaces                                            │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Domain Layer                          │
│                   (InsureX.Domain)                       │
│  - Entities                                              │
│  - Value Objects                                         │
│  - Domain Events                                         │
│  - Business Logic                                        │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                     │
│               (InsureX.Infrastructure)                   │
│  - Data Access (EF Core)                                 │
│  - External Services                                     │
│  - File System                                           │
│  - Email, SMS, etc.                                      │
└─────────────────────────────────────────────────────────┘
```

**Benefits:**
- **Independence**: Business logic independent of frameworks
- **Testability**: Easy to unit test core logic
- **Flexibility**: Easy to swap implementations
- **Maintainability**: Clear boundaries and responsibilities

### 2. Repository Pattern

Abstracts data access logic:

```csharp
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
    Task<int> SaveChangesAsync();
}
```

### 3. CQRS (Command Query Responsibility Segregation)

Separates read and write operations:

```
Commands (Write)              Queries (Read)
     │                             │
     ▼                             ▼
CommandHandler              QueryHandler
     │                             │
     ▼                             ▼
  Repository                  Repository
     │                             │
     ▼                             ▼
  Database                    Database
```

### 4. Dependency Injection

All dependencies are injected through constructors:

```csharp
public class PolicyService
{
    private readonly IPolicyRepository _repository;
    private readonly ILogger<PolicyService> _logger;
    
    public PolicyService(
        IPolicyRepository repository,
        ILogger<PolicyService> logger)
    {
        _repository = repository;
        _logger = logger;
    }
}
```

---

## Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **.NET** | 8.0 | Backend framework |
| **C#** | 12.0 | Programming language |
| **Entity Framework Core** | 8.0 | ORM |
| **SQL Server** | 2019+ | Database |
| **Serilog** | 3.x | Logging |
| **FluentValidation** | 11.x | Input validation |
| **AutoMapper** | 12.x | Object mapping |
| **Swashbuckle** | 6.x | API documentation |
| **xUnit** | 2.x | Unit testing |
| **Moq** | 4.x | Mocking framework |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2 | UI framework |
| **TypeScript** | 5.2 | Type safety |
| **Vite** | 5.0 | Build tool |
| **Material-UI** | 5.14 | UI components |
| **React Router** | 6.21 | Routing |
| **Axios** | 1.6 | HTTP client |
| **React Hook Form** | 7.x | Form management |
| **Date-fns** | 2.x | Date utilities |

### DevOps & Tools

| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **GitHub Actions** | CI/CD |
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Visual Studio Code** | IDE |
| **Postman** | API testing |

---

## Backend Architecture

### Layer Responsibilities

#### 1. API Layer (InsureX.API)

**Responsibilities:**
- HTTP request/response handling
- Authentication & authorization
- Input validation
- Error handling
- API documentation

**Key Components:**
```
InsureX.API/
├── Controllers/
│   ├── AuthController.cs
│   ├── PoliciesController.cs
│   ├── ClaimsController.cs
│   └── ...
├── Middleware/
│   ├── ExceptionHandlingMiddleware.cs
│   ├── TenantMiddleware.cs
│   └── RequestLoggingMiddleware.cs
├── Filters/
│   └── ValidationFilter.cs
└── Program.cs
```

#### 2. Application Layer (InsureX.Application)

**Responsibilities:**
- Business logic orchestration
- Data transformation (DTOs)
- Validation rules
- Use case implementation

**Key Components:**
```
InsureX.Application/
├── Commands/
│   ├── CreatePolicyCommand.cs
│   └── UpdatePolicyCommand.cs
├── Queries/
│   ├── GetPolicyQuery.cs
│   └── GetPoliciesQuery.cs
├── Handlers/
│   ├── CreatePolicyHandler.cs
│   └── GetPolicyHandler.cs
├── DTOs/
│   ├── PolicyDto.cs
│   └── CreatePolicyDto.cs
├── Validators/
│   └── CreatePolicyValidator.cs
└── Services/
    └── PolicyService.cs
```

#### 3. Domain Layer (InsureX.Domain)

**Responsibilities:**
- Core business entities
- Business rules
- Domain events
- Value objects

**Key Components:**
```
InsureX.Domain/
├── Entities/
│   ├── Policy.cs
│   ├── Claim.cs
│   ├── Asset.cs
│   └── User.cs
├── Enums/
│   ├── PolicyStatus.cs
│   └── ClaimStatus.cs
├── ValueObjects/
│   ├── Address.cs
│   └── Money.cs
└── Events/
    └── PolicyCreatedEvent.cs
```

#### 4. Infrastructure Layer (InsureX.Infrastructure)

**Responsibilities:**
- Data persistence
- External service integration
- Cross-cutting concerns

**Key Components:**
```
InsureX.Infrastructure/
├── Context/
│   └── ApplicationDbContext.cs
├── Repositories/
│   ├── PolicyRepository.cs
│   └── ClaimRepository.cs
├── Security/
│   ├── JwtTokenService.cs
│   └── PasswordHasher.cs
├── Tenancy/
│   └── TenantService.cs
└── Services/
    └── EmailService.cs
```

### Request Flow

```
1. HTTP Request
   │
   ▼
2. Middleware Pipeline
   ├── Exception Handling
   ├── Authentication
   ├── Tenant Resolution
   └── Logging
   │
   ▼
3. Controller
   ├── Model Binding
   ├── Validation
   └── Authorization
   │
   ▼
4. Application Service/Handler
   ├── Business Logic
   ├── DTO Mapping
   └── Validation
   │
   ▼
5. Repository
   ├── Query Building
   └── Data Access
   │
   ▼
6. Database
   │
   ▼
7. Response
   ├── DTO Mapping
   ├── Status Code
   └── JSON Serialization
```

---

## Frontend Architecture

### Component Structure

```
insurex-react/src/
├── components/              # Reusable components
│   ├── Auth/
│   │   ├── LoginForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── Common/
│   │   ├── DataTable.tsx
│   │   ├── FormField.tsx
│   │   └── LoadingSpinner.tsx
│   └── Notifications/
│       └── NotificationProvider.tsx
├── pages/                   # Page components
│   ├── auth/
│   ├── dashboard/
│   ├── policies/
│   └── claims/
├── hooks/                   # Custom hooks
│   ├── useAuth.ts
│   ├── usePolicies.ts
│   └── useApi.ts
├── services/                # API services
│   ├── api.service.ts
│   ├── auth.service.ts
│   └── policy.service.ts
├── types/                   # TypeScript types
│   ├── auth.types.ts
│   └── policy.types.ts
├── utils/                   # Utility functions
│   ├── formatters.ts
│   └── validators.ts
└── contexts/                # React contexts
    └── AuthContext.tsx
```

### State Management

```
┌─────────────────────────────────────────┐
│         Component Tree                   │
│                                          │
│  ┌────────────────────────────────┐    │
│  │  AuthProvider (Context)        │    │
│  │  ┌──────────────────────────┐  │    │
│  │  │  App                     │  │    │
│  │  │  ┌────────────────────┐  │  │    │
│  │  │  │  Protected Routes  │  │  │    │
│  │  │  │  ┌──────────────┐  │  │  │    │
│  │  │  │  │  Dashboard   │  │  │  │    │
│  │  │  │  └──────────────┘  │  │  │    │
│  │  │  └────────────────────┘  │  │    │
│  │  └──────────────────────────┘  │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘

State Flow:
1. User Action → Component
2. Component → Service (API call)
3. Service → Backend API
4. Response → State Update
5. State Update → Re-render
```

### Routing Strategy

```typescript
// Route configuration
const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'policies', element: <PolicyList /> },
      { path: 'policies/:id', element: <PolicyDetails /> },
      { path: 'claims', element: <ClaimList /> },
      // ... more routes
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ]
  }
];
```

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐
│   Tenants   │────────<│    Users    │
└─────────────┘         └─────────────┘
                              │
                              │
                              ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Policies  │────────<│   Claims    │────────<│  Documents  │
└─────────────┘         └─────────────┘         └─────────────┘
      │                       │
      │                       │
      ▼                       ▼
┌─────────────┐         ┌─────────────┐
│   Assets    │         │  Payments   │
└─────────────┘         └─────────────┘
      │
      ▼
┌─────────────┐
│  Valuations │
└─────────────┘
```

### Core Tables

#### Users Table
```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY,
    Email NVARCHAR(256) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    PhoneNumber NVARCHAR(20),
    IsActive BIT NOT NULL DEFAULT 1,
    TenantId INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    FOREIGN KEY (TenantId) REFERENCES Tenants(Id)
);
```

#### Policies Table
```sql
CREATE TABLE Policies (
    Id INT PRIMARY KEY IDENTITY,
    PolicyNumber NVARCHAR(50) NOT NULL UNIQUE,
    PolicyHolderName NVARCHAR(200) NOT NULL,
    PolicyType NVARCHAR(50) NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Premium DECIMAL(18,2) NOT NULL,
    CoverageAmount DECIMAL(18,2) NOT NULL,
    TenantId INT NOT NULL,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    FOREIGN KEY (TenantId) REFERENCES Tenants(Id),
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
);
```

#### Claims Table
```sql
CREATE TABLE Claims (
    Id INT PRIMARY KEY IDENTITY,
    ClaimNumber NVARCHAR(50) NOT NULL UNIQUE,
    PolicyId INT NOT NULL,
    ClaimType NVARCHAR(50) NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    ClaimDate DATE NOT NULL,
    ClaimAmount DECIMAL(18,2) NOT NULL,
    ApprovedAmount DECIMAL(18,2),
    Description NVARCHAR(MAX),
    TenantId INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    FOREIGN KEY (PolicyId) REFERENCES Policies(Id),
    FOREIGN KEY (TenantId) REFERENCES Tenants(Id)
);
```

### Indexing Strategy

```sql
-- Performance indexes
CREATE INDEX IX_Policies_TenantId ON Policies(TenantId);
CREATE INDEX IX_Policies_Status ON Policies(Status);
CREATE INDEX IX_Policies_PolicyNumber ON Policies(PolicyNumber);
CREATE INDEX IX_Claims_PolicyId ON Claims(PolicyId);
CREATE INDEX IX_Claims_Status ON Claims(Status);
CREATE INDEX IX_Users_Email ON Users(Email);
```

---

## Security Architecture

### Authentication Flow

```
1. User Login
   │
   ▼
2. Validate Credentials
   │
   ▼
3. Generate JWT Token
   ├── Access Token (15 min)
   └── Refresh Token (7 days)
   │
   ▼
4. Return Tokens to Client
   │
   ▼
5. Client Stores Tokens
   ├── Access Token → Memory
   └── Refresh Token → HttpOnly Cookie
   │
   ▼
6. Subsequent Requests
   └── Include Access Token in Header
```

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user@example.com",
    "userId": "123",
    "tenantId": "1",
    "roles": ["Admin", "Manager"],
    "exp": 1709481600,
    "iat": 1709478000
  },
  "signature": "..."
}
```

### Authorization Levels

```
1. Anonymous
   └── Public endpoints only

2. Authenticated
   └── All authenticated endpoints

3. Role-Based
   ├── Admin → Full access
   ├── Manager → Manage operations
   ├── Insurer → Process claims
   ├── Agent → Create policies
   └── Viewer → Read-only

4. Resource-Based
   └── Own resources only (tenant isolation)
```

### Security Headers

```csharp
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Add("Referrer-Policy", "no-referrer");
    await next();
});
```

---

## API Design

### RESTful Conventions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/policies` | List all policies |
| GET | `/api/policies/{id}` | Get single policy |
| POST | `/api/policies` | Create policy |
| PUT | `/api/policies/{id}` | Update policy |
| DELETE | `/api/policies/{id}` | Delete policy |
| POST | `/api/policies/{id}/activate` | Activate policy |

### Response Format

```json
{
  "success": true,
  "data": {
    "id": 1,
    "policyNumber": "POL-2026-001",
    "status": "Active"
  },
  "message": "Policy retrieved successfully",
  "timestamp": "2026-03-03T15:00:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "premium",
        "message": "Premium must be greater than 0"
      }
    ]
  },
  "timestamp": "2026-03-03T15:00:00Z"
}
```

---

## Deployment Architecture

### Docker Deployment

```
┌─────────────────────────────────────────┐
│         Docker Host                      │
│                                          │
│  ┌────────────────────────────────┐    │
│  │  Frontend Container            │    │
│  │  (Nginx + React Build)         │    │
│  │  Port: 3000                    │    │
│  └────────────────────────────────┘    │
│                                          │
│  ┌────────────────────────────────┐    │
│  │  Backend Container             │    │
│  │  (.NET 8 API)                  │    │
│  │  Port: 5000, 5001              │    │
│  └────────────────────────────────┘    │
│                                          │
│  ┌────────────────────────────────┐    │
│  │  Database Container            │    │
│  │  (SQL Server 2022)             │    │
│  │  Port: 1433                    │    │
│  └────────────────────────────────┘    │
│                                          │
└─────────────────────────────────────────┘
```

---

## Performance Considerations

### Backend Optimization

1. **Database Query Optimization**
   - Use indexes strategically
   - Implement pagination
   - Use compiled queries
   - Avoid N+1 queries

2. **Caching Strategy**
   - Response caching
   - Distributed caching (Redis)
   - In-memory caching

3. **Async Operations**
   - All I/O operations async
   - Parallel processing where applicable

### Frontend Optimization

1. **Code Splitting**
   - Route-based splitting
   - Component lazy loading

2. **Asset Optimization**
   - Image compression
   - Bundle size optimization
   - Tree shaking

3. **Rendering Optimization**
   - React.memo for expensive components
   - Virtual scrolling for large lists
   - Debouncing user inputs

---

**Last Updated**: 2026-03-03
