# InsureX Developer Guide

## Architecture Overview

InsureX follows **Clean Architecture** with four main layers:

```
InsureX.Domain        → Entities, Enums, Interfaces, Value Objects (no dependencies)
InsureX.Application   → Services, DTOs, Interfaces, Validators, Behaviors
InsureX.Infrastructure → EF Core, Repositories, Security, Reporting, Workflow
InsureX.API           → Controllers, Middleware, Configuration
InsureX.Tests         → Unit Tests (xUnit + Moq + FluentAssertions)
InsureX.Shared        → Shared DTOs and Enums across projects
```

## Prerequisites

- .NET 8.0 SDK
- SQL Server 2019+ (or Docker)
- Visual Studio 2022 / VS Code / Rider

## Getting Started

### 1. Clone and Restore

```bash
git clone <repository-url>
cd InsureX
dotnet restore InsureX.sln
```

### 2. Database Setup

Start SQL Server via Docker:

```bash
docker-compose up sqlserver -d
```

Or update `appsettings.json` with your SQL Server connection string.

### 3. Run the API

```bash
cd InsureX.API
dotnet run
```

The API will be available at `https://localhost:5001` (or `http://localhost:5000`).
Swagger UI: `https://localhost:5001/swagger`

### 4. Run Tests

```bash
dotnet test InsureX.Tests/InsureX.Tests.csproj --verbosity normal
```

## Project Structure

### Domain Layer (`InsureX.Domain`)

Contains business entities and interfaces with zero external dependencies.

**Key Entities:**
- `Policy` - Insurance policies with lifecycle management
- `Claim` - Claims with full workflow (Submit → Review → Approve/Reject → Pay → Close)
- `Asset` - Insured assets (vehicles, property, equipment)
- `Partner` - Brokers, agencies, insurers
- `Invoice` - Billing with payment tracking
- `Tenant` - Multi-tenancy support
- `User` - Authentication and authorization
- `WorkflowDefinition` - Custom workflow engine
- `AuditEntry` - Comprehensive audit trail
- `ClaimInvestigationNote` - Investigation notes for claims
- `ReportDefinition` - Custom and predefined reports

### Application Layer (`InsureX.Application`)

Contains business logic services, DTOs, and validation.

**Services:**
- `ClaimService` - Full claim lifecycle management
- `PolicyService` - Policy CRUD and state transitions
- `AssetService` - Asset management with validation
- `InvoiceService` - Billing and payment processing
- `PartnerService` - Partner management
- `AuthService` - Authentication (JWT)
- `TenantService` - Tenant onboarding and settings
- `AuditService` - Audit trail with compliance reporting
- `ClaimInvestigationNoteService` - Investigation notes

### Infrastructure Layer (`InsureX.Infrastructure`)

Contains data access, external service integrations.

**Key Components:**
- `ApplicationDbContext` - EF Core context with automatic audit trail
- `Repository<T>` - Generic repository with tenant filtering
- `JwtService` - JWT token generation and validation
- `WorkflowService` - Workflow engine with approval chains
- `ReportGeneratorService` - Report generation with CSV export

### API Layer (`InsureX.API`)

Contains controllers and middleware.

**Middleware Pipeline:**
1. `CorrelationIdMiddleware` - Request correlation tracking
2. `SecurityHeadersMiddleware` - HSTS, CSP, XSS protection
3. `GlobalExceptionMiddleware` - Centralized error handling
4. `ValidationMiddleware` - Request body validation
5. `RequestTimingMiddleware` - Performance monitoring
6. `RateLimitingMiddleware` - API rate limiting
7. `TenantResolutionMiddleware` - Multi-tenant context
8. `ResponseCachingMiddleware` - Response caching for read endpoints

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Policies
- `GET /api/policies` - List policies (paginated)
- `GET /api/policies/{id}` - Get policy by ID
- `POST /api/policies` - Create policy
- `PUT /api/policies/{id}` - Update policy
- `POST /api/policies/{id}/activate` - Activate policy
- `POST /api/policies/{id}/cancel` - Cancel policy
- `POST /api/policies/{id}/renew` - Renew policy

### Claims
- `GET /api/claims` - List claims
- `POST /api/claims` - Create claim
- `POST /api/claims/{id}/submit` - Submit claim
- `POST /api/claims/{id}/approve` - Approve claim
- `POST /api/claims/{id}/reject` - Reject claim
- `POST /api/claims/{id}/pay` - Mark as paid
- `POST /api/claims/{id}/close` - Close claim

### Investigation Notes
- `GET /api/claims/{claimId}/investigation-notes` - List notes
- `POST /api/claims/{claimId}/investigation-notes` - Create note
- `POST /api/claims/{claimId}/investigation-notes/{noteId}/resolve` - Resolve note
- `GET /api/investigation-notes/unresolved` - Unresolved notes
- `GET /api/investigation-notes/follow-ups` - Follow-ups due

### Workflows
- `GET /api/workflows/definitions` - List workflow definitions
- `POST /api/workflows/definitions` - Create workflow
- `POST /api/workflows/instances/start` - Start workflow
- `POST /api/workflows/instances/{id}/transition` - Transition
- `GET /api/workflows/instances/{id}/history` - History
- `POST /api/workflows/approvals/{id}/approve` - Approve
- `GET /api/workflows/approvals/pending` - Pending approvals

### Reports
- `GET /api/reports/definitions` - Available reports
- `POST /api/reports/generate/{id}` - Generate report
- `POST /api/reports/export/{id}` - Export report
- `GET /api/reports/policies/summary` - Policy summary
- `GET /api/reports/claims/summary` - Claims summary
- `GET /api/reports/financial` - Financial report
- `GET /api/reports/loss-ratio` - Loss ratio report
- `GET /api/reports/expiring-policies` - Expiring policies

### Tenants (Admin only)
- `POST /api/tenants/onboard` - Onboard new tenant
- `GET /api/tenants/{id}/settings` - Get settings
- `PUT /api/tenants/{id}/settings/{key}` - Update setting

### Audit (Admin only)
- `GET /api/audit` - Search audit entries
- `GET /api/audit/compliance-report` - Compliance report
- `GET /api/audit/export` - Export audit log

## Multi-Tenancy

All data is tenant-scoped. The tenant is resolved from:
1. `X-Tenant-ID` header
2. `tenant_id` JWT claim

Global query filters automatically apply tenant isolation at the database level.

## Testing

Tests use **xUnit** with **Moq** for mocking and **FluentAssertions** for assertions.

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

## Coding Conventions

- Use `async/await` for all I/O operations
- All entities extend `BaseEntity` (includes `Id`, `CreatedAt`, `UpdatedAt`, `IsDeleted`)
- Use `ApiResponse<T>` wrapper for all API responses
- Use `[Authorize(Roles = "...")]` for role-based access
- Services use constructor injection with `ILogger<T>`
- Repositories extend `Repository<T>` base class
- Soft delete by default (set `IsDeleted = true`)
