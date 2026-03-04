
# InsureX - Complete Command Reference Notes

A comprehensive guide of all commands needed for development, testing, deployment, and maintenance of the InsureX Insurance Management System.

## 📋 Table of Contents
- [Quick Start Commands](#quick-start-commands)
- [Git Commands](#git-commands)
- [Backend (.NET) Commands](#backend-net-commands)
- [Frontend (React) Commands](#frontend-react-commands)
- [Database Commands](#database-commands)
- [Docker Commands](#docker-commands)
- [Testing Commands](#testing-commands)
- [Deployment Commands](#deployment-commands)
- [Monitoring & Debugging](#monitoring--debugging)
- [Troubleshooting](#troubleshooting)
- [Useful Aliases](#useful-aliases)
- [Environment Setup](#environment-setup)

---

## 🚀 Quick Start Commands

### One-Line Setup (Development)
```bash
# Clone and setup entire project
git clone https://github.com/luigi043/New-Insurex.git && cd New-Insurex && cd InsureX.API && dotnet restore && dotnet ef database update && cd ../insurex-react && npm install && cp .env.example .env && cd ..
```

### Start Both Backend and Frontend
```bash
# Terminal 1 - Backend
cd InsureX.API && dotnet run

# Terminal 2 - Frontend
cd insurex-react && npm run dev
```

### Quick Database Reset
```bash
cd InsureX.API && dotnet ef database drop --project ../InsureX.Infrastructure --force && dotnet ef database update --project ../InsureX.Infrastructure
```

### Quick Build and Test
```bash
# Full build and test
dotnet build && dotnet test && cd insurex-react && npm run build && npm run test
```

---

## 🔧 Git Commands

### Repository Management
```bash
# Clone repository
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex

# Check status
git status

# View branches
git branch -a

# Create and switch to new branch
git checkout -b feature/feature-name
git checkout -b bugfix/issue-description
git checkout -b hotfix/critical-fix

# Switch branches
git checkout main
git checkout develop
git checkout feature/feature-name

# Delete branch locally
git branch -d feature/old-feature
git branch -D feature/force-delete

# Delete branch remotely
git push origin --delete feature/old-feature
```

### Staging and Committing
```bash
# Stage specific files
git add filename.cs
git add src/Controllers/*.cs

# Stage all changes
git add .
git add -A

# Commit with conventional commit message
git commit -m "feat: add claim approval workflow"
git commit -m "fix: resolve null reference in policy service"
git commit -m "docs: update API documentation"
git commit -m "test: add unit tests for claim service"
git commit -m "refactor: optimize database queries"
git commit -m "style: format code according to standards"

# Amend last commit (if not pushed)
git commit --amend -m "new message"
git commit --amend --no-edit

# Commit with sign-off
git commit -s -m "feat: add feature"
```

### Pushing and Pulling
```bash
# Push to remote
git push origin feature/feature-name
git push -u origin feature/feature-name  # Set upstream

# Force push (use with caution!)
git push --force origin feature/feature-name
git push --force-with-lease origin feature/feature-name  # Safer force push

# Pull latest changes
git pull origin main
git pull --rebase origin main  # Rebase instead of merge

# Fetch all branches
git fetch --all
git fetch -p  # Prune deleted branches
```

### Stashing
```bash
# Stash current changes
git stash
git stash save "WIP: working on claim workflow"

# List stashes
git stash list

# Apply stash
git stash apply
git stash apply stash@{0}

# Pop stash (apply and remove)
git stash pop
git stash pop stash@{0}

# Drop stash
git stash drop stash@{0}
git stash clear  # Remove all stashes

# Show stash content
git stash show -p stash@{0}
```

### Undoing Changes
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo multiple commits
git reset --soft HEAD~3

# Revert commit (create new commit)
git revert HEAD
git revert HEAD~3..HEAD

# Unstage file
git reset HEAD file.txt

# Discard file changes
git checkout -- file.txt
git restore file.txt  # Newer syntax

# Discard all local changes
git reset --hard HEAD
git clean -fd  # Remove untracked files
```

### Tags
```bash
# Create tag
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"
git tag -a v1.1.0-beta -m "Beta release with claims workflow"

# List tags
git tag
git tag -l "v1.*"

# Push tags
git push origin --tags
git push origin v1.0.0

# Delete tag locally
git tag -d v1.0.0

# Delete tag remotely
git push origin :refs/tags/v1.0.0
```

### Merging and Rebasing
```bash
# Merge branch
git checkout main
git merge feature/feature-name

# Merge with no fast-forward
git merge --no-ff feature/feature-name

# Rebase branch
git checkout feature/feature-name
git rebase main

# Interactive rebase
git rebase -i HEAD~5
git rebase -i main

# Abort rebase
git rebase --abort

# Continue rebase after resolving conflicts
git rebase --continue
```

### Viewing History
```bash
# View commit history
git log
git log --oneline
git log --graph --oneline --decorate

# View changes in file
git log -p file.txt
git blame file.txt

# View commit details
git show HEAD
git show abc123

# Search commits
git log --grep="feature"
git log --author="username"
git log --since="2 weeks ago"
```

---

## 🔧 Backend (.NET) Commands

### Project Setup and Creation
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
dotnet new console -n InsureX.SeedTool

# Add projects to solution
dotnet sln add InsureX.API/InsureX.API.csproj
dotnet sln add InsureX.Domain/InsureX.Domain.csproj
dotnet sln add InsureX.Application/InsureX.Application.csproj
dotnet sln add InsureX.Infrastructure/InsureX.Infrastructure.csproj
dotnet sln add InsureX.Shared/InsureX.Shared.csproj
dotnet sln add InsureX.Tests/InsureX.Tests.csproj
dotnet sln add InsureX.SeedTool/InsureX.SeedTool.csproj

# Add project references
dotnet add InsureX.API reference InsureX.Application
dotnet add InsureX.API reference InsureX.Infrastructure
dotnet add InsureX.Application reference InsureX.Domain
dotnet add InsureX.Application reference InsureX.Shared
dotnet add InsureX.Infrastructure reference InsureX.Domain
dotnet add InsureX.Infrastructure reference InsureX.Application
dotnet add InsureX.Tests reference InsureX.API
dotnet add InsureX.Tests reference InsureX.Application
dotnet add InsureX.Tests reference InsureX.Infrastructure
dotnet add InsureX.SeedTool reference InsureX.Infrastructure
```

### Package Installation

#### Entity Framework Core
```bash
# EF Core packages
dotnet add InsureX.Infrastructure package Microsoft.EntityFrameworkCore.SqlServer
dotnet add InsureX.Infrastructure package Microsoft.EntityFrameworkCore.Tools
dotnet add InsureX.Infrastructure package Microsoft.EntityFrameworkCore.Design
dotnet add InsureX.Infrastructure package Microsoft.EntityFrameworkCore.SqlServer.NetTopologySuite
dotnet add InsureX.Infrastructure package Microsoft.EntityFrameworkCore.Proxies

# Additional EF packages
dotnet add InsureX.Infrastructure package Microsoft.EntityFrameworkCore.Relational
dotnet add InsureX.Infrastructure package Microsoft.EntityFrameworkCore.Abstractions
```

#### Authentication and Authorization
```bash
# JWT Authentication
dotnet add InsureX.API package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add InsureX.API package System.IdentityModel.Tokens.Jwt
dotnet add InsureX.API package Microsoft.AspNetCore.Identity
dotnet add InsureX.API package Microsoft.AspNetCore.Identity.EntityFrameworkCore

# Authorization
dotnet add InsureX.API package Microsoft.AspNetCore.Authorization
```

#### Logging and Monitoring
```bash
# Serilog
dotnet add InsureX.API package Serilog.AspNetCore
dotnet add InsureX.API package Serilog.Sinks.Console
dotnet add InsureX.API package Serilog.Sinks.File
dotnet add InsureX.API package Serilog.Sinks.Seq
dotnet add InsureX.API package Serilog.Enrichers.Environment
dotnet add InsureX.API package Serilog.Enrichers.Process
dotnet add InsureX.API package Serilog.Enrichers.Thread
dotnet add InsureX.API package Serilog.Exceptions

# Health Checks
dotnet add InsureX.API package AspNetCore.HealthChecks.SqlServer
dotnet add InsureX.API package AspNetCore.HealthChecks.UI
dotnet add InsureX.API package AspNetCore.HealthChecks.UI.Client
dotnet add InsureX.API package AspNetCore.HealthChecks.UI.InMemory.Storage
dotnet add InsureX.API package AspNetCore.HealthChecks.System
```

#### API Documentation
```bash
# Swagger
dotnet add InsureX.API package Swashbuckle.AspNetCore
dotnet add InsureX.API package Swashbuckle.AspNetCore.Annotations
dotnet add InsureX.API package Swashbuckle.AspNetCore.Filters
dotnet add InsureX.API package Swashbuckle.AspNetCore.SwaggerGen
dotnet add InsureX.API package Swashbuckle.AspNetCore.SwaggerUI
```

#### Rate Limiting and Caching
```bash
# Rate Limiting
dotnet add InsureX.API package Microsoft.AspNetCore.RateLimiting
dotnet add InsureX.API package System.Threading.RateLimiting

# Caching
dotnet add InsureX.API package Microsoft.Extensions.Caching.StackExchangeRedis
dotnet add InsureX.API package Microsoft.Extensions.Caching.Memory
```

#### Testing Packages
```bash
# Testing
dotnet add InsureX.Tests package Microsoft.NET.Test.Sdk
dotnet add InsureX.Tests package xunit
dotnet add InsureX.Tests package xunit.runner.visualstudio
dotnet add InsureX.Tests package coverlet.collector
dotnet add InsureX.Tests package Moq
dotnet add InsureX.Tests package FluentAssertions
dotnet add InsureX.Tests package Microsoft.EntityFrameworkCore.InMemory
dotnet add InsureX.Tests package Microsoft.AspNetCore.Mvc.Testing
dotnet add InsureX.Tests package Testcontainers
dotnet add InsureX.Tests package Respawn
```

#### Additional Utilities
```bash
# AutoMapper
dotnet add InsureX.Application package AutoMapper
dotnet add InsureX.Application package AutoMapper.Extensions.Microsoft.DependencyInjection

# FluentValidation
dotnet add InsureX.Application package FluentValidation
dotnet add InsureX.Application package FluentValidation.AspNetCore
dotnet add InsureX.Application package FluentValidation.DependencyInjectionExtensions

# MediatR (if using mediator pattern)
dotnet add InsureX.Application package MediatR
dotnet add InsureX.Application package MediatR.Extensions.Microsoft.DependencyInjection

# Newtonsoft.Json
dotnet add InsureX.API package Microsoft.AspNetCore.Mvc.NewtonsoftJson
```

### Database Migrations
```bash
# Navigate to API project
cd InsureX.API

# Add migration
dotnet ef migrations add InitialCreate --project ../InsureX.Infrastructure
dotnet ef migrations add AddClaimWorkflow --project ../InsureX.Infrastructure
dotnet ef migrations add AddAuditFields --project ../InsureX.Infrastructure
dotnet ef migrations add AddSoftDelete --project ../InsureX.Infrastructure
dotnet ef migrations add AddMultiTenancy --project ../InsureX.Infrastructure

# Add migration with output directory
dotnet ef migrations add InitialCreate --output-dir Migrations --project ../InsureX.Infrastructure

# Update database
dotnet ef database update --project ../InsureX.Infrastructure
dotnet ef database update InitialCreate --project ../InsureX.Infrastructure

# Remove last migration (if not applied)
dotnet ef migrations remove --project ../InsureX.Infrastructure

# List migrations
dotnet ef migrations list --project ../InsureX.Infrastructure

# Generate SQL script
dotnet ef migrations script --project ../InsureX.Infrastructure -o Migrations/script.sql
dotnet ef migrations script InitialCreate AddClaimWorkflow --project ../InsureX.Infrastructure -o Migrations/upgrade.sql

# Reset database (drop and re-create)
dotnet ef database drop --project ../InsureX.Infrastructure --force
dotnet ef database update --project ../InsureX.Infrastructure

# Check pending migrations
dotnet ef migrations has-pending-model-changes --project ../InsureX.Infrastructure

# Bundle migrations into executable
dotnet ef migrations bundle --project ../InsureX.Infrastructure -o efbundle.exe
./efbundle.exe
```

### Build and Run
```bash
# Restore packages (solution level)
dotnet restore
dotnet restore InsureX.sln

# Build solution
dotnet build
dotnet build -c Release
dotnet build --no-incremental  # Clean build

# Run API
cd InsureX.API
dotnet run
dotnet run --launch-profile https
dotnet run --environment Development
dotnet run --environment Production

# Watch mode (auto-reload)
dotnet watch run
dotnet watch run --launch-profile https

# Run with specific URLs
dotnet run --urls "https://localhost:7001;http://localhost:5001"

# Publish
dotnet publish -c Release -o ./publish
dotnet publish -c Release -o ./publish --self-contained true -r win-x64
dotnet publish -c Release -o ./publish --self-contained true -r linux-x64

# Create NuGet package
dotnet pack -c Release -o ./packages
```

### Entity Framework Tools
```bash
# Install EF tools globally
dotnet tool install --global dotnet-ef

# Update EF tools
dotnet tool update --global dotnet-ef

# Check EF version
dotnet ef --version

# Get DbContext info
dotnet ef dbcontext info --project ../InsureX.Infrastructure
dotnet ef dbcontext list --project ../InsureX.Infrastructure
dotnet ef dbcontext scaffold --help

# Generate DbContext from database
dotnet ef dbcontext scaffold "Server=localhost;Database=InsureX;Trusted_Connection=True;" Microsoft.EntityFrameworkCore.SqlServer -o Models
```

### Solution and Project Management
```bash
# List projects in solution
dotnet sln list

# Remove project from solution
dotnet sln remove InsureX.Tests/InsureX.Tests.csproj

# Add multiple projects
dotnet sln add **/*.csproj

# Get project information
dotnet list package
dotnet list package --include-transitive
dotnet list reference
dotnet list reference InsureX.API/InsureX.API.csproj

# Add reference
dotnet add InsureX.Tests/InsureX.Tests.csproj reference InsureX.API/InsureX.API.csproj

# Remove reference
dotnet remove InsureX.Tests/InsureX.Tests.csproj reference InsureX.API/InsureX.API.csproj

# Add package
dotnet add InsureX.API package Newtonsoft.Json --version 13.0.1

# Remove package
dotnet remove InsureX.API package Newtonsoft.Json
```

### Code Generation
```bash
# Generate controller
dotnet aspnet-codegenerator controller -name ClaimsController -api -outDir Controllers

# Generate with actions
dotnet aspnet-codegenerator controller -name PoliciesController -api -outDir Controllers -actions

# Generate with model and context
dotnet aspnet-codegenerator controller -name PoliciesController -api -m Policy -dc ApplicationDbContext -outDir Controllers

# Install generator tool
dotnet tool install -g dotnet-aspnet-codegenerator
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

# Install core dependencies
npm install react react-dom react-router-dom
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install @mui/x-data-grid @mui/x-date-pickers
npm install axios
npm install react-hook-form @hookform/resolvers yup
npm install date-fns
npm install notistack
npm install recharts
npm install lodash @types/lodash
npm install uuid @types/uuid

# Install dev dependencies
npm install -D @types/node
npm install -D eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint-plugin-react-hooks eslint-plugin-react-refresh
npm install -D @vitejs/plugin-react
npm install -D typescript @types/react @types/react-dom
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event jsdom @vitejs/plugin-react
npm install -D cypress @cypress/react @cypress/vite-dev-server
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "dev:host": "vite --host",
    "build": "tsc && vite build",
    "build:analyze": "vite build --mode analyze",
    "build:staging": "vite build --mode staging",
    "preview": "vite preview",
    "preview:host": "vite preview --host",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,scss}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,scss}\"",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch",
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:run:chrome": "cypress run --browser chrome",
    "prepare": "husky install"
  }
}
```

### Development Commands
```bash
# Start dev server
npm run dev

# Start on specific port
npm run dev -- --port 3001

# Start with host network access
npm run dev:host

# Build for production
npm run build

# Build with bundle analysis
npm run build:analyze

# Build for staging
npm run build:staging

# Preview production build
npm run preview

# Type checking
npm run type-check
npm run type-check:watch

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check
```

### Testing Commands
```bash
# Run tests
npm run test
npm run test:run
npm run test:watch

# Run specific test file
npm test -- PolicyList.test.tsx
npm test -- src/pages/claims/__tests__

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui

# Run tests with pattern
npm test -- -t "should render policy list"

# Update snapshots
npm test -- -u

# E2E tests with Cypress
npx cypress open
npx cypress run
npx cypress run --spec "cypress/e2e/login.cy.js"
npx cypress run --browser chrome --headed

# Run E2E tests in CI
npm run cy:run
```

### Dependency Management
```bash
# Check outdated packages
npm outdated

# Update packages
npm update
npm update package-name

# Install specific version
npm install package@version

# Install as dev dependency
npm install -D package

# Uninstall package
npm uninstall package

# List installed packages
npm list
npm list --depth=0
npm list --depth=1

# Audit for vulnerabilities
npm audit
npm audit fix
npm audit fix --force

# Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Check why package is installed
npm explain package-name

# Deduplicate dependencies
npm dedupe
```

### Version Management
```bash
# Show current version
npm version

# Patch release (1.0.0 -> 1.0.1)
npm version patch
npm version patch -m "Release v%s"

# Minor release (1.0.0 -> 1.1.0)
npm version minor
npm version minor -m "Release v%s"

# Major release (1.0.0 -> 2.0.0)
npm version major
npm version major -m "Release v%s"

# Prerelease
npm version prerelease --preid=beta
npm version prepatch --preid=alpha
```

### Vite Specific Commands
```bash
# Build with specific mode
vite build --mode production
vite build --mode staging
vite build --mode development

# Preview with specific port
vite preview --port 5000

# Optimize dependencies
vite optimize

# Show vite config
vite --debug

# Build with sourcemap
vite build --sourcemap
```

---

## 🗄️ Database Commands

### SQL Server (LocalDB)
```bash
# List LocalDB instances
sqllocaldb info

# Start LocalDB
sqllocaldb start MSSQLLocalDB
sqllocaldb start InsureXDB

# Stop LocalDB
sqllocaldb stop MSSQLLocalDB
sqllocaldb stop InsureXDB

# Delete LocalDB instance
sqllocaldb delete MSSQLLocalDB
sqllocaldb delete InsureXDB

# Create new LocalDB
sqllocaldb create InsureXDB
sqllocaldb create InsureXDB 15.0  # Specify version

# View connection string
sqllocaldb connection-string InsureXDB

# Share LocalDB instance
sqllocaldb share InsureXDB SharedInstance
sqllocaldb unshare InsureXDB
```

### SQL Server (Full)
```bash
# Connect using sqlcmd
sqlcmd -S localhost -U sa -P password
sqlcmd -S localhost -E  # Windows authentication

# Run SQL script
sqlcmd -S localhost -U sa -P password -i script.sql
sqlcmd -S localhost -E -i Migrations/script.sql

# Export data
sqlcmd -S localhost -U sa -P password -Q "SELECT * FROM Policies" -o policies.csv -s","
```

### SQL Scripts

#### Database Management
```sql
-- Check database size
SELECT 
    DB_NAME() AS DatabaseName,
    SUM(size * 8 / 1024) AS SizeMB,
    SUM(CASE WHEN type_desc = 'ROWS' THEN size * 8 / 1024 ELSE 0 END) AS DataSizeMB,
    SUM(CASE WHEN type_desc = 'LOG' THEN size * 8 / 1024 ELSE 0 END) AS LogSizeMB
FROM sys.master_files
WHERE database_id = DB_ID('InsureX_Dev');

-- Check active connections
SELECT 
    session_id,
    login_name,
    status,
    host_name,
    program_name,
    client_interface_name,
    login_time,
    last_request_start_time,
    last_request_end_time
FROM sys.dm_exec_sessions
WHERE database_id = DB_ID('InsureX_Dev');

-- Kill connection
KILL [session_id];

-- Get database options
SELECT * FROM sys.databases WHERE name = 'InsureX_Dev';
```

#### Backup and Restore
```sql
-- Full backup
BACKUP DATABASE InsureX_Dev
TO DISK = 'C:\Backups\InsureX_Dev.bak'
WITH FORMAT, 
     STATS = 10,
     NAME = 'InsureX-FullBackup',
     DESCRIPTION = 'Full backup of InsureX database';

-- Differential backup
BACKUP DATABASE InsureX_Dev
TO DISK = 'C:\Backups\InsureX_Dev_Diff.bak'
WITH DIFFERENTIAL,
     STATS = 10;

-- Transaction log backup
BACKUP LOG InsureX_Dev
TO DISK = 'C:\Backups\InsureX_Dev_Log.trn'
WITH STATS = 10;

-- Restore database
RESTORE DATABASE InsureX_Dev
FROM DISK = 'C:\Backups\InsureX_Dev.bak'
WITH REPLACE, 
     STATS = 10,
     RECOVERY;

-- Restore with move
RESTORE DATABASE InsureX_Dev
FROM DISK = 'C:\Backups\InsureX_Dev.bak'
WITH MOVE 'InsureX_Dev' TO 'D:\Data\InsureX_Dev.mdf',
     MOVE 'InsureX_Dev_log' TO 'D:\Logs\InsureX_Dev_log.ldf',
     REPLACE,
     STATS = 10;
```

#### Performance Monitoring
```sql
-- Check index fragmentation
SELECT 
    OBJECT_NAME(ind.OBJECT_ID) AS TableName,
    ind.name AS IndexName,
    indexstats.avg_fragmentation_in_percent,
    indexstats.page_count
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, NULL) indexstats
INNER JOIN sys.indexes ind 
    ON ind.object_id = indexstats.object_id 
    AND ind.index_id = indexstats.index_id
WHERE indexstats.avg_fragmentation_in_percent > 30
ORDER BY indexstats.avg_fragmentation_in_percent DESC;

-- Rebuild index
ALTER INDEX ALL ON Policies REBUILD;
ALTER INDEX IX_Policies_Number ON Policies REORGANIZE;

-- Check query performance
SELECT 
    qs.execution_count,
    qs.total_elapsed_time / qs.execution_count AS avg_elapsed_time,
    qs.total_logical_reads / qs.execution_count AS avg_logical_reads,
    SUBSTRING(st.text, (qs.statement_start_offset/2) + 1,
        ((CASE qs.statement_end_offset
            WHEN -1 THEN DATALENGTH(st.text)
            ELSE qs.statement_end_offset
        END - qs.statement_start_offset)/2) + 1) AS statement_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
ORDER BY avg_elapsed_time DESC;
```

#### Data Migration
```sql
-- Export data to CSV
sqlcmd -S localhost -d InsureX_Dev -E -Q "SET NOCOUNT ON; SELECT * FROM Policies" -o "policies.csv" -h-1 -s"," -W

-- Bulk insert
BULK INSERT Policies
FROM 'C:\Data\policies.csv'
WITH (
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIRSTROW = 2,
    TABLOCK
);

-- Generate insert scripts
SELECT 'INSERT INTO Policies (Number, Status, StartDate) VALUES (''' + 
       Number + ''', ''' + Status + ''', ''' + 
       CONVERT(VARCHAR, StartDate, 120) + ''');'
FROM Policies;
```

---

## 🐳 Docker Commands

### Docker Compose (Full Stack)

#### docker-compose.yml
```yaml
version: '3.8'

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: insurex-sqlserver
    environment:
      SA_PASSWORD: "Your_password123"
      ACCEPT_EULA: "Y"
      MSSQL_PID: "Developer"
    ports:
      - "1433:1433"
    volumes:
      - sql_data:/var/opt/mssql
      - ./database/scripts:/scripts
    networks:
      - insurex-network
    healthcheck:
      test: ["CMD", "/opt/mssql-tools/bin/sqlcmd", "-S", "localhost", "-U", "sa", "-P", "Your_password123", "-Q", "SELECT 1"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  backend:
    build:
      context: .
      dockerfile: InsureX.API/Dockerfile
    container_name: insurex-backend
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
      - JwtSettings__Issuer=InsureX
      - JwtSettings__Audience=InsureXClient
      - JwtSettings__ExpirationHours=24
    volumes:
      - ~/.aspnet/https:/https:ro
      - ./logs:/app/logs
    depends_on:
      sqlserver:
        condition: service_healthy
    networks:
      - insurex-network

  frontend:
    build:
      context: ./insurex-react
      dockerfile: Dockerfile
    container_name: insurex-frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000/api
      - VITE_APP_NAME=InsureX
      - VITE_APP_VERSION=1.0.0
      - VITE_ENABLE_DARK_MODE=true
    volumes:
      - ./insurex-react:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - insurex-network

  redis:
    image: redis:alpine
    container_name: insurex-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - insurex-network
    command: redis-server --appendonly yes

  seq:
    image: datalust/seq:latest
    container_name: insurex-seq
    ports:
      - "5341:80"
    environment:
      - ACCEPT_EULA=Y
    volumes:
      - seq_data:/data
    networks:
      - insurex-network

networks:
  insurex-network:
    driver: bridge

volumes:
  sql_data:
  redis_data:
  seq_data:
```

#### docker-compose.override.yml (Development)
```yaml
version: '3.8'

services:
  backend:
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - DOTNET_USE_POLLING_FILE_WATCHER=1
    volumes:
      - ./InsureX.API:/app
      - ./InsureX.Application:/src/InsureX.Application
      - ./InsureX.Domain:/src/InsureX.Domain
      - ./InsureX.Infrastructure:/src/InsureX.Infrastructure
      - ./InsureX.Shared:/src/InsureX.Shared

  frontend:
    environment:
      - VITE_API_URL=http://localhost:5000/api
      - CHOKIDAR_USEPOLLING=true
    command: npm run dev -- --host
```

### Docker Commands

#### Compose Operations
```bash
# Build and run all services
docker-compose up
docker-compose up -d  # Detached mode
docker-compose up -d --build  # Rebuild and start

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f sqlserver

# Stop services
docker-compose down
docker-compose down -v  # Remove volumes
docker-compose down --rmi all  # Remove images

# Restart services
docker-compose restart
docker-compose restart backend

# List services
docker-compose ps

# Execute command in service
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Your_password123

# Run one-off command
docker-compose run --rm backend dotnet ef database update

# Pull latest images
docker-compose pull

# Build images
docker-compose build
docker-compose build --no-cache
```

#### Individual Container Operations
```bash
# Build backend image
docker build -t insurex-api -f InsureX.API/Dockerfile .
docker build -t insurex-api:latest -f InsureX.API/Dockerfile .
docker build -t insurex-api:v1.0.0 -f InsureX.API/Dockerfile .

# Build frontend image
docker build -t insurex-frontend -f insurex-react/Dockerfile .
docker build -t insurex-frontend:latest -f insurex-react/Dockerfile .

# Run containers
docker run -d -p 8080:80 --name insurex-api insurex-api
docker run -d -p 3000:3000 --name insurex-frontend insurex-frontend
docker run -d -p 1433:1433 --name sqlserver -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Your_password123" mcr.microsoft.com/mssql/server:2022-latest

# Run with environment variables
docker run -d -p 8080:80 \
  -e "ConnectionStrings__DefaultConnection=Server=sqlserver;Database=InsureX;User=sa;Password=Your_password123" \
  -e "JwtSettings__SecretKey=your-secret-key" \
  --name insurex-api \
  insurex-api

# Stop container
docker stop insurex-api
docker stop $(docker ps -aq)  # Stop all

# Remove container
docker rm insurex-api
docker rm $(docker ps -aq)  # Remove all stopped

# View logs
docker logs insurex-api
docker logs -f insurex-api
docker logs --tail 100 insurex-api

# Execute in running container
docker exec -it insurex-api bash
docker exec -it insurex-frontend sh
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Your_password123 -Q "SELECT GETDATE()"

# Copy files to/from container
docker cp file.txt insurex-api:/app/file.txt
docker cp insurex-api:/app/logs/log.txt ./logs/
```

#### Image Management
```bash
# List images
docker images
docker images | grep insurex

# Remove images
docker rmi insurex-api
docker rmi $(docker images -q)  # Remove all images
docker image prune  # Remove dangling images
docker image prune -a  # Remove all unused images

# Save image to file
docker save -o insurex-api.tar insurex-api
docker save insurex-api | gzip > insurex-api.tar.gz

# Load image from file
docker load -i insurex-api.tar
gunzip -c insurex-api.tar.gz | docker load

# Tag image
docker tag insurex-api insurex-api:production
docker tag insurex-api myregistry.com/insurex-api:v1.0.0

# Push to registry
docker push myregistry.com/insurex-api:v1.0.0
```

#### Container Management
```bash
# List containers
docker ps
docker ps -a  # All containers
docker ps -q  # Only IDs

# Inspect container
docker inspect insurex-api
docker inspect --format='{{.NetworkSettings.IPAddress}}' insurex-api

# View resource usage
docker stats
docker stats insurex-api

# Pause/unpause container
docker pause insurex-api
docker unpause insurex-api

# Rename container
docker rename insurex-api insurex-api-old

# Update container resources
docker update --cpus 1 --memory 512m insurex-api
```

#### Network Management
```bash
# List networks
docker network ls

# Create network
docker network create insurex-network
docker network create --driver bridge insurex-network

# Connect container to network
docker network connect insurex-network insurex-api
docker network disconnect insurex-network insurex-api

# Inspect network
docker network inspect insurex-network
```

#### Volume Management
```bash
# List volumes
docker volume ls

# Create volume
docker volume create insurex-data

# Inspect volume
docker volume inspect insurex-data

# Remove volume
docker volume rm insurex-data
docker volume prune  # Remove unused volumes

# Backup volume
docker run --rm -v insurex-data:/data -v $(pwd):/backup alpine tar czf /backup/insurex-data-backup.tar.gz -C /data .

# Restore volume
docker run --rm -v insurex-data:/data -v $(pwd):/backup alpine tar xzf /backup/insurex-data-backup.tar.gz -C /data
```

### Dockerfile Examples

#### Backend Dockerfile (InsureX.API/Dockerfile)
```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files
COPY ["Directory.Packages.props", "."]
COPY ["InsureX.API/InsureX.API.csproj", "InsureX.API/"]
COPY ["InsureX.Application/InsureX.Application.csproj", "InsureX.Application/"]
COPY ["InsureX.Domain/InsureX.Domain.csproj", "InsureX.Domain/"]
COPY ["InsureX.Infrastructure/InsureX.Infrastructure.csproj", "InsureX.Infrastructure/"]
COPY ["InsureX.Shared/InsureX.Shared.csproj", "InsureX.Shared/"]

# Restore dependencies
RUN dotnet restore "InsureX.API/InsureX.API.csproj"

# Copy everything else
COPY . .

# Build and publish
WORKDIR "/src/InsureX.API"
RUN dotnet publish "InsureX.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy published files
COPY --from=build /app/publish .

# Set environment
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health/ready || exit 1

ENTRYPOINT ["dotnet", "InsureX.API.dll"]
```

#### Frontend Dockerfile (insurex-react/Dockerfile)
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Install dependencies
RUN npm ci --only=production
RUN npm install

# Copy source
COPY . .

# Build application
RUN npm run build

# Runtime stage
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration (nginx.conf)
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy "strict-origin-when-cross-origin";

        location / {
            try_files $uri $uri/ /index.html;
            expires 1h;
            add_header Cache-Control "public, no-transform";
        }

        location /assets {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

---

## 🧪 Testing Commands

### Backend Tests
```bash
# Navigate to solution root
cd New-Insurex

# Run all tests
dotnet test
dotnet test -v n  # Verbose output
dotnet test --no-build  # Skip build

# Run tests in specific project
dotnet test InsureX.Tests/InsureX.Tests.csproj
dotnet test tests/InsureX.Tests

# Run tests with specific filter
dotnet test --filter "FullyQualifiedName~ClaimServiceTests"
dotnet test --filter "Category=Unit"
dotnet test --filter "Category=Integration"
dotnet test --filter "Priority=Critical"
dotnet test --filter "TestCategory=Database"

# Run tests matching pattern
dotnet test --filter "Name~TestMethodName"
dotnet test --filter "DisplayName~Claim"

# Run tests and collect coverage
dotnet test --collect:"XPlat Code Coverage"
dotnet test --collect:"XPlat Code Coverage" --results-directory ./TestResults

# Generate coverage report
dotnet tool install -g dotnet-reportgenerator-globaltool
reportgenerator -reports:"./TestResults/**/coverage.cobertura.xml" -targetdir:"CoverageReport" -reporttypes:Html
reportgenerator -reports:"./TestResults/**/coverage.cobertura.xml" -targetdir:"CoverageReport" -reporttypes:Html;Json;Badges

# Open coverage report
open CoverageReport/index.html

# Run with specific configuration
dotnet test -c Release
dotnet test -c Debug

# Run tests in parallel
dotnet test --settings local.runsettings

# Run tests and log to file
dotnet test --logger "trx;LogFileName=test_results.trx"
dotnet test --logger "html;LogFileName=test_results.html"

# Run tests with blame (find hanging tests)
dotnet test --blame
dotnet test --blame-hang-timeout 1m

# List all tests
dotnet test --list-tests
```

### Frontend Tests
```bash
# Navigate to frontend
cd insurex-react

# Run all tests
npm test
npm run test

# Run tests in watch mode
npm test -- --watch
npm test -- --watchAll

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run specific test file
npm test -- PolicyList.test.tsx
npm test -- src/pages/claims/__tests__/ClaimList.test.tsx

# Run tests matching pattern
npm test -- -t "renders policy list"
npm test -- -t "should submit claim"

# Update snapshots
npm test -- -u
npm test -- PolicyList.test.tsx -u

# Run with different reporters
npm test -- --reporter=verbose
npm test -- --reporter=dot

# Run with environment variables
NODE_ENV=test npm test
VITE_API_URL=http://localhost:5000 npm test

# Run E2E tests with Cypress
npx cypress open
npx cypress run
npx cypress run --headed
npx cypress run --browser chrome
npx cypress run --spec "cypress/e2e/login.cy.js"

# Run E2E tests with recording
npx cypress run --record --key YOUR_KEY

# Run E2E tests in specific environment
CYPRESS_BASE_URL=http://localhost:3000 npx cypress run
```

### Test Configuration Files

#### local.runsettings
```xml
<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
  <RunConfiguration>
    <MaxCpuCount>0</MaxCpuCount>
    <ResultsDirectory>.\TestResults</ResultsDirectory>
    <TargetFrameworkVersion>net8.0</TargetFrameworkVersion>
    <TestAdaptersPaths>.</TestAdaptersPaths>
  </RunConfiguration>
  <DataCollectionRunSettings>
    <DataCollectors>
      <DataCollector friendlyName="Code Coverage">
        <Configuration>
          <CodeCoverage>
            <ModulePaths>
              <Exclude>
                <ModulePath>.*Tests.dll</ModulePath>
                <ModulePath>.*TestAdapter.dll</ModulePath>
              </Exclude>
            </ModulePaths>
            <Attributes>
              <Exclude>
                <Attribute>^System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute$</Attribute>
              </Exclude>
            </Attributes>
          </CodeCoverage>
        </Configuration>
      </DataCollector>
    </DataCollectors>
  </DataCollectionRunSettings>
  <LoggerRunSettings>
    <Loggers>
      <Logger friendlyName="trx" enabled="True" />
      <Logger friendlyName="html" enabled="True">
        <Configuration>
          <LogFileName>test_results.html</LogFileName>
        </Configuration>
      </Logger>
    </Loggers>
  </LoggerRunSettings>
</RunSettings>
```

#### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.test.tsx',
        '**/types.ts'
      ]
    },
    deps: {
      inline: ['@mui/material']
    }
  }
});
```

---

## 🚀 Deployment Commands

### Azure Deployment
```bash
# Install Azure CLI
# Windows: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows
# macOS: brew install azure-cli
# Linux: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login
az login --tenant YOUR_TENANT_ID

# Set subscription
az account set --subscription YOUR_SUBSCRIPTION_ID

# Create resource group
az group create --name insurex-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name insurex-plan \
  --resource-group insurex-rg \
  --sku B1 \
  --is-linux

# Create Web App for backend
az webapp create \
  --resource-group insurex-rg \
  --plan insurex-plan \
  --name insurex-api \
  --runtime "DOTNET:8"

# Create Web App for frontend
az webapp create \
  --resource-group insurex-rg \
  --plan insurex-plan \
  --name insurex-app \
  --runtime "NODE:18-lts"

# Configure environment variables for backend
az webapp config appsettings set \
  --resource-group insurex-rg \
  --name insurex-api \
  --settings \
    JwtSettings__SecretKey="your-secret-key" \
    JwtSettings__Issuer="InsureX" \
    JwtSettings__Audience="InsureXClient" \
    ConnectionStrings__DefaultConnection="Server=tcp:your-server.database.windows.net,1433;Database=InsureX;Authentication=Active Directory Default;"

# Configure environment variables for frontend
az webapp config appsettings set \
  --resource-group insurex-rg \
  --name insurex-app \
  --settings \
    VITE_API_URL="https://insurex-api.azurewebsites.net/api"

# Deploy backend
cd InsureX.API
dotnet publish -c Release
cd bin/Release/net8.0/publish
zip -r deploy.zip .
az webapp deployment source config-zip \
  --resource-group insurex-rg \
  --name insurex-api \
  --src deploy.zip

# Deploy frontend
cd insurex-react
npm run build
cd dist
zip -r deploy.zip .
az webapp deployment source config-zip \
  --resource-group insurex-rg \
  --name insurex-app \
  --src deploy.zip

# Configure CORS for backend
az webapp cors add \
  --resource-group insurex-rg \
  --name insurex-api \
  --allowed-origins "https://insurex-app.azurewebsites.net" "http://localhost:3000"

# Enable logging
az webapp log config \
  --resource-group insurex-rg \
  --name insurex-api \
  --application-logging filesystem \
  --level information

# Stream logs
az webapp log tail --name insurex-api --resource-group insurex-rg

# Scale up/down
az appservice plan update \
  --name insurex-plan \
  --resource-group insurex-rg \
  --sku S1

# Enable HTTPS only
az webapp update \
  --resource-group insurex-rg \
  --name insurex-api \
  --https-only true

# Create staging slot
az webapp deployment slot create \
  --resource-group insurex-rg \
  --name insurex-api \
  --slot staging

# Deploy to staging
az webapp deployment source config-zip \
  --resource-group insurex-rg \
  --name insurex-api \
  --slot staging \
  --src deploy.zip

# Swap slots
az webapp deployment slot swap \
  --resource-group insurex-rg \
  --name insurex-api \
  --slot staging \
  --target-slot production
```

### GitHub Actions CI/CD

#### .github/workflows/build.yml
```yaml
name: Build

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: 8.0.x
      
      - name: Restore dependencies
        run: dotnet restore
      
      - name: Build
        run: dotnet build --no-restore
      
      - name: Test
        run: dotnet test --no-build --verbosity normal --collect:"XPlat Code Coverage"
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./TestResults/**/coverage.cobertura.xml

  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18.x
          cache: 'npm'
          cache-dependency-path: insurex-react/package-lock.json
      
      - name: Install dependencies
        run: cd insurex-react && npm ci
      
      - name: Lint
        run: cd insurex-react && npm run lint
      
      - name: Type check
        run: cd insurex-react && npm run type-check
      
      - name: Test
        run: cd insurex-react && npm run test:run
      
      - name: Build
        run: cd insurex-react && npm run build
```

#### .github/workflows/deploy.yml
```yaml
name: Deploy

on:
  release:
    types: [published]
  workflow_dispatch:

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: 8.0.x
      
      - name: Publish
        run: dotnet publish InsureX.API/InsureX.API.csproj -c Release -o publish
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: insurex-api
          slot-name: production
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: ./publish

  deploy-frontend:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18.x
      
      - name: Install dependencies
        run: cd insurex-react && npm ci
      
      - name: Build
        run: cd insurex-react && npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: insurex-app
          slot-name: production
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND }}
          package: ./insurex-react/dist
```

---

## 📊 Monitoring & Debugging

### Logging Commands
```bash
# View application logs
cd InsureX.API
tail -f logs/log-*.txt

# Search logs
grep "ERROR" logs/log-*.txt
grep "Exception" logs/log-*.txt | grep -v "Handled"

# Count occurrences
grep -c "ValidationException" logs/log-*.txt

# View last 100 lines with timestamps
tail -100 logs/log-*.txt | grep "^\["

# Follow logs with filtering
tail -f logs/log-*.txt | grep --line-buffered "Claim\|Policy"
```

### Performance Monitoring
```bash
# Enable dotnet counters
dotnet counters monitor -p $(pgrep -f InsureX.API)

# Monitor specific counters
dotnet counters monitor -p $(pgrep -f InsureX.API) System.Runtime Microsoft.AspNetCore.Hosting

# Collect trace
dotnet trace collect -p $(pgrep -f InsureX.API) --format speedscope
dotnet trace collect -p $(pgrep -f InsureX.API) --duration 00:00:30

# Analyze dump
dotnet dump analyze core.dmp

# Check memory usage
dotnet counters monitor -p $(pgrep -f InsureX.API) System.Runtime

# Profile CPU usage
dotnet trace collect -p $(pgrep -f InsureX.API) --providers Microsoft-DotNETCore-SampleProfiler

# View metrics in browser
# https://localhost:7001/metrics
```

### Debugging Commands
```bash
# Attach debugger
dotnet run --configuration Debug

# Enable detailed logging
export Logging__LogLevel__Default=Debug
export Logging__LogLevel__Microsoft=Information

# Debug with Visual Studio Code
# Press F5 or run:
code InsureX.API

# Debug tests
dotnet test --filter "FullyQualifiedName~ClaimServiceTests" --logger "console;verbosity=detailed"

# Check environment variables
printenv | grep ASPNETCORE
printenv | grep ConnectionStrings

# Check process information
ps aux | grep dotnet
lsof -i :5000
lsof -i :5001
```

---

## 🔍 Troubleshooting

### Port Conflicts
```bash
# Windows - find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :1433

# Kill process by PID
taskkill /PID [PID] /F

# Linux/Mac
lsof -i :3000
lsof -i :5000
lsof -i :1433

# Kill process
kill -9 [PID]

# Find and kill all dotnet processes
pkill -f dotnet
```

### Node Modules Issues
```bash
# Clean install
cd insurex-react
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Fix vulnerabilities
npm audit fix
npm audit fix --force

# Check for outdated packages
npm outdated

# Update specific package
npm update package-name

# Debug installation issues
npm install --verbose
npm install --legacy-peer-deps
npm install --force
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

# Check for conflicts
dotnet --info

# Repair .NET installation
# Windows: Run dotnet-install script
# macOS/Linux: Reinstall via package manager

# Fix corrupted packages
dotnet restore --force
dotnet restore --no-cache

# Clear obj/bin folders
find . -name "bin" -type d -exec rm -rf {} + 2>/dev/null
find . -name "obj" -type d -exec rm -rf {} + 2>/dev/null
```

### Database Connection Issues
```bash
# Test database connection
sqlcmd -S localhost -U sa -P password -Q "SELECT @@VERSION"

# Check if SQL Server is running
systemctl status mssql-server  # Linux
sc query MSSQLSERVER  # Windows

# Test connection string
dotnet run --project InsureX.SeedTool --test-connection

# Check firewall
sudo ufw status  # Linux
netsh advfirewall show allprofiles  # Windows

# Reset database
dotnet ef database drop --project ../InsureX.Infrastructure --force
dotnet ef database update --project ../InsureX.Infrastructure
```

### Docker Issues
```bash
# Check container logs
docker logs insurex-api
docker logs --tail 50 --follow --timestamps insurex-api

# Inspect container
docker inspect insurex-api

# Check resource usage
docker stats

# Clean up unused resources
docker system prune -a
docker system prune -a --volumes

# Check network connectivity
docker network inspect insurex-network
docker exec insurex-api ping sqlserver

# Restart Docker daemon
sudo systemctl restart docker  # Linux
# Windows/Mac: Restart Docker Desktop

# Check Docker version
docker version
docker-compose version
```

---

## 🔧 Useful Aliases

Add to `~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`:

```bash
# ============================================
# Git Aliases
# ============================================
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gca='git commit --amend'
alias gp='git push'
alias gpl='git pull'
alias gco='git checkout'
alias gcb='git checkout -b'
alias gb='git branch'
alias gbd='git branch -d'
alias gbD='git branch -D'
alias gst='git stash'
alias gstp='git stash pop'
alias gstl='git stash list'
alias gl='git log --oneline --graph'
alias glg='git log --oneline --graph --all'
alias gd='git diff'
alias gdc='git diff --cached'
alias grh='git reset --hard'
alias grs='git reset --soft'
alias gclean='git clean -fd'
alias gundo='git reset --soft HEAD~1'

# ============================================
# .NET Aliases
# ============================================
alias dotnetr='dotnet run'
alias dotnetb='dotnet build'
alias dotnett='dotnet test'
alias dotnetw='dotnet watch run'
alias dotneta='dotnet add package'
alias dotnetrm='dotnet remove package'
alias dotnetm='dotnet ef migrations add'
alias dotnetu='dotnet ef database update'
alias dotnetd='dotnet ef database drop'
alias dotnetc='dotnet clean'
alias dotnetp='dotnet publish'
alias dotnetrst='dotnet restore'
alias dotnetsln='dotnet sln'

# ============================================
# NPM Aliases
# ============================================
alias nr='npm run'
alias nrd='npm run dev'
alias nrb='npm run build'
alias nrp='npm run preview'
alias nrt='npm run test'
alias nrtw='npm run test:watch'
alias nrtc='npm run test:coverage'
alias nrl='npm run lint'
alias nrf='npm run format'
alias nrtc='npm run type-check'
alias nci='npm ci'
alias ni='npm install'
alias nid='npm install -D'
alias nu='npm uninstall'
alias nup='npm update'
alias nout='npm outdated'
alias naf='npm audit fix'

# ============================================
# Docker Aliases
# ============================================
alias d='docker'
alias dc='docker-compose'
alias dcu='docker-compose up'
alias dcud='docker-compose up -d'
alias dcd='docker-compose down'
alias dcdv='docker-compose down -v'
alias dcl='docker-compose logs -f'
alias dcb='docker-compose build'
alias dcr='docker-compose run --rm'
alias dce='docker-compose exec'
alias dps='docker ps'
alias dpsa='docker ps -a'
alias di='docker images'
alias drm='docker rm'
alias drmi='docker rmi'
alias dprune='docker system prune -a'
alias dprunev='docker system prune -a --volumes'

# ============================================
# Database Aliases
# ============================================
alias sqlstart='sqllocaldb start MSSQLLocalDB'
alias sqlstop='sqllocaldb stop MSSQLLocalDB'
alias sqlstatus='sqllocaldb info'
alias sqllist='sqllocaldb info'
alias sqlcreate='sqllocaldb create'
alias sqldelete='sqllocaldb delete'

# ============================================
# Project Specific Aliases
# ============================================
alias insurex-back='cd ~/Projects/New-Insurex/InsureX.API && dotnet run'
alias insurex-front='cd ~/Projects/New-Insurex/insurex-react && npm run dev'
alias insurex-test='cd ~/Projects/New-Insurex && dotnet test'
alias insurex-migrate='cd ~/Projects/New-Insurex/InsureX.API && dotnet ef database update --project ../InsureX.Infrastructure'
alias insurex-resetdb='cd ~/Projects/New-Insurex/InsureX.API && dotnet ef database drop --project ../InsureX.Infrastructure --force && dotnet ef database update --project ../InsureX.Infrastructure'
alias insurex-clean='find . -name "bin" -type d -exec rm -rf {} + 2>/dev/null && find . -name "obj" -type d -exec rm -rf {} + 2>/dev/null'

# ============================================
# Navigation Aliases
# ============================================
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias ~='cd ~'
alias -- -='cd -'
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'

# ============================================
# Utility Aliases
# ============================================
alias ports='lsof -i -P -n | grep LISTEN'
alias myip='curl ifconfig.me'
alias weather='curl wttr.in'
alias cheat='curl cheat.sh'
alias h='history'
alias hg='history | grep'
alias path='echo $PATH | tr ":" "\n"'
alias now='date +"%Y-%m-%d %H:%M:%S"'

# ============================================
# Functions
# ============================================

# Find process by name
psg() {
    ps aux | grep -v grep | grep -i "$1"
}

# Kill process by name
killp() {
    pkill -f "$1"
}

# Create directory and cd into it
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# Extract archive
extract() {
    if [ -f $1 ]; then
        case $1 in
            *.tar.bz2)   tar xjf $1     ;;
            *.tar.gz)    tar xzf $1     ;;
            *.bz2)       bunzip2 $1     ;;
            *.rar)       unrar e $1     ;;
            *.gz)        gunzip $1      ;;
            *.tar)       tar xf $1      ;;
            *.tbz2)      tar xjf $1     ;;
            *.tgz)       tar xzf $1     ;;
            *.zip)       unzip $1       ;;
            *.Z)         uncompress $1  ;;
            *.7z)        7z x $1        ;;
            *)           echo "'$1' cannot be extracted via extract()" ;;
        esac
    else
        echo "'$1' is not a valid file"
    fi
}

# Backup file with timestamp
backup() {
    cp "$1" "${1}.$(date +%Y%m%d-%H%M%S).bak"
}

# Quick HTTP server
serve() {
    python3 -m http.server "${1:-8000}"
}

# Find in files
ff() {
    grep -r "$1" "${2:-.}"
}

# Run both backend and frontend
insurex-dev() {
    (cd ~/Projects/New-Insurex/InsureX.API && dotnet run &)
    (cd ~/Projects/New-Insurex/insurex-react && npm run dev &)
    echo "InsureX development servers started!"
    echo "Backend: http://localhost:5000"
    echo "Frontend: http://localhost:3000"
}
```

---

## 🌍 Environment Setup

### Backend Environment Variables (.env)

Create `.env` file in InsureX.API directory:

```bash
# Connection Strings
ConnectionStrings__DefaultConnection="Server=(localdb)\\MSSQLLocalDB;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"

# JWT Settings
JwtSettings__SecretKey="your-super-secret-key-with-at-least-32-characters"
JwtSettings__Issuer="InsureX"
JwtSettings__Audience="InsureXClient"
JwtSettings__ExpirationHours=24
JwtSettings__RefreshTokenExpirationDays=7

# Logging
Logging__LogLevel__Default="Information"
Logging__LogLevel__Microsoft="Warning"
Logging__LogLevel__Microsoft.Hosting.Lifetime="Information"

# Serilog
Serilog__MinimumLevel__Default="Information"
Serilog__MinimumLevel__Override__Microsoft="Warning"
Serilog__WriteTo__0__Name="Console"
Serilog__WriteTo__1__Name="File"
Serilog__WriteTo__1__Args__path="logs/log-.txt"
Serilog__WriteTo__1__Args__rollingInterval="Day"

# Rate Limiting
RateLimiting__PermitLimit=100
RateLimiting__WindowSeconds=60

# CORS
Cors__AllowedOrigins__0="http://localhost:3000"
Cors__AllowedOrigins__1="https://localhost:3000"
```

### Frontend Environment Variables (.env)

Create `.env` file in insurex-react directory:

```bash
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

# Pagination defaults
VITE_DEFAULT_PAGE_SIZE=10
VITE_PAGE_SIZE_OPTIONS=5,10,25,50,100

# Date format
VITE_DATE_FORMAT=yyyy-MM-dd
VITE_DATETIME_FORMAT=yyyy-MM-dd HH:mm:ss

# Cache settings
VITE_CACHE_DURATION=300000  # 5 minutes in milliseconds
```

### Environment-Specific Files

#### .env.development
```bash
VITE_API_URL=http://localhost:5001/api
VITE_APP_ENV=development
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=false
```

#### .env.staging
```bash
VITE_API_URL=https://staging-api.insurex.com/api
VITE_APP_ENV=staging
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=true
```

#### .env.production
```bash
VITE_API_URL=https://api.insurex.com/api
VITE_APP_ENV=production
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=true
```

---

## 📚 Additional Resources

### Useful Links
- [.NET 8 Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [Docker Documentation](https://docs.docker.com)
- [Azure CLI Documentation](https://learn.microsoft.com/en-us/cli/azure/)

### Quick Reference Cards
```bash
# Print this file for quick reference
cat notes.md | grep -E "^###|^####|^alias|^function" | less

# Search for specific commands
grep -A 5 -B 5 "docker-compose" notes.md

# Get command history for project
history | grep "dotnet" | tail -50
history | grep "npm run" | tail -50
```

---

**Last Updated**: 2026-03-04  
**Version**: 2.0.0  
**Author**: InsureX Development Team
