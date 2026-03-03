# 🚀 InsureX Onboarding Guide

Welcome to **InsureX** - a comprehensive insurance management system built with modern technologies and best practices.

This guide will help you get started with the project, understand its structure, and become productive quickly.

---

## 📚 Table of Contents

1. [Welcome](#welcome)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Project Overview](#project-overview)
5. [Development Workflow](#development-workflow)
6. [Learning Resources](#learning-resources)
7. [Next Steps](#next-steps)

---

## 👋 Welcome

### What is InsureX?

InsureX is a full-stack insurance management platform that provides:

- **Policy Management**: Complete lifecycle management from draft to cancellation
- **Claims Processing**: Automated workflow with approval chains
- **Asset Management**: Track 11+ types of insurable assets
- **Partner Management**: Manage agencies, brokers, insurers, and service providers
- **Billing & Invoicing**: Automated invoice generation and payment tracking
- **Multi-tenancy**: Support for multiple organizations with data isolation
- **RBAC**: Role-based access control with 6 distinct user roles

### Technology Stack

**Frontend:**
- React 18 + TypeScript
- Material-UI (MUI) v5
- Vite (build tool)
- React Router v6
- Axios

**Backend:**
- .NET 8 Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- Serilog (logging)
- Swagger/OpenAPI

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Git version control

### Project Structure

```
New-Insurex/
├── insurex-react/              # Frontend React application
├── InsureX.API/                # Web API layer
├── InsureX.Application/        # Business logic
├── InsureX.Domain/             # Domain entities
├── InsureX.Infrastructure/     # Data access & infrastructure
├── InsureX.Shared/             # Shared DTOs
├── InsureX.Tests/              # Unit tests
├── InsureX.SeedTool/           # Database seeding tool
├── database/                   # Database scripts
├── docker-compose.yml          # Docker configuration
└── docs/                       # Documentation
```

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Tool | Version | Purpose | Download |
|------|---------|---------|----------|
| **Git** | Latest | Version control | [git-scm.com](https://git-scm.com/) |
| **Node.js** | 18.x+ | JavaScript runtime | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x+ | Package manager | Included with Node.js |
| **.NET SDK** | 8.0 | Backend framework | [dotnet.microsoft.com](https://dotnet.microsoft.com/) |
| **SQL Server** | 2019+ | Database | [microsoft.com/sql-server](https://www.microsoft.com/sql-server) |
| **Docker** | Latest | Containerization (optional) | [docker.com](https://www.docker.com/) |

### Recommended Tools

| Tool | Purpose |
|------|---------|
| **Visual Studio Code** | Code editor with excellent TypeScript/React support |
| **Visual Studio 2022** or **Rider** | .NET IDE for backend development |
| **Postman** or **Insomnia** | API testing |
| **SQL Server Management Studio** | Database management |
| **Git Bash** (Windows) | Better terminal experience |

### Verify Installation

Run these commands to verify your setup:

```bash
# Check Git
git --version
# Expected: git version 2.x.x

# Check Node.js
node --version
# Expected: v18.x.x or higher

# Check npm
npm --version
# Expected: 9.x.x or higher

# Check .NET SDK
dotnet --version
# Expected: 8.0.x

# Check SQL Server (Windows)
sqlcmd -?
# Should display help information
```

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/luigi043/New-Insurex.git

# Or via SSH
git clone git@github.com:luigi043/New-Insurex.git

# Navigate to project directory
cd New-Insurex
```

### 2️⃣ Backend Setup

```bash
# Navigate to API project
cd InsureX.API

# Restore NuGet packages
dotnet restore

# Update connection string in appsettings.Development.json
# Default: Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True

# Apply database migrations
dotnet ef database update --project ../InsureX.Infrastructure

# Run the API
dotnet run
```

✅ **Backend Running**: Navigate to `https://localhost:7001/swagger`

### 3️⃣ Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to React app
cd insurex-react

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your API URL
# VITE_API_URL=https://localhost:7001/api

# Start development server
npm run dev
```

✅ **Frontend Running**: Navigate to `http://localhost:3000`

### 4️⃣ Access the Application

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | admin@insurex.com / Admin123! |
| **API Swagger** | https://localhost:7001/swagger | N/A |
| **API Base** | https://localhost:7001/api | JWT token required |

### 5️⃣ Verify Everything Works

1. **Login to Frontend**: Use the default admin credentials
2. **Check Dashboard**: You should see the main dashboard
3. **Test API**: Open Swagger UI and try the `/api/auth/me` endpoint
4. **Check Database**: Connect to SQL Server and verify tables are created

---

## 🎯 Project Overview

### Architecture Pattern

InsureX follows **Clean Architecture** principles:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│              (insurex-react + InsureX.API)              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│         (InsureX.Application - Business Logic)          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Domain Layer                          │
│        (InsureX.Domain - Entities & Business Rules)     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                     │
│     (InsureX.Infrastructure - Data Access & Services)   │
└─────────────────────────────────────────────────────────┘
```

### Key Concepts

#### 1. Multi-tenancy
- Every entity belongs to a tenant
- Global query filters ensure data isolation
- Tenant context middleware automatically applies filters

#### 2. Role-Based Access Control (RBAC)
Six user roles with different permissions:
- **Admin**: Full system access
- **Manager**: Manage policies and claims
- **Insurer**: Process claims
- **Broker/Agent**: Create policies
- **Accountant**: Manage billing
- **Viewer**: Read-only access

#### 3. State Machines
Workflows are implemented using state machines:
- **Policy States**: Draft → Active → Expired/Cancelled
- **Claim States**: Draft → Submitted → UnderReview → Approved/Rejected → Paid

#### 4. Audit Trail
- All entity changes are automatically tracked
- Audit logs include: user, timestamp, action, old/new values
- Soft delete pattern prevents data loss

### Core Modules

#### Policy Management
- Create, update, activate, cancel, renew policies
- Support for multiple policy types and coverage options
- Automated premium calculations
- Document attachments

#### Claims Management
- Submit claims against policies
- Workflow-based approval process
- Document uploads (photos, receipts, etc.)
- Payment tracking

#### Asset Management
11 asset types across 4 categories:
- **Property**: Building, Home Contents, Land
- **Vehicle**: Car, Motorcycle, Truck, Trailer
- **Health**: Health Insurance, Life Insurance
- **Other**: Liability, Cyber Security

#### Partner Management
- Register and manage partners (agencies, brokers, insurers)
- Commission structures
- Performance metrics
- Contract management

#### Billing & Invoicing
- Automated invoice generation
- Payment processing
- Payment history
- Late fee calculations
- Reminders and notifications

---

## 💼 Development Workflow

### Daily Development

#### Starting Your Day

```bash
# Update your local repository
git pull origin main

# Check for dependency updates
cd insurex-react && npm install
cd ../InsureX.API && dotnet restore

# Start backend
cd InsureX.API
dotnet run

# Start frontend (new terminal)
cd insurex-react
npm run dev
```

#### Working on Features

1. **Create a Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**
   - Write code following project conventions
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Your Changes**
```bash
# Backend tests
dotnet test

# Frontend tests
cd insurex-react
npm test
```

4. **Commit Your Changes**
```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat: add new feature description"
```

5. **Push and Create PR**
```bash
# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add policy renewal functionality"
git commit -m "fix: resolve claim approval button not working"
git commit -m "docs: update API documentation for claims endpoint"
```

### Code Standards

#### Frontend (TypeScript/React)

```typescript
// ✅ Good: Use TypeScript interfaces
interface Policy {
  id: number;
  policyNumber: string;
  status: PolicyStatus;
  createdAt: Date;
}

// ✅ Good: Functional components with hooks
const PolicyList: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  
  useEffect(() => {
    fetchPolicies();
  }, []);
  
  return <div>{/* component JSX */}</div>;
};

// ✅ Good: Proper error handling
try {
  const response = await api.post('/policies', policyData);
  notify.success('Policy created successfully');
} catch (error) {
  notify.error('Failed to create policy');
  console.error(error);
}
```

#### Backend (C#/.NET)

```csharp
// ✅ Good: Use async/await
public async Task<PolicyDto> GetPolicyByIdAsync(int id)
{
    var policy = await _repository.GetByIdAsync(id);
    if (policy == null)
        throw new NotFoundException($"Policy with ID {id} not found");
    
    return _mapper.Map<PolicyDto>(policy);
}

// ✅ Good: Use dependency injection
public class PolicyService : IPolicyService
{
    private readonly IRepository<Policy> _repository;
    private readonly IMapper _mapper;
    
    public PolicyService(
        IRepository<Policy> repository,
        IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }
}

// ✅ Good: Use proper exception handling
try
{
    await _repository.AddAsync(entity);
    await _unitOfWork.SaveChangesAsync();
}
catch (DbUpdateException ex)
{
    _logger.LogError(ex, "Error saving entity");
    throw new ApplicationException("Failed to save changes", ex);
}
```

### Database Migrations

#### Creating a Migration

```bash
# Navigate to API project
cd InsureX.API

# Add new migration
dotnet ef migrations add MigrationName --project ../InsureX.Infrastructure

# Review the generated migration file
# Located in: InsureX.Infrastructure/Migrations/

# Apply migration to database
dotnet ef database update --project ../InsureX.Infrastructure
```

#### Reverting a Migration

```bash
# Revert to previous migration
dotnet ef database update PreviousMigrationName --project ../InsureX.Infrastructure

# Remove the last migration
dotnet ef migrations remove --project ../InsureX.Infrastructure
```

---

## 📖 Learning Resources

### Project Documentation

- **[SETUP.md](./SETUP.md)**: Detailed installation guide
- **[USAGE.md](./USAGE.md)**: User guide and feature documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Technical architecture details
- **[API_REFERENCE.md](./API_REFERENCE.md)**: Complete API documentation
- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Contribution guidelines
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**: Common issues and solutions

### External Resources

#### React & TypeScript
- [React Official Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [React Router](https://reactrouter.com/)

#### .NET & C#
- [.NET 8 Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [ASP.NET Core Web API](https://learn.microsoft.com/en-us/aspnet/core/web-api/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

#### Tools & Practices
- [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 🎓 Next Steps

### For New Developers

1. **✅ Complete Setup**: Follow this guide and [SETUP.md](./SETUP.md)
2. **📖 Read Documentation**: Review ARCHITECTURE.md and API_REFERENCE.md
3. **🔍 Explore Codebase**: Browse the project structure
4. **🧪 Run Tests**: Execute existing tests to understand testing patterns
5. **🐛 Fix a Bug**: Find a beginner-friendly issue and fix it
6. **✨ Add a Feature**: Implement a small feature to learn the workflow

### For Designers/Product Owners

1. **✅ Access Demo**: Login to the application and explore features
2. **📊 Review Features**: Check the [USAGE.md](./USAGE.md) guide
3. **🎨 UI/UX Review**: Provide feedback on user interface
4. **📝 Documentation**: Help improve user-facing documentation
5. **🐛 Report Issues**: Use GitHub Issues for bug reports or feature requests

### For DevOps/Infrastructure

1. **🐳 Docker Setup**: Review docker-compose.yml
2. **🔄 CI/CD Pipeline**: Check .github/workflows/
3. **🗄️ Database**: Review database schema and migrations
4. **🔒 Security**: Review authentication and authorization setup
5. **📊 Monitoring**: Set up logging and monitoring solutions

### Recommended First Tasks

**Easy (Good for beginners):**
- Add a new field to an existing form
- Fix UI alignment issues
- Update documentation
- Add unit tests to existing code

**Medium:**
- Implement a new API endpoint
- Create a new React component
- Add validation rules
- Implement email notifications

**Hard:**
- Add a new module (e.g., Document Management)
- Implement advanced reporting features
- Add real-time notifications with SignalR
- Implement advanced search with Elasticsearch

---

## 🤝 Getting Help

### Resources

1. **Documentation**: Check the `/docs` folder
2. **Code Comments**: Most complex logic has inline documentation
3. **Existing Tests**: Review test files for usage examples
4. **Swagger UI**: Interactive API documentation at `/swagger`

### Ask Questions

- **GitHub Discussions**: For general questions
- **GitHub Issues**: For bug reports and feature requests
- **Team Chat**: Slack/Teams channel for immediate help
- **Code Reviews**: Learn from PR feedback

### Common Questions

**Q: Where do I add a new API endpoint?**
A: Create a controller in `InsureX.API/Controllers/` and implement service in `InsureX.Application/Services/`

**Q: How do I add a new React page?**
A: Create component in `insurex-react/src/pages/` and add route in `App.tsx`

**Q: Database changes aren't applying?**
A: Run `dotnet ef database update` from the InsureX.API folder

**Q: Frontend can't connect to API?**
A: Check CORS settings in `appsettings.json` and verify VITE_API_URL in `.env`

---

## 🎉 Welcome to the Team!

You're now ready to start contributing to InsureX. Remember:

- 💡 **Ask questions** - No question is too small
- 🤝 **Collaborate** - Pair programming is encouraged
- 📖 **Document** - Update docs as you learn
- 🧪 **Test** - Write tests for new features
- 🎯 **Focus** - Small, incremental changes are better
- 🚀 **Have fun** - Building great software should be enjoyable!

Happy coding! 🚀

---

**Last Updated**: 2026-03-03  
**Maintainer**: InsureX Development Team  
**Questions?** Open an issue or reach out to the team!
