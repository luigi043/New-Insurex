# InsureX Documentation

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

Welcome to the InsureX documentation hub. This folder contains all project documentation for developers, users, and administrators.

---

## Documentation Index

### Getting Started

| Document | Description | Audience |
|----------|-------------|----------|
| [Quick Start](./QUICK_START.md) | Get running in 5 minutes | All |
| [Developer Onboarding](./ONBOARDING.md) | Complete development setup | Developers |
| [Usage Guide](./USAGE_GUIDE.md) | System usage and API reference | Users & Developers |

### Project Management

| Document | Location | Description |
|----------|----------|-------------|
| [Development Checklist](../Checklist.md) | Root | Progress tracking |
| [Project Notes](../notes.md) | Root | Command reference |

### Application READMEs

| Document | Location | Description |
|----------|----------|-------------|
| [Main README](../README.md) | Root | Project overview |
| [Frontend README](../insurex-react/README.md) | insurex-react | React app details |

---

## Quick Links

### For New Developers

1. Start with [Quick Start](./QUICK_START.md) to get the project running
2. Read [Developer Onboarding](./ONBOARDING.md) for complete setup
3. Review [Development Checklist](../Checklist.md) to understand project status

### For Users

1. Read [Usage Guide](./USAGE_GUIDE.md) for system navigation
2. Check API documentation at `/swagger` when running locally

### For Contributors

1. Review the [Development Checklist](../Checklist.md) for pending tasks
2. Follow the Git workflow in [Developer Onboarding](./ONBOARDING.md#development-workflow)
3. Submit PRs to the `develop` branch

---

## Technology Stack Reference

### Backend (.NET 8)

| Component | Technology |
|-----------|------------|
| Framework | ASP.NET Core 8 |
| ORM | Entity Framework Core |
| Database | SQL Server |
| Auth | JWT + Refresh Tokens |
| Logging | Serilog |
| Documentation | Swagger/OpenAPI |

### Frontend (React)

| Component | Technology |
|-----------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| UI Library | Material-UI v5 |
| Routing | React Router v6 |
| HTTP Client | Axios |

---

## Project Structure Overview

```
New-Insurex/
├── docs/                        # Documentation (you are here)
│   ├── README.md               # This file
│   ├── QUICK_START.md          # Quick setup guide
│   ├── ONBOARDING.md           # Developer onboarding
│   └── USAGE_GUIDE.md          # Usage documentation
│
├── insurex-react/               # Frontend application
│   └── src/                    # React source code
│
├── InsureX.API/                 # API entry point
├── InsureX.Application/         # Business logic
├── InsureX.Domain/              # Domain entities
├── InsureX.Infrastructure/      # Data access
├── InsureX.Shared/              # Shared components
├── InsureX.Tests/               # Test projects
│
├── IAPR_Web/                    # Legacy application
├── database/                    # Database scripts
│
├── docker-compose.yml           # Docker composition
├── Dockerfile                   # Backend Dockerfile
├── Checklist.md                 # Development checklist
└── README.md                    # Main project README
```

---

## Getting Help

- **GitHub Issues**: [New-Insurex Issues](https://github.com/luigi043/New-Insurex/issues)
- **API Docs**: http://localhost:7001/swagger (when running)

---

**Last Updated**: 2026-03-03
