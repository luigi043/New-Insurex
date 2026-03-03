# InsureX - Command Reference Notes

## 🚀 Quick Command Reference

### Repository Management
```bash
# Clone repository
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex

# Check status
git status

# Create branch
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "feat: description"
git push origin feature/feature-name

# Pull latest
git pull origin main

# Merge main into feature
git checkout feature/feature-name
git merge main
```

---

## 🔧 Backend (.NET 8) Commands

### Project Setup
```bash
# Create new solution
dotnet new sln -n InsureX

# Create projects
dotnet new webapi -n InsureX.API
dotnet new classlib -n InsureX.Domain
dotnet new classlib -n InsureX.Application
dotnet new classlib -n InsureX.Infrastructure
dotnet new classlib -n InsureX.Shared
dotnet new xunit -n InsureX.Tests

# Add projects to solution
dotnet sln add InsureX.API/InsureX.API.csproj
dotnet sln add InsureX.Domain/InsureX.Domain.csproj
dotnet sln add InsureX.Application/InsureX.Application.csproj
dotnet sln add InsureX.Infrastructure/InsureX.Infrastructure.csproj
dotnet sln add InsureX.Shared/InsureX.Shared.csproj
dotnet sln add InsureX.Tests/InsureX.Tests.csproj

# Add project references
dotnet add InsureX.API reference InsureX.Application
dotnet add InsureX.API reference InsureX.Infrastructure
dotnet add InsureX.Application reference InsureX.Domain
dotnet add InsureX.Application reference InsureX.Shared
dotnet add InsureX.Infrastructure reference InsureX.Domain
dotnet add InsureX.Infrastructure reference InsureX.Application
```

### Package Installation
```bash
# Entity Framework Core
dotnet add InsureX.Infrastructure package Microsoft.EntityFrameworkCore.SqlServer
dotnet add InsureX.Infrastructure package Microsoft.EntityFrameworkCore.Tools
dotnet add InsureX.Infrastructure package Microsoft.EntityFrameworkCore.Design

# Authentication
dotnet add InsureX.API package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add InsureX.API package System.IdentityModel.Tokens.Jwt

# Logging
dotnet add InsureX.API package Serilog.AspNetCore
dotnet add InsureX.API package Serilog.Sinks.Console
dotnet add InsureX.API package Serilog.Sinks.File

# Documentation
dotnet add InsureX.API package Swashbuckle.AspNetCore

# Health Checks
dotnet add InsureX.API package AspNetCore.HealthChecks.SqlServer
dotnet add InsureX.API package AspNetCore.HealthChecks.UI

# Rate Limiting
dotnet add InsureX.API package AspNetCore.RateLimiting

# Testing
dotnet add InsureX.Tests package Microsoft.NET.Test.Sdk
dotnet add InsureX.Tests package xunit
dotnet add InsureX.Tests package xunit.runner.visualstudio
dotnet add InsureX.Tests package Moq
dotnet add InsureX.Tests package FluentAssertions
dotnet add InsureX.Tests package Microsoft.EntityFrameworkCore.InMemory
```

### Database Migrations
```bash
# Navigate to API project
cd InsureX.API

# Add migration
dotnet ef migrations add InitialCreate --project ../InsureX.Infrastructure

# Update database
dotnet ef database update --project ../InsureX.Infrastructure

# Remove last migration
dotnet ef migrations remove --project ../InsureX.Infrastructure

# List migrations
dotnet ef migrations list --project ../InsureX.Infrastructure

# Generate SQL script
dotnet ef migrations script --project ../InsureX.Infrastructure -o script.sql

# Reset database
dotnet ef database drop --project ../InsureX.Infrastructure --force
dotnet ef database update --project ../InsureX.Infrastructure
```

### Build & Run
```bash
# Restore packages
dotnet restore

# Build solution
dotnet build

# Run API
cd InsureX.API
dotnet run
# or
dotnet watch run

# Run with specific profile
dotnet run --launch-profile https

# Publish
dotnet publish -c Release -o ./publish

# Run tests
dotnet test
dotnet test --filter "Category=Unit"
dotnet test --collect:"XPlat Code Coverage"

# Generate coverage report
dotnet tool install -g dotnet-reportgenerator-globaltool
reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:"coveragereport" -reporttypes:Html
```

---

## 💻 Frontend (React) Commands

### Project Setup
```bash
# Create Vite project
npm create vite@latest insurex-react -- --template react-ts

# Navigate to project
cd insurex-react

# Install dependencies
npm install

# Install Material-UI
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install @mui/x-data-grid @mui/x-date-pickers

# Install routing
npm install react-router-dom

# Install HTTP client
npm install axios

# Install form handling
npm install react-hook-form @hookform/resolvers yup

# Install date handling
npm install date-fns

# Install notifications
npm install notistack

# Install charts
npm install recharts

# Install utilities
npm install lodash @types/lodash
npm install uuid @types/uuid

# Install dev dependencies
npm install -D @types/node eslint prettier @typescript-eslint/eslint-plugin
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "cy:open": "cypress open",
    "cy:run": "cypress run"
  }
}
```

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint --fix

# Formatting
npm run format
```

### Testing
```bash
# Install testing dependencies
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Run tests
npm run test
npm run test:coverage
npm run test:ui

# E2E tests with Cypress
npx cypress open
npx cypress run
```

---

## 🐳 Docker Commands

### Build Images
```bash
# Build backend image
docker build -t insurex-api -f InsureX.API/Dockerfile .

# Build frontend image
docker build -t insurex-frontend -f insurex-react/Dockerfile .

# Build with Docker Compose
docker-compose build
```

### Run Containers
```bash
# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Run individual containers
docker run -d -p 8080:80 --name insurex-api insurex-api
docker run -d -p 3000:3000 --name insurex-frontend insurex-frontend

# Execute commands in container
docker exec -it insurex-api bash
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

  backend:
    build:
      context: .
      dockerfile: InsureX.API/Dockerfile
    ports:
      - "5000:80"
      - "5001:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=InsureX_Dev;User=sa;Password=Your_password123;TrustServerCertificate=true
    depends_on:
      - sqlserver

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

---

## 🗄️ Database Commands

### SQL Server (LocalDB)
```bash
# Start LocalDB
sqllocaldb start MSSQLLocalDB

# Stop LocalDB
sqllocaldb stop MSSQLLocalDB

# Delete LocalDB instance
sqllocaldb delete MSSQLLocalDB

# Create new LocalDB
sqllocaldb create InsureXDB
```

### SQL Scripts
```sql
-- Check database size
SELECT 
    DB_NAME() AS DatabaseName,
    SUM(size * 8 / 1024) AS SizeMB
FROM sys.master_files
WHERE type_desc = 'ROWS';

-- Check active connections
SELECT 
    session_id,
    login_name,
    status,
    host_name,
    program_name
FROM sys.dm_exec_sessions
WHERE database_id = DB_ID('InsureX_Dev');

-- Kill connection
KILL [session_id];

-- Backup database
BACKUP DATABASE InsureX_Dev
TO DISK = 'C:\Backups\InsureX_Dev.bak'
WITH FORMAT, STATS = 10;

-- Restore database
RESTORE DATABASE InsureX_Dev
FROM DISK = 'C:\Backups\InsureX_Dev.bak'
WITH REPLACE, STATS = 10;
```

---

## 🔍 Git Commands Cheat Sheet

### Branch Management
```bash
# List branches
git branch -a

# Create and switch
git checkout -b feature/new-feature

# Delete branch
git branch -d feature/old-feature
git push origin --delete feature/old-feature

# Rename branch
git branch -m old-name new-name
```

### Stashing
```bash
# Stash changes
git stash save "WIP: feature description"

# List stashes
git stash list

# Apply stash
git stash apply stash@{0}

# Pop stash
git stash pop

# Drop stash
git stash drop stash@{0}
```

### Undoing Changes
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert commit (create new commit)
git revert HEAD

# Unstage file
git reset HEAD file.txt

# Discard file changes
git checkout -- file.txt
```

### Tags
```bash
# Create tag
git tag -a v1.0.0 -m "Version 1.0.0"

# Push tags
git push origin --tags

# Delete tag
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

---

## 📦 NPM Commands

### Dependency Management
```bash
# Update all packages
npm update

# Check outdated packages
npm outdated

# Install specific version
npm install package@version

# Install as dev dependency
npm install -D package

# Uninstall package
npm uninstall package

# Clear cache
npm cache clean --force

# Audit fix
npm audit fix
npm audit fix --force
```

### Version Management
```bash
# Show current version
npm version

# Patch release (1.0.0 -> 1.0.1)
npm version patch

# Minor release (1.0.0 -> 1.1.0)
npm version minor

# Major release (1.0.0 -> 2.0.0)
npm version major
```

---

## 🔐 Environment Variables

### .env.example (Frontend)
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
```

### appsettings.json (Backend)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-with-at-least-32-characters-here",
    "Issuer": "InsureX",
    "Audience": "InsureXClient",
    "ExpirationHours": 24
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    }
  }
}
```

---

## 🧪 Testing Commands

### Backend Tests
```bash
# Run all tests
dotnet test

# Run specific test class
dotnet test --filter "FullyQualifiedName~PolicyServiceTests"

# Run with coverage
dotnet test --collect:"XPlat Code Coverage" --results-directory ./TestResults

# Generate coverage report
reportgenerator -reports:"./TestResults/**/coverage.cobertura.xml" -targetdir:"CoverageReport" -reporttypes:Html

# Run integration tests
dotnet test --filter "Category=Integration"
```

### Frontend Tests
```bash
# Run vitest tests
npm run test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run Cypress E2E tests
npx cypress run
npx cypress run --spec "cypress/e2e/login.cy.js"

# Run specific test file
npm run test -- PolicyList.test.tsx
```

---

## 🚨 Troubleshooting Commands

### Port Conflicts
```bash
# Windows - find process using port
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Linux/Mac
lsof -i :3000
kill -9 [PID]
```

### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Fix vulnerabilities
npm audit fix
npm audit fix --force
```

### .NET Issues
```bash
# Clear NuGet cache
dotnet nuget locals all --clear

# Restore tools
dotnet tool restore

# List runtimes
dotnet --list-runtimes

# List SDKs
dotnet --list-sdks
```

---

## 📊 Performance Monitoring

### Backend
```bash
# Enable dotnet counters
dotnet counters monitor -p [PID]

# Generate performance report
dotnet trace collect -p [PID] --format speedscope

# Check memory usage
dotnet counters monitor -p [PID] System.Runtime
```

### Frontend
```bash
# Build with bundle analyzer
npm run build -- --analyze

# Check bundle size
npx vite-bundle-visualizer

# Lighthouse CI
npx lighthouse http://localhost:3000 --view
```

---

## 🔄 CI/CD Commands

### GitHub Actions
```bash
# Run workflow locally
act -j build

# List workflows
act -l

# Run with secrets
act -s MY_SECRET=value
```

### Deployment
```bash
# Deploy to Azure
az webapp up --name insurex-api --resource-group insurex-rg --sku B1

# Deploy with Azure CLI
az webapp deployment source config-zip --resource-group insurex-rg --name insurex-api --src deploy.zip

# Check logs
az webapp log tail --name insurex-api --resource-group insurex-rg
```

---

## 📝 Useful Aliases

Add to `.bashrc` or `.zshrc`:
```bash
# Git aliases
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'
alias gl='git pull'
alias gco='git checkout'
alias gb='git branch'

# Docker aliases
alias dcu='docker-compose up'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias di='docker images'
alias dps='docker ps'

# .NET aliases
alias dotnetr='dotnet run'
alias dotnetb='dotnet build'
alias dotnett='dotnet test'
alias dotnetw='dotnet watch run'

# NPM aliases
alias nr='npm run'
alias nrd='npm run dev'
alias nrb='npm run build'
alias nrt='npm run test'
```

---

## 📚 Resources & Links

### Documentation
- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [.NET 8 Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)

### Tools
- [Postman](https://www.postman.com) - API Testing
- [Azure Data Studio](https://azure.microsoft.com/products/data-studio/) - Database Management
- [VS Code](https://code.visualstudio.com) - Code Editor
- [GitHub Desktop](https://desktop.github.com) - Git Client

### Troubleshooting
- [Stack Overflow](https://stackoverflow.com/questions/tagged/asp.net-core)
- [React Issues](https://github.com/facebook/react/issues)
- [.NET GitHub](https://github.com/dotnet/aspnetcore/issues)

---

**Last Updated**: 2026-03-03  
**Author**: InsureX Development Team