# InsureX - Insurance Management System

A comprehensive .NET 8 Web API for insurance management, built with Clean Architecture principles.

## Features

### Core Modules
- **Policy Management** - Create, manage, and track insurance policies
- **Claims Processing** - Full claims lifecycle with workflow state management
- **Asset Management** - Track insured assets across multiple categories
- **Partner Management** - Manage agencies, brokers, insurers, and service providers
- **Billing & Invoicing** - Generate invoices and track payments
- **Multi-tenancy** - Tenant isolation with global query filters

### Architecture & Production Features
- **Clean Architecture** - Domain, Application, Infrastructure, API layers
- **JWT Authentication** - Secure token-based authentication
- **RBAC (Role-Based Access Control)** - Admin, Insurer, Broker, Viewer, ClaimsProcessor, Accountant roles
- **Workflow State Management** - Policy and Claim lifecycle states with transition validation
- **Structured Logging** - Serilog with file and console sinks
- **Global Exception Handling** - Centralized error handling with standardized responses
- **Health Checks** - Database and memory health monitoring
- **Rate Limiting** - API rate limiting protection
- **Security Headers** - XSS, CSRF, and other security protections
- **Audit Trail** - Automatic audit fields on all entities
- **Soft Delete** - Data retention with soft delete pattern

## Project Structure

```
InsureX/
├── InsureX.Domain/           # Domain entities, enums, interfaces
│   ├── Entities/             # Domain entities
│   ├── Enums/                # Enumeration types
│   ├── Interfaces/           # Repository interfaces
│   └── ValueObjects/         # Value objects
├── InsureX.Application/      # Application layer
│   ├── DTOs/                 # Data transfer objects
│   ├── Exceptions/           # Custom exceptions
│   ├── Interfaces/           # Service interfaces
│   ├── Services/             # Business logic services
│   └── Validators/           # Input validators
├── InsureX.Infrastructure/   # Infrastructure layer
│   ├── Context/              # DbContext
│   ├── Repositories/         # Repository implementations
│   ├── Security/             # JWT and security
│   └── Tenancy/              # Tenant context
└── InsureX.API/              # API layer
    ├── Controllers/          # API controllers
    └── Middleware/           # Custom middleware
```

## Getting Started

### Prerequisites
- .NET 8 SDK
- SQL Server (LocalDB or full instance)
- Visual Studio 2022 or VS Code

### Installation

1. Clone the repository
```bash
git clone https://github.com/luigi043/New-Insurex.git
cd InsureX
```

2. Update connection string in `appsettings.Development.json`
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
```

3. Update JWT settings (for production, use a secure secret)
```json
"JwtSettings": {
  "SecretKey": "your-super-secret-key-with-at-least-32-characters",
  "Issuer": "InsureX",
  "Audience": "InsureXClient",
  "ExpirationHours": "24"
}
```

4. Run database migrations
```bash
cd InsureX.API
dotnet ef migrations add InitialCreate --project ../InsureX.Infrastructure
dotnet ef database update --project ../InsureX.Infrastructure
```

5. Run the application
```bash
dotnet run
```

The API will be available at `https://localhost:7001` and `http://localhost:5001`

### Swagger Documentation

When running in Development mode, Swagger UI is available at:
- https://localhost:7001/swagger

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/register` - Register new user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Policies
- `GET /api/policies` - Get all policies
- `GET /api/policies/{id}` - Get policy by ID
- `POST /api/policies` - Create new policy
- `PUT /api/policies/{id}` - Update policy
- `DELETE /api/policies/{id}` - Delete policy
- `POST /api/policies/{id}/activate` - Activate policy
- `POST /api/policies/{id}/cancel` - Cancel policy
- `POST /api/policies/{id}/renew` - Renew policy

### Claims
- `GET /api/claims` - Get all claims
- `GET /api/claims/{id}` - Get claim by ID
- `POST /api/claims` - Create new claim
- `PUT /api/claims/{id}` - Update claim
- `DELETE /api/claims/{id}` - Delete claim
- `POST /api/claims/{id}/submit` - Submit claim
- `POST /api/claims/{id}/approve` - Approve claim
- `POST /api/claims/{id}/reject` - Reject claim
- `POST /api/claims/{id}/pay` - Mark claim as paid
- `POST /api/claims/{id}/close` - Close claim

### Assets
- `GET /api/assets` - Get all assets
- `GET /api/assets/{id}` - Get asset by ID
- `POST /api/assets` - Create new asset
- `PUT /api/assets/{id}` - Update asset
- `DELETE /api/assets/{id}` - Delete asset

### Partners
- `GET /api/partners` - Get all partners
- `GET /api/partners/{id}` - Get partner by ID
- `POST /api/partners` - Create new partner
- `PUT /api/partners/{id}` - Update partner
- `DELETE /api/partners/{id}` - Delete partner

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/{id}` - Get invoice by ID
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/{id}` - Update invoice
- `POST /api/invoices/{id}/send` - Send invoice
- `POST /api/invoices/{id}/payment` - Record payment
- `POST /api/invoices/{id}/cancel` - Cancel invoice

### Health Checks
- `GET /health` - Overall health status
- `GET /health/ready` - Readiness probe (database)
- `GET /health/live` - Liveness probe

## Role-Based Access Control

| Role | Permissions |
|------|-------------|
| Admin | Full access to all endpoints |
| Insurer | Manage policies, claims, partners, invoices |
| Broker | Create policies and claims, view data |
| ClaimsProcessor | Process and manage claims |
| Accountant | Manage invoices and payments |
| Viewer | Read-only access |

## Claim Workflow States

```
Submitted → UnderReview → Approved → Paid → Closed
                ↓
            Rejected
```

State transitions are validated to ensure proper workflow.

## Policy Lifecycle States

```
Draft → Pending → Active → Expired
  ↓       ↓        ↓
Cancelled Cancelled Cancelled
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ConnectionStrings__DefaultConnection` | SQL Server connection string | - |
| `JwtSettings__SecretKey` | JWT signing key | - |
| `JwtSettings__ExpirationHours` | Token expiration time | 24 |
| `Cors__AllowedOrigins` | Allowed CORS origins | localhost |

### Logging

Logs are written to:
- Console (all environments)
- `logs/log-YYYY-MM-DD.txt` (file sink)

Configure in `appsettings.json`:
```json
"Serilog": {
  "MinimumLevel": {
    "Default": "Information",
    "Override": {
      "Microsoft": "Warning"
    }
  }
}
```

## Testing

Run unit tests:
```bash
dotnet test
```

## Deployment

### Docker

Build Docker image:
```bash
docker build -t insurex-api .
```

Run container:
```bash
docker run -p 8080:80 -e "ConnectionStrings__DefaultConnection=..." insurex-api
```

### Azure App Service

1. Create an Azure SQL Database
2. Update connection string in Azure Portal
3. Deploy using GitHub Actions or Azure DevOps
4. Configure JWT secret in Application Settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@insurex.com or create an issue in the repository.
