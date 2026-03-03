
# InsureX - Insurance Management System

A full-stack insurance management platform with a modern React frontend and a robust, production-ready .NET 8 Web API backend, built with Clean Architecture principles.

![InsureX Platform](https://via.placeholder.com/1200x400/1976d2/ffffff?text=InsureX+Insurance+Management+System)

## 📋 Overview

InsureX is a comprehensive insurance management system designed to streamline policy management, claims processing, asset tracking, partner management, and billing operations. The platform features role-based access control, workflow state management, and a responsive modern UI.

### ✨ Key Features

| Module | Capabilities | Backend Status | Frontend Status |
|--------|--------------|----------------|------------------|
| **Policy Management** | Full lifecycle management (Draft → Active → Expired/Cancelled) | ✅ Complete | 🚧 In Progress |
| **Claims Processing** | Complete workflow with state transitions (Submitted → UnderReview → Approved/Rejected → Paid → Closed) | ✅ Complete | 🚧 In Progress |
| **Asset Management** | Track 11+ asset types across multiple categories with valuation and warranty tracking | ✅ Complete | 🚧 In Progress |
| **Partner Management** | Manage agencies, brokers, insurers, and service providers with commission structures | ✅ Complete | 🚧 In Progress |
| **Billing & Invoicing** | Automated invoice generation, payment tracking, late fee calculation, and overdue reminders | ✅ Complete | 🚧 In Progress |
| **Multi-tenancy** | Tenant isolation with global query filters and data segregation | ✅ Complete | - |
| **RBAC** | 6+ user roles with granular permissions and policy-based authorization | ✅ Complete | 🚧 In Progress |
| **Audit Trail** | Automatic tracking of all entity changes with user and timestamp | ✅ Complete | - |
| **Soft Delete** | Data retention with soft delete pattern and restore capabilities | ✅ Complete | - |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (insurex-react)                │
│  React 18 + TypeScript + Material-UI + Vite + React Router  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend API                          │
│         .NET 8 Web API + JWT + Rate Limiting + Health       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│    Business Logic + DTOs + Validators + Mediator Pattern    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                       │
│     EF Core + Repositories + Security + Tenancy + Caching   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Domain Layer                          │
│        Entities + Enums + Value Objects + Domain Events      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       SQL Server                              │
│                 + Redis Cache (Optional)                     │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 4.x
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Context API + Custom Hooks
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors for token refresh
- **Form Handling**: React Hook Form + Yup validation
- **Date Handling**: date-fns
- **Notifications**: notistack
- **Charts**: Recharts
- **Testing**: Vitest + React Testing Library + Cypress

### Backend
- **Framework**: .NET 8 Web API
- **ORM**: Entity Framework Core 8
- **Database**: SQL Server 2019+ / LocalDB
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based + Policy-based
- **Logging**: Serilog with file, console, and seq sinks
- **Documentation**: Swagger/OpenAPI with JWT support
- **Caching**: In-memory + Redis ready
- **Health Checks**: Database, memory, disk space
- **Rate Limiting**: Fixed window (100 requests/minute)
- **Testing**: xUnit + Moq + FluentAssertions
- **API Versioning**: URL path versioning

## 📁 Complete Project Structure

```
New-Insurex/
├── insurex-react/                           # Frontend React application
│   ├── public/                              # Static assets
│   │   ├── favicon.ico
│   │   ├── logo192.png
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/                       # Reusable UI components
│   │   │   ├── Auth/                         # Authentication components
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── Layout/                        # Layout components
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── MainLayout.tsx
│   │   │   ├── Common/                         # Common components
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── StatusChip.tsx
│   │   │   │   ├── ConfirmationDialog.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── ErrorBoundary.tsx
│   │   │   ├── Forms/                          # Form components
│   │   │   │   ├── PolicyForm.tsx
│   │   │   │   ├── ClaimForm.tsx
│   │   │   │   └── AssetForm.tsx
│   │   │   ├── Charts/                         # Chart components
│   │   │   │   ├── LineChart.tsx
│   │   │   │   ├── BarChart.tsx
│   │   │   │   └── PieChart.tsx
│   │   │   └── Notifications/                   # Notification system
│   │   │       └── NotificationProvider.tsx
│   │   ├── hooks/                               # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── usePolicies.ts
│   │   │   ├── useClaims.ts
│   │   │   ├── useAssets.ts
│   │   │   ├── usePartners.ts
│   │   │   ├── useBilling.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useDebounce.ts
│   │   ├── pages/                                # Page components
│   │   │   ├── auth/                             # Authentication pages
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── ForgotPassword.tsx
│   │   │   │   └── ResetPassword.tsx
│   │   │   ├── dashboard/                         # Dashboard
│   │   │   │   └── Dashboard.tsx
│   │   │   ├── policies/                          # Policy management
│   │   │   │   ├── PolicyList.tsx
│   │   │   │   ├── PolicyDetails.tsx
│   │   │   │   ├── PolicyCreate.tsx
│   │   │   │   └── PolicyEdit.tsx
│   │   │   ├── claims/                            # Claims management
│   │   │   │   ├── ClaimList.tsx
│   │   │   │   ├── ClaimDetails.tsx
│   │   │   │   ├── ClaimCreate.tsx
│   │   │   │   └── ClaimProcess.tsx
│   │   │   ├── assets/                            # Asset management
│   │   │   │   ├── AssetList.tsx
│   │   │   │   ├── AssetDetails.tsx
│   │   │   │   ├── AssetCreate.tsx
│   │   │   │   └── AssetEdit.tsx
│   │   │   ├── partners/                          # Partner management
│   │   │   │   ├── PartnerList.tsx
│   │   │   │   ├── PartnerDetails.tsx
│   │   │   │   └── PartnerCreate.tsx
│   │   │   ├── billing/                           # Billing & invoices
│   │   │   │   ├── InvoiceList.tsx
│   │   │   │   ├── InvoiceDetails.tsx
│   │   │   │   ├── InvoiceCreate.tsx
│   │   │   │   └── PaymentModal.tsx
│   │   │   ├── reports/                           # Reports & analytics
│   │   │   │   ├── ClaimsReport.tsx
│   │   │   │   ├── FinancialReport.tsx
│   │   │   │   └── AssetValuation.tsx
│   │   │   ├── profile/                           # User profile
│   │   │   │   └── Profile.tsx
│   │   │   └── settings/                          # System settings
│   │   │       └── Settings.tsx
│   │   ├── services/                              # API service layer
│   │   │   ├── api.service.ts                     # Axios configuration
│   │   │   ├── auth.service.ts
│   │   │   ├── policy.service.ts
│   │   │   ├── claim.service.ts
│   │   │   ├── asset.service.ts
│   │   │   ├── partner.service.ts
│   │   │   ├── invoice.service.ts
│   │   │   └── dashboard.service.ts
│   │   ├── types/                                 # TypeScript definitions
│   │   │   ├── auth.types.ts
│   │   │   ├── policy.types.ts
│   │   │   ├── claim.types.ts
│   │   │   ├── asset.types.ts
│   │   │   ├── partner.types.ts
│   │   │   ├── invoice.types.ts
│   │   │   └── api.types.ts
│   │   ├── utils/                                 # Utility functions
│   │   │   ├── dateUtils.ts
│   │   │   ├── formatUtils.ts
│   │   │   ├── validationUtils.ts
│   │   │   └── constants.ts
│   │   ├── context/                               # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── NotificationContext.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── InsureX.API/                                   # Backend API layer
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── PoliciesController.cs
│   │   ├── ClaimsController.cs
│   │   ├── AssetsController.cs
│   │   ├── PartnersController.cs
│   │   ├── InvoicesController.cs
│   │   ├── DashboardController.cs
│   │   └── HealthController.cs
│   ├── Middleware/
│   │   ├── ErrorHandlingMiddleware.cs
│   │   ├── RequestValidationMiddleware.cs
│   │   ├── RequestTimingMiddleware.cs
│   │   ├── SecurityHeadersMiddleware.cs
│   │   └── TenantMiddleware.cs
│   ├── Extensions/
│   │   ├── ServiceExtensions.cs
│   │   └── ApplicationBuilderExtensions.cs
│   ├── Program.cs
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   └── Dockerfile
│
├── InsureX.Application/                           # Application logic
│   ├── DTOs/
│   │   ├── Auth/
│   │   ├── Policies/
│   │   ├── Claims/
│   │   ├── Assets/
│   │   ├── Partners/
│   │   ├── Invoices/
│   │   └── Filters/
│   │       ├── PaginationRequest.cs
│   │       ├── ClaimFilterRequest.cs
│   │       ├── PolicyFilterRequest.cs
│   │       ├── AssetFilterRequest.cs
│   │       └── InvoiceFilterRequest.cs
│   ├── Interfaces/
│   │   ├── Services/
│   │   │   ├── IAuthService.cs
│   │   │   ├── IPolicyService.cs
│   │   │   ├── IClaimService.cs
│   │   │   ├── IAssetService.cs
│   │   │   ├── IPartnerService.cs
│   │   │   └── IInvoiceService.cs
│   │   └── Repositories/
│   ├── Services/
│   │   ├── AuthService.cs
│   │   ├── PolicyService.cs
│   │   ├── ClaimService.cs
│   │   ├── AssetService.cs
│   │   ├── PartnerService.cs
│   │   └── InvoiceService.cs
│   ├── Exceptions/
│   │   ├── NotFoundException.cs
│   │   ├── ValidationException.cs
│   │   ├── UnauthorizedException.cs
│   │   ├── ForbiddenException.cs
│   │   └── ConflictException.cs
│   ├── Validators/
│   │   ├── CreatePolicyValidator.cs
│   │   ├── CreateClaimValidator.cs
│   │   └── RegisterValidator.cs
│   └── Mappings/
│       └── MappingProfile.cs
│
├── InsureX.Domain/                                # Domain entities
│   ├── Entities/
│   │   ├── Base/
│   │   │   ├── BaseEntity.cs
│   │   │   ├── IAuditableEntity.cs
│   │   │   ├── ISoftDelete.cs
│   │   │   └── ITenantEntity.cs
│   │   ├── Policy.cs
│   │   ├── Claim.cs
│   │   ├── Asset.cs
│   │   ├── Partner.cs
│   │   ├── Invoice.cs
│   │   ├── Payment.cs
│   │   ├── Document.cs
│   │   ├── Note.cs
│   │   ├── User.cs
│   │   └── Tenant.cs
│   ├── Enums/
│   │   ├── PolicyStatus.cs
│   │   ├── ClaimStatus.cs
│   │   ├── ClaimType.cs
│   │   ├── AssetType.cs
│   │   ├── AssetStatus.cs
│   │   ├── PartnerType.cs
│   │   ├── InvoiceStatus.cs
│   │   ├── PaymentMethod.cs
│   │   └── UserRole.cs
│   ├── ValueObjects/
│   │   ├── Address.cs
│   │   ├── Money.cs
│   │   ├── DateRange.cs
│   │   └── ContactInfo.cs
│   └── Interfaces/
│       ├── IRepository.cs
│       ├── IPolicyRepository.cs
│       ├── IClaimRepository.cs
│       └── ...
│
├── InsureX.Infrastructure/                        # Infrastructure
│   ├── Context/
│   │   └── ApplicationDbContext.cs
│   ├── Repositories/
│   │   ├── Repository.cs
│   │   ├── PolicyRepository.cs
│   │   ├── ClaimRepository.cs
│   │   ├── AssetRepository.cs
│   │   ├── PartnerRepository.cs
│   │   └── InvoiceRepository.cs
│   ├── Security/
│   │   ├── JwtService.cs
│   │   ├── PasswordHasher.cs
│   │   └── CurrentUserService.cs
│   ├── Tenancy/
│   │   └── TenantService.cs
│   ├── Migrations/
│   └── DependencyInjection.cs
│
├── InsureX.Shared/                                # Shared DTOs
│   ├── ApiResponse.cs
│   ├── PagedResult.cs
│   └── DTOs/
│
├── InsureX.Tests/                                 # Unit tests
│   ├── Application/
│   │   ├── Services/
│   │   └── Validators/
│   ├── Domain/
│   └── Infrastructure/
│
├── InsureX.SeedTool/                              # Data seeding tool
│   ├── Program.cs
│   ├── SeedData/
│   └── appsettings.json
│
├── IAPR_Web/                                       # Legacy ASP.NET Web Forms
├── database/                                        # Database scripts
│   ├── scripts/
│   └── backups/
├── _Archive/                                        # Archived files
│
├── .github/workflows/                               # GitHub Actions CI/CD
│   ├── build.yml
│   ├── test.yml
│   └── deploy.yml
│
├── docker-compose.yml                               # Docker composition
├── docker-compose.override.yml
├── Dockerfile                                       # Root Dockerfile
├── Directory.Packages.props                         # Central package management
├── InsureX.sln                                      # Visual Studio solution
├── README.md                                         # This file
├── Checklist.md                                      # Development checklist
├── CRITICAL_FIXES_COMPLETE.md                        # Backend completion report
├── TODO.md                                           # Build fix tracking
└── notes.md                                          # Command reference
```

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18.x or higher |
| npm or yarn | Latest |
| .NET SDK | 8.0 |
| SQL Server | 2019+ or LocalDB |
| Git | Latest |
| Visual Studio 2022 / VS Code | Latest |

### Quick Start (5 minutes)

#### 1. Clone the Repository
```bash
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex
```

#### 2. Backend Setup
```bash
# Navigate to API project
cd InsureX.API

# Restore NuGet packages
dotnet restore

# Update the connection string in appsettings.Development.json
# Default: "Server=(localdb)\\MSSQLLocalDB;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"

# Run database migrations
dotnet ef database update

# Run the API
dotnet run
```
Backend will run at: `https://localhost:7001` | `http://localhost:5001`
Swagger UI: `https://localhost:7001/swagger`

#### 3. Frontend Setup (new terminal)
```bash
# Navigate to React app
cd insurex-react

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your API URL:
# VITE_API_URL=https://localhost:7001/api

# Start development server
npm run dev
```
Frontend will run at: `http://localhost:3000`

#### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: https://localhost:7001/swagger
- **Health Checks**:
  - `/health` - Overall health
  - `/health/ready` - Readiness probe
  - `/health/live` - Liveness probe
- **Default Login**: admin@insurex.com / Admin123!

## 🔌 Complete API Endpoints

### Authentication
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/register` | New registration | Public |
| POST | `/api/auth/refresh` | Refresh token | Public |
| POST | `/api/auth/logout` | Logout user | Authenticated |
| GET | `/api/auth/me` | Current user | Authenticated |
| POST | `/api/auth/change-password` | Change password | Authenticated |
| POST | `/api/auth/forgot-password` | Request password reset | Public |
| POST | `/api/auth/reset-password` | Reset password | Public |

### Policies
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/policies` | List all policies (paginated) | Admin, Insurer, Broker, Viewer |
| GET | `/api/policies/filter` | Advanced filter policies | Admin, Insurer, Broker |
| GET | `/api/policies/{id}` | Get policy details | Admin, Insurer, Broker, Viewer |
| GET | `/api/policies/number/{number}` | Get policy by number | Admin, Insurer, Broker |
| GET | `/api/policies/status/{status}` | Get policies by status | Admin, Insurer, Broker |
| POST | `/api/policies` | Create policy | Admin, Insurer, Broker |
| PUT | `/api/policies/{id}` | Update policy | Admin, Insurer |
| DELETE | `/api/policies/{id}` | Delete policy | Admin |
| POST | `/api/policies/{id}/activate` | Activate policy | Admin, Insurer |
| POST | `/api/policies/{id}/cancel` | Cancel policy | Admin, Insurer |
| POST | `/api/policies/{id}/renew` | Renew policy | Admin, Insurer |
| GET | `/api/policies/stats` | Policy statistics | Admin, Insurer, Manager |
| GET | `/api/policies/expiring` | Get expiring policies | Admin, Insurer |

### Claims
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/claims` | List all claims (paginated) | Admin, Insurer, ClaimsProcessor, Viewer |
| GET | `/api/claims/filter` | Advanced filter claims | Admin, Insurer, ClaimsProcessor |
| GET | `/api/claims/{id}` | Get claim details | Admin, Insurer, ClaimsProcessor, Broker |
| GET | `/api/claims/number/{number}` | Get claim by number | Admin, Insurer, ClaimsProcessor |
| GET | `/api/claims/policy/{policyId}` | Get claims by policy | Admin, Insurer, ClaimsProcessor, Broker |
| GET | `/api/claims/status/{status}` | Get claims by status | Admin, Insurer, ClaimsProcessor |
| GET | `/api/claims/pending` | Get pending claims | Admin, Insurer, ClaimsProcessor |
| POST | `/api/claims` | Create claim | Admin, Insurer, Broker |
| PUT | `/api/claims/{id}` | Update claim | Admin, Insurer, ClaimsProcessor |
| DELETE | `/api/claims/{id}` | Delete claim | Admin |
| POST | `/api/claims/{id}/submit` | Submit claim | Admin, Insurer, Broker |
| POST | `/api/claims/{id}/approve` | Approve claim | Admin, Insurer, ClaimsProcessor |
| POST | `/api/claims/{id}/reject` | Reject claim | Admin, Insurer, ClaimsProcessor |
| POST | `/api/claims/{id}/pay` | Mark as paid | Admin, Insurer, ClaimsProcessor, Accountant |
| POST | `/api/claims/{id}/close` | Close claim | Admin, Insurer, ClaimsProcessor |
| GET | `/api/claims/summary/totals` | Get claim totals | Admin, Insurer, Manager |

### Assets
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/assets` | Get all assets (paginated) | Admin, Insurer, Viewer |
| GET | `/api/assets/filter` | Advanced filter assets | Admin, Insurer |
| GET | `/api/assets/{id}` | Get asset by ID | Admin, Insurer, Viewer |
| GET | `/api/assets/type/{type}` | Get assets by type | Admin, Insurer |
| GET | `/api/assets/status/{status}` | Get assets by status | Admin, Insurer |
| POST | `/api/assets` | Create asset | Admin, Insurer |
| PUT | `/api/assets/{id}` | Update asset | Admin, Insurer |
| DELETE | `/api/assets/{id}` | Delete asset | Admin |
| GET | `/api/assets/summary/total-value` | Get total asset value | Admin, Insurer, Manager |
| GET | `/api/assets/expiring-warranty` | Get assets with expiring warranty | Admin, Insurer |

### Partners
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/partners` | Get all partners (paginated) | Admin, Insurer, Viewer |
| GET | `/api/partners/filter` | Advanced filter partners | Admin, Insurer |
| GET | `/api/partners/{id}` | Get partner by ID | Admin, Insurer, Viewer |
| GET | `/api/partners/type/{type}` | Get partners by type | Admin, Insurer |
| POST | `/api/partners` | Create partner | Admin, Insurer |
| PUT | `/api/partners/{id}` | Update partner | Admin, Insurer |
| DELETE | `/api/partners/{id}` | Delete partner | Admin |
| GET | `/api/partners/stats` | Get partner statistics | Admin, Insurer, Manager |

### Invoices
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/invoices` | Get all invoices (paginated) | Admin, Insurer, Accountant, Viewer |
| GET | `/api/invoices/filter` | Advanced filter invoices | Admin, Insurer, Accountant |
| GET | `/api/invoices/{id}` | Get invoice by ID | Admin, Insurer, Accountant, Broker |
| GET | `/api/invoices/number/{number}` | Get invoice by number | Admin, Insurer, Accountant |
| GET | `/api/invoices/status/{status}` | Get invoices by status | Admin, Insurer, Accountant |
| GET | `/api/invoices/policy/{policyId}` | Get invoices by policy | Admin, Insurer, Accountant, Broker |
| GET | `/api/invoices/overdue` | Get overdue invoices | Admin, Insurer, Accountant |
| POST | `/api/invoices` | Create invoice | Admin, Insurer, Accountant |
| PUT | `/api/invoices/{id}` | Update invoice | Admin, Insurer, Accountant |
| DELETE | `/api/invoices/{id}` | Delete invoice | Admin |
| POST | `/api/invoices/{id}/send` | Mark invoice as sent | Admin, Insurer, Accountant |
| POST | `/api/invoices/{id}/payment` | Record payment | Admin, Insurer, Accountant |
| POST | `/api/invoices/{id}/cancel` | Cancel invoice | Admin, Insurer, Accountant |
| GET | `/api/invoices/summary/totals` | Get invoice totals | Admin, Insurer, Accountant, Manager |

### Dashboard
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/dashboard/summary` | Get dashboard summary | Admin, Insurer, Manager |
| GET | `/api/dashboard/claims-trend` | Get claims trend data | Admin, Insurer, Manager |
| GET | `/api/dashboard/revenue` | Get revenue data | Admin, Insurer, Accountant, Manager |
| GET | `/api/dashboard/recent-activities` | Get recent activities | Admin, Insurer, Manager |

### Health Checks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Overall health status |
| GET | `/health/ready` | Readiness probe (database) |
| GET | `/health/live` | Liveness probe |

## 👥 User Roles & Permissions

| Role | Permissions | Description |
|------|-------------|-------------|
| **Admin** | Full system access, user management, configuration, all endpoints | System administrator with complete control |
| **Manager** | Manage policies, claims, view reports, approve high-value items | Department manager with oversight |
| **Insurer** | Process claims, manage policies, view all data | Insurance company representative |
| **ClaimsProcessor** | Process and manage claims, view policy data | Dedicated claims handling team |
| **Broker/Agent** | Create policies, submit claims, view assigned data | External agents and brokers |
| **Accountant** | Manage invoices, process payments, view financial data | Finance team |
| **Underwriter** | Policy underwriting, risk assessment, pricing | Risk assessment specialists |
| **Viewer** | Read-only access to all data | Auditors, compliance officers |

## 🔐 Environment Variables

### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:5001/api
VITE_API_TIMEOUT=30000

# Application
VITE_APP_NAME=InsureX
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Features
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=false

# Authentication
VITE_TOKEN_STORAGE_KEY=insurex_token
VITE_REFRESH_TOKEN_KEY=insurex_refresh
```

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-with-at-least-32-characters-here-make-it-long",
    "Issuer": "InsureX",
    "Audience": "InsureXClient",
    "ExpirationHours": 24,
    "RefreshTokenExpirationDays": 7
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning",
        "Microsoft.Hosting.Lifetime": "Information"
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
  },
  "RateLimiting": {
    "PermitLimit": 100,
    "WindowSeconds": 60
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000", "https://localhost:3000"]
  },
  "AllowedHosts": "*"
}
```

## 🐳 Docker Deployment

### Docker Compose (Full Stack)
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

### Individual Images
```bash
# Build backend image
docker build -t insurex-api -f InsureX.API/Dockerfile .

# Build frontend image
docker build -t insurex-frontend -f insurex-react/Dockerfile .

# Run containers
docker run -d -p 8080:80 --name insurex-api insurex-api
docker run -d -p 3000:3000 --name insurex-frontend insurex-frontend

# Run with environment variables
docker run -d -p 8080:80 \
  -e "ConnectionStrings__DefaultConnection=Server=sqlserver;Database=InsureX;User=sa;Password=Your_password123" \
  --name insurex-api insurex-api
```

### Docker Compose File
```yaml
version: '3.8'

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      SA_PASSWORD: "Your_password123"
      ACCEPT_EULA: "Y"
    ports:
      - "1433:1433"
    volumes:
      - sql_data:/var/opt/mssql
    healthcheck:
      test: ["CMD", "/opt/mssql-tools/bin/sqlcmd", "-S", "localhost", "-U", "sa", "-P", "Your_password123", "-Q", "SELECT 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: InsureX.API/Dockerfile
    ports:
      - "5000:80"
      - "5001:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ASPNETCORE_URLS=https://+:443;http://+:80
      - ASPNETCORE_Kestrel__Certificates__Default__Password=password
      - ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx
      - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=InsureX_Dev;User=sa;Password=Your_password123;TrustServerCertificate=true
      - JwtSettings__SecretKey=your-super-secret-key-with-at-least-32-characters
    volumes:
      - ~/.aspnet/https:/https:ro
    depends_on:
      sqlserver:
        condition: service_healthy

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
  sql_data:
```

## 📊 Database Migrations

```bash
# Navigate to API project
cd InsureX.API

# Add new migration
dotnet ef migrations add AddClaimWorkflow --project ../InsureX.Infrastructure

# Apply migrations
dotnet ef database update --project ../InsureX.Infrastructure

# Remove last migration (if not applied)
dotnet ef migrations remove --project ../InsureX.Infrastructure

# List all migrations
dotnet ef migrations list --project ../InsureX.Infrastructure

# Generate SQL script
dotnet ef migrations script --project ../InsureX.Infrastructure -o script.sql

# Reset database (drop and re-create)
dotnet ef database drop --project ../InsureX.Infrastructure --force
dotnet ef database update --project ../InsureX.Infrastructure

# Create migration with specific name
dotnet ef migrations add InitialCreate --output-dir Migrations --project ../InsureX.Infrastructure
```

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
dotnet test

# Run with verbose output
dotnet test -v n

# Run specific test class
dotnet test --filter "FullyQualifiedName~ClaimServiceTests"

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage" --results-directory ./TestResults

# Generate coverage report (install tool first)
dotnet tool install -g dotnet-reportgenerator-globaltool
reportgenerator -reports:"./TestResults/**/coverage.cobertura.xml" -targetdir:"CoverageReport" -reporttypes:Html

# Run integration tests
dotnet test --filter "Category=Integration"

# Run unit tests only
dotnet test --filter "Category=Unit"
```

### Frontend Tests
```bash
# Navigate to frontend
cd insurex-react

# Run all tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- PolicyList.test.tsx

# Run E2E tests with Cypress
npx cypress open
npx cypress run

# Run E2E tests headlessly
npx cypress run --headless
```

## 📈 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: React.lazy() and Suspense for route-based chunking
- **Virtualized Lists**: React Window for large datasets
- **Debounced Search**: 300ms delay on search inputs
- **Memoization**: useMemo and useCallback for expensive computations
- **Image Optimization**: Lazy loading and responsive images
- **Bundle Analysis**: `npm run build -- --analyze`
- **Tree Shaking**: Remove unused imports

### Backend Optimizations
- **Response Caching**: In-memory cache for frequently accessed data
- **Pagination**: All list endpoints support page number and size
- **Compiled Queries**: EF Core compiled queries for performance
- **Database Indexing**: Indexes on frequently queried columns
- **Connection Pooling**: Optimized SQL connection pooling
- **Async/Await**: All I/O operations are async
- **Query Optimization**: Eager loading vs explicit loading strategy
- **Redis Cache**: Ready for distributed caching (optional)

## 🔒 Security Features

### Implemented Security Measures
- **JWT Authentication**: Bearer token with refresh token rotation
- **Role-Based Access Control**: 8 roles with granular permissions
- **Policy-Based Authorization**: Custom policies for complex rules
- **Rate Limiting**: 100 requests per minute per IP
- **CORS Policy**: Strict allowed origins configuration
- **Security Headers**:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Content-Security-Policy: restrictive defaults
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: geolocation=(), microphone=(), camera=()
- **SQL Injection Prevention**: EF Core parameterized queries
- **Audit Trail**: All entities track CreatedBy, CreatedAt, UpdatedBy, UpdatedAt
- **Soft Delete**: Data retention with IsDeleted flag and restore capability
- **Password Hashing**: BCrypt with salt
- **HTTPS Enforcement**: Redirect HTTP to HTTPS in production
- **Request Validation**: Global validation middleware
- **Error Handling**: No stack traces in production responses

## 📊 Response Format Standardization

All API endpoints return standardized responses:

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": 1,
    "name": "Example"
  },
  "errors": null,
  "statusCode": 200,
  "traceId": "0HM8E1V5Q5J4S:00000001"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Retrieved successfully",
  "data": {
    "items": [...],
    "totalCount": 100,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 10,
    "hasPreviousPage": false,
    "hasNextPage": true
  },
  "errors": null,
  "statusCode": 200,
  "traceId": "0HM8E1V5Q5J4S:00000002"
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    "Policy number is required",
    "Start date must be in the future"
  ],
  "statusCode": 400,
  "traceId": "0HM8E1V5Q5J4S:00000003"
}
```

### Not Found Response (404)
```json
{
  "success": false,
  "message": "Policy with ID 123 not found",
  "data": null,
  "errors": null,
  "statusCode": 404,
  "traceId": "0HM8E1V5Q5J4S:00000004"
}
```

## 🚀 Deployment

### Azure App Service
```bash
# Install Azure CLI
az login

# Create resource group
az group create --name insurex-rg --location eastus

# Create App Service plan
az appservice plan create --name insurex-plan --resource-group insurex-rg --sku B1 --is-linux

# Create Web App for backend
az webapp create --resource-group insurex-rg --plan insurex-plan --name insurex-api --runtime "DOTNET:8"

# Create Web App for frontend
az webapp create --resource-group insurex-rg --plan insurex-plan --name insurex-app --runtime "NODE:18-lts"

# Deploy backend
cd InsureX.API
dotnet publish -c Release
cd bin/Release/net8.0/publish
zip -r deploy.zip .
az webapp deployment source config-zip --resource-group insurex-rg --name insurex-api --src deploy.zip

# Deploy frontend
cd insurex-react
npm run build
cd dist
zip -r deploy.zip .
az webapp deployment source config-zip --resource-group insurex-rg --name insurex-app --src deploy.zip

# Configure environment variables
az webapp config appsettings set --resource-group insurex-rg --name insurex-api --settings JwtSettings__SecretKey="your-secret-key"
```

### GitHub Actions CI/CD
The repository includes GitHub Actions workflows for:
- **Build**: On push to main/develop
- **Test**: On pull requests
- **Deploy**: On release/tag

## 📈 Monitoring & Logging

### Health Checks
- `/health` - Overall system health
- `/health/ready` - Readiness (database connection)
- `/health/live` - Liveness (application running)

### Structured Logging (Serilog)
- Console sink for development
- File sink with daily rolling
- Enriched with:
  - Machine name
  - Environment
  - Thread ID
  - Correlation ID
  - User ID (when authenticated)

### Performance Metrics
- Request duration tracking
- Database query performance
- Memory usage
- CPU usage
- Active connections

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description |
|------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Code style (formatting, missing semicolons) |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `perf:` | Performance improvement |
| `test:` | Adding missing tests |
| `chore:` | Maintenance (dependencies, build tools) |
| `ci:` | CI/CD configuration |

### Pull Request Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/passed
- [ ] Documentation updated
- [ ] No breaking changes without discussion
- [ ] Branch is up to date with main

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [https://docs.insurex.com](https://docs.insurex.com)
- **Issues**: [GitHub Issues](https://github.com/luigi043/New-Insurex/issues)
- **Email**: support@insurex.com
- **Discord**: [Join our Discord](https://discord.gg/insurex)

## 🙏 Acknowledgments

- React Team for amazing frontend library
- .NET Team for robust backend framework
- Material-UI for beautiful components
- All contributors and testers
- Open source community

## 📊 Project Status Dashboard

| Metric | Status |
|--------|--------|
| **Overall Progress** | 58% Complete |
| **Backend Completion** | 95% Complete |
| **Frontend Completion** | 45% Complete |
| **Testing Coverage** | 35% |
| **Open Issues** | 12 |
| **Last Release** | v1.0.0-beta |

---

**Last Updated**: 2026-03-05
**Next Milestone**: Frontend UI Completion (April 2026)
**Version**: 1.0.0-beta