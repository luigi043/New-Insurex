# InsureX Onboarding Guide

Welcome to InsureX! This guide helps you get the platform running locally and gives a quick tour of how to work in the codebase.

## Overview

InsureX is a full-stack insurance management system with a React + Vite frontend and a .NET 8 Web API backend built with Clean Architecture. It supports policy, claims, asset, partner, and billing workflows with role-based access control.

## Repository Layout

```
New-Insurex/
├── insurex-react/          # React + Vite frontend
├── InsureX.API/            # Web API host
├── InsureX.Application/    # Application services, DTOs, validators
├── InsureX.Domain/         # Domain entities and enums
├── InsureX.Infrastructure/ # Data access, identity, tenancy
├── InsureX.Shared/         # Shared DTOs/contracts
├── InsureX.Tests/          # Test projects
└── database/               # SQL scripts and helpers
```

## Prerequisites

- Node.js 18+
- .NET SDK 8.0
- SQL Server 2019+ (or LocalDB)
- Git

## Setup Instructions

### 1) Clone the repository

```bash
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex
```

### 2) Backend setup

```bash
cd InsureX.API

dotnet restore
```

Update `InsureX.API/appsettings.Development.json` with your SQL Server connection string, then run migrations:

```bash
dotnet ef database update
```

Start the API:

```bash
dotnet run
```

API defaults: `https://localhost:7001` and `http://localhost:5001`.

### 3) Frontend setup

```bash
cd insurex-react

npm install
cp .env.example .env
```

Set `VITE_API_URL` in `.env` to the API base URL, for example:

```
VITE_API_URL=https://localhost:7001/api
```

Start the frontend:

```bash
npm run dev
```

Frontend defaults to `http://localhost:3000`.

## Usage Guide

### Sign in flow

- Register a user via the registration screen.
- Verify email if required by your configuration.
- Log in to access the dashboard and modules.

### Working with modules

- **Policies**: Create and manage policy lifecycles, including renewals.
- **Claims**: Submit claims, track workflows, and process payments.
- **Assets**: Track assets across categories with valuation and inspections.
- **Partners**: Manage brokers, agencies, and insurer partners.
- **Billing**: Generate invoices and track payment history.

### Development tips

- API endpoints are documented via Swagger when the API is running.
- Environment configuration lives in `.env` (frontend) and `appsettings.*.json` (backend).
- The frontend service layer lives under `insurex-react/src/services`.
- Domain entities and workflow state machines live in `InsureX.Domain`.

## Troubleshooting

- **Database errors**: Confirm SQL Server is running and connection string is correct.
- **CORS issues**: Verify allowed origins in `InsureX.API` configuration.
- **401/403 responses**: Check JWT configuration and role permissions.
- **Frontend API errors**: Ensure `VITE_API_URL` points to the API.

## Next Steps

- Review `Checklist.md` for remaining milestones.
- Check `notes.md` for command references.
- Start with the Policy Management UI tasks in the roadmap.
