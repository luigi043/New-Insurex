# InsureX - Insurance Management System

A full-stack insurance management platform with a modern React frontend and a robust .NET 8 Web API backend, built with Clean Architecture principles.

![InsureX Platform](https://via.placeholder.com/1200x400/1976d2/ffffff?text=InsureX+Insurance+Management+System)

## 📋 Overview

InsureX is a comprehensive insurance management system designed to streamline policy management, claims processing, asset tracking, partner management, and billing operations. The platform features role-based access control, workflow state management, and a responsive modern UI.

### ✨ Key Features

| Module | Capabilities |
|--------|--------------|
| **Policy Management** | Full lifecycle management (Draft → Active → Expired/Cancelled) |
| **Claims Processing** | Complete workflow with state transitions (Submitted → Approved/Rejected → Paid) |
| **Asset Management** | Track 11+ asset types across multiple categories |
| **Partner Management** | Manage agencies, brokers, insurers, and service providers |
| **Billing & Invoicing** | Automated invoice generation and payment tracking |
| **Multi-tenancy** | Tenant isolation with global query filters |
| **RBAC** | 6 user roles with granular permissions |

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
│                    .NET 8 Web API + JWT                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│              Business Logic + DTOs + Validators              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                       │
│            EF Core + Repositories + Security + Tenancy       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Domain Layer                          │
│              Entities + Enums + Value Objects                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       SQL Server                              │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Context API + Custom Hooks
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors

### Backend
- **Framework**: .NET 8 Web API
- **ORM**: Entity Framework Core
- **Database**: SQL Server
- **Authentication**: JWT with refresh tokens
- **Logging**: Serilog
- **Documentation**: Swagger/OpenAPI
- **Testing**: xUnit

## 📁 Project Structure

```
New-Insurex/
├── insurex-react/                    # Frontend React application
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Auth/                 # Authentication components
│   │   │   ├── Layout/               # Layout components
│   │   │   └── Notifications/        # Notification system
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── usePolicies.ts
│   │   │   ├── useClaims.ts
│   │   │   ├── useAssets.ts
│   │   │   ├── usePartners.ts
│   │   │   └── useBilling.ts
│   │   ├── pages/                     # Page components
│   │   │   ├── auth/                  # Login, Register, ForgotPassword
│   │   │   ├── dashboard/              # Dashboard
│   │   │   ├── policies/               # Policy management
│   │   │   ├── claims/                 # Claims management
│   │   │   ├── assets/                 # Asset management
│   │   │   ├── partners/               # Partner management
│   │   │   ├── billing/                # Billing & invoices
│   │   │   ├── reports/                # Reports & analytics
│   │   │   ├── profile/                # User profile
│   │   │   └── settings/               # System settings
│   │   ├── services/                   # API service layer
│   │   │   ├── api.service.ts          # Axios configuration
│   │   │   ├── auth.service.ts
│   │   │   ├── policy.service.ts
│   │   │   └── ...
│   │   ├── types/                       # TypeScript definitions
│   │   ├── utils/                        # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── InsureX.API/                         # Backend API layer
├── InsureX.Application/                  # Application logic
├── InsureX.Domain/                       # Domain entities
├── InsureX.Infrastructure/                # Infrastructure
├── InsureX.Shared/                        # Shared DTOs
├── InsureX.Tests/                         # Unit tests
├── InsureX.SeedTool/                      # Data seeding tool
│
├── IAPR_Web/                              # Legacy ASP.NET Web Forms
├── database/                               # Database scripts
├── _Archive/                               # Archived files
│
├── .github/workflows/                      # GitHub Actions CI/CD
├── docker-compose.yml                       # Docker composition
├── Dockerfile                               # Docker build file
├── Directory.Packages.props                 # Central package management
├── InsureX.sln                              # Visual Studio solution
├── README.md                                # This file
├── Checklist.md                             # Development checklist
└── notes.md                                 # Command reference
```

## 🚀 Getting Started

New contributors should start with the onboarding guide in `ONBOARDING.md`.

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18.x or higher |
| npm or yarn | Latest |
| .NET SDK | 8.0 |
| SQL Server | 2019+ or LocalDB |
| Git | Latest |

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

# Update database (update connection string in appsettings.Development.json first)
dotnet ef database update

# Run the API
dotnet run
```
Backend will run at: `https://localhost:7001` | `http://localhost:5001`

#### 3. Frontend Setup (new terminal)
```bash
# Navigate to React app
cd insurex-react

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API URL: VITE_API_URL=https://localhost:7001/api

# Start development server
npm run dev
```
Frontend will run at: `http://localhost:3000`

#### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: https://localhost:7001/swagger
- **Default Login**: admin@insurex.com / Admin123!

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | New registration |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/me` | Current user |

### Policies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/policies` | List all policies |
| GET | `/api/policies/{id}` | Get policy details |
| POST | `/api/policies` | Create policy |
| PUT | `/api/policies/{id}` | Update policy |
| POST | `/api/policies/{id}/activate` | Activate policy |
| POST | `/api/policies/{id}/cancel` | Cancel policy |
| POST | `/api/policies/{id}/renew` | Renew policy |
| GET | `/api/policies/stats` | Policy statistics |

### Claims
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/claims` | List all claims |
| GET | `/api/claims/{id}` | Get claim details |
| POST | `/api/claims` | Create claim |
| POST | `/api/claims/{id}/submit` | Submit claim |
| POST | `/api/claims/{id}/approve` | Approve claim |
| POST | `/api/claims/{id}/reject` | Reject claim |
| POST | `/api/claims/{id}/pay` | Mark as paid |
| GET | `/api/claims/stats` | Claim statistics |

### Assets, Partners, Invoices
Similar CRUD endpoints available for each module.

## 👥 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, configuration |
| **Manager** | Manage policies, claims, view reports |
| **Insurer** | Process claims, manage policies |
| **Broker/Agent** | Create policies, submit claims |
| **Accountant** | Manage invoices, process payments |
| **Viewer** | Read-only access to data |

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
VITE_APP_NAME=InsureX
VITE_APP_VERSION=1.0.0
```

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-with-at-least-32-characters",
    "Issuer": "InsureX",
    "Audience": "InsureXClient",
    "ExpirationHours": 24
  }
}
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Build individual images
docker build -t insurex-api -f InsureX.API/Dockerfile .
docker build -t insurex-frontend -f insurex-react/Dockerfile .

# Run containers
docker run -p 8080:80 insurex-api
docker run -p 3000:3000 insurex-frontend
```

## 📊 Database Migrations

```bash
# Add new migration
cd InsureX.API
dotnet ef migrations add MigrationName --project ../InsureX.Infrastructure

# Apply migrations
dotnet ef database update --project ../InsureX.Infrastructure

# Remove last migration
dotnet ef migrations remove --project ../InsureX.Infrastructure

# Generate SQL script
dotnet ef migrations script --project ../InsureX.Infrastructure
```

## 🧪 Testing

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Frontend tests (when implemented)
cd insurex-react
npm test
npm run test:coverage
```

## 📈 Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Virtualized lists for large datasets
- Debounced search inputs
- Memoized selectors with useMemo/useCallback

### Backend
- Response caching
- Pagination for all list endpoints
- Compiled queries
- Database indexing strategy

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Role-Based Access Control** (RBAC)
- **Rate Limiting** (100 requests per minute)
- **CORS** policy configuration
- **Security Headers** (XSS, CSRF protection)
- **SQL Injection** prevention via EF Core
- **Audit Trail** for all entities
- **Soft Delete** pattern

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code refactoring
- `test:` Testing
- `chore:` Maintenance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [https://docs.insurex.com](https://docs.insurex.com)
- **Issues**: [GitHub Issues](https://github.com/luigi043/New-Insurex/issues)
- **Email**: support@insurex.com

## 🙏 Acknowledgments

- React Team for amazing frontend library
- .NET Team for robust backend framework
- Material-UI for beautiful components
- All contributors and testers
