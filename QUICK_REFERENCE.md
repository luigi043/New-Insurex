# InsureX Quick Reference Guide

Fast reference for common commands, patterns, and workflows.

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

---

## Quick Start Commands

### Start Development Environment

```bash
# Terminal 1: Backend
cd InsureX.API && dotnet watch run

# Terminal 2: Frontend
cd insurex-react && npm run dev
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5001 |
| Swagger Docs | https://localhost:7001/swagger |
| Default Login | admin@insurex.com / Admin123! |

---

## Git Commands

### Daily Workflow

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Commit changes
git add .
git commit -m "feat(module): description"
git push origin feature/your-feature-name

# Update from develop
git checkout develop
git pull origin develop
git checkout feature/your-feature-name
git merge develop
```

### Commit Message Format

```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
Scope: auth, policies, claims, assets, partners, billing
```

**Examples:**
```bash
git commit -m "feat(policies): add policy renewal functionality"
git commit -m "fix(auth): resolve token refresh issue"
git commit -m "docs(readme): update installation instructions"
```

---

## Backend Commands

### Build & Run

```bash
# Restore packages
dotnet restore

# Build solution
dotnet build

# Run API
cd InsureX.API
dotnet run

# Run with hot reload
dotnet watch run

# Run tests
dotnet test
```

### Database Migrations

```bash
cd InsureX.API

# Create migration
dotnet ef migrations add MigrationName --project ../InsureX.Infrastructure

# Apply migrations
dotnet ef database update --project ../InsureX.Infrastructure

# Remove last migration
dotnet ef migrations remove --project ../InsureX.Infrastructure

# Generate SQL script
dotnet ef migrations script --project ../InsureX.Infrastructure -o migration.sql

# Drop database
dotnet ef database drop --project ../InsureX.Infrastructure
```

### Entity Framework

```bash
# List migrations
dotnet ef migrations list --project ../InsureX.Infrastructure

# Update to specific migration
dotnet ef database update MigrationName --project ../InsureX.Infrastructure

# Generate migration bundle
dotnet ef migrations bundle --project ../InsureX.Infrastructure
```

### Seed Data

```bash
cd InsureX.SeedTool
dotnet run
```

---

## Frontend Commands

### Development

```bash
cd insurex-react

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

### Package Management

```bash
# Add package
npm install package-name

# Add dev dependency
npm install --save-dev package-name

# Remove package
npm uninstall package-name

# Update packages
npm update

# Check outdated packages
npm outdated
```

---

## Docker Commands

### Basic Operations

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose up -d --build

# Remove volumes
docker-compose down -v
```

### Individual Services

```bash
# Build API image
docker build -t insurex-api -f InsureX.API/Dockerfile .

# Build frontend image
docker build -t insurex-frontend -f insurex-react/Dockerfile .

# Run SQL Server
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name sql-server \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

---

## API Endpoints Quick Reference

### Authentication

```bash
# Login
POST /api/auth/login
{
  "email": "admin@insurex.com",
  "password": "Admin123!"
}

# Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe"
}

# Refresh token
POST /api/auth/refresh
{
  "refreshToken": "your-refresh-token"
}

# Get current user
GET /api/auth/me
Authorization: Bearer {token}
```

### Policies

```bash
# List policies
GET /api/policies?page=1&pageSize=10

# Get policy by ID
GET /api/policies/{id}

# Create policy
POST /api/policies
{
  "policyNumber": "POL-2024-001",
  "policyHolderName": "John Doe",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "premium": 1200.00
}

# Update policy
PUT /api/policies/{id}

# Activate policy
POST /api/policies/{id}/activate

# Cancel policy
POST /api/policies/{id}/cancel

# Get statistics
GET /api/policies/stats
```

### Claims

```bash
# List claims
GET /api/claims?status=Pending

# Create claim
POST /api/claims
{
  "policyId": 1,
  "claimAmount": 5000.00,
  "description": "Vehicle accident",
  "incidentDate": "2024-01-15"
}

# Submit claim
POST /api/claims/{id}/submit

# Approve claim
POST /api/claims/{id}/approve

# Reject claim
POST /api/claims/{id}/reject
{
  "reason": "Insufficient documentation"
}

# Mark as paid
POST /api/claims/{id}/pay
```

---

## Code Patterns

### Backend Patterns

#### Create New Controller

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class YourController : ControllerBase
{
    private readonly IYourService _service;
    private readonly ILogger<YourController> _logger;

    public YourController(IYourService service, ILogger<YourController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<YourDto>>> GetAll()
    {
        var items = await _service.GetAllAsync();
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<YourDto>> Create(CreateYourDto dto)
    {
        var item = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }
}
```

#### Create New Service

```csharp
public interface IYourService
{
    Task<IEnumerable<YourDto>> GetAllAsync();
    Task<YourDto> GetByIdAsync(int id);
    Task<YourDto> CreateAsync(CreateYourDto dto);
    Task UpdateAsync(int id, UpdateYourDto dto);
    Task DeleteAsync(int id);
}

public class YourService : IYourService
{
    private readonly IYourRepository _repository;
    private readonly IMapper _mapper;

    public YourService(IYourRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<YourDto>> GetAllAsync()
    {
        var items = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<YourDto>>(items);
    }
}
```

#### Create New Entity

```csharp
public class YourEntity : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    
    // Navigation properties
    public int RelatedEntityId { get; set; }
    public RelatedEntity RelatedEntity { get; set; } = null!;
}
```

### Frontend Patterns

#### Create New Page Component

```tsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const YourPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch data
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Your Page</Typography>
      </Box>
      {/* Content */}
    </Container>
  );
};

export default YourPage;
```

#### Create Custom Hook

```typescript
import { useState, useEffect } from 'react';
import { yourService } from '../services/your.service';

export const useYourData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await yourService.getAll();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};
```

#### Create API Service

```typescript
import apiClient from './api.service';

export const yourService = {
  getAll: async () => {
    const response = await apiClient.get('/your-endpoint');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/your-endpoint/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/your-endpoint', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/your-endpoint/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/your-endpoint/${id}`);
  }
};
```

---

## Database Queries

### Common SQL Queries

```sql
-- Check all tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Check table structure
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'YourTable'
ORDER BY ORDINAL_POSITION;

-- Check foreign keys
SELECT 
    fk.name AS ForeignKey,
    tp.name AS ParentTable,
    cp.name AS ParentColumn,
    tr.name AS ReferencedTable,
    cr.name AS ReferencedColumn
FROM sys.foreign_keys AS fk
INNER JOIN sys.tables AS tp ON fk.parent_object_id = tp.object_id
INNER JOIN sys.tables AS tr ON fk.referenced_object_id = tr.object_id
INNER JOIN sys.foreign_key_columns AS fkc ON fk.object_id = fkc.constraint_object_id
INNER JOIN sys.columns AS cp ON fkc.parent_column_id = cp.column_id AND fkc.parent_object_id = cp.object_id
INNER JOIN sys.columns AS cr ON fkc.referenced_column_id = cr.column_id AND fkc.referenced_object_id = cr.object_id;

-- Check indexes
SELECT 
    i.name AS IndexName,
    t.name AS TableName,
    c.name AS ColumnName
FROM sys.indexes AS i
INNER JOIN sys.index_columns AS ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
INNER JOIN sys.columns AS c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
INNER JOIN sys.tables AS t ON i.object_id = t.object_id
WHERE t.name = 'YourTable'
ORDER BY i.name, ic.key_ordinal;

-- Backup database
BACKUP DATABASE InsureX_Dev
TO DISK = 'C:\Backups\InsureX_Dev.bak'
WITH FORMAT, INIT, NAME = 'Full Backup';

-- Restore database
RESTORE DATABASE InsureX_Dev
FROM DISK = 'C:\Backups\InsureX_Dev.bak'
WITH REPLACE;
```

---

## Environment Variables

### Backend (.NET)

**appsettings.Development.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InsureX_Dev;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "your-32-character-secret-key-here",
    "Issuer": "InsureX",
    "Audience": "InsureXClient",
    "ExpirationHours": "24"
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173"]
  }
}
```

### Frontend (React)

**.env:**
```env
VITE_API_URL=http://localhost:5001/api
VITE_API_TIMEOUT=30000
VITE_TOKEN_KEY=accessToken
VITE_REFRESH_TOKEN_KEY=refreshToken
```

---

## Troubleshooting Quick Fixes

### Backend Issues

```bash
# Port in use
netstat -ano | findstr :5001
taskkill /PID <pid> /F

# Clear NuGet cache
dotnet nuget locals all --clear

# Rebuild solution
dotnet clean
dotnet build

# Reset database
dotnet ef database drop --project ../InsureX.Infrastructure --force
dotnet ef database update --project ../InsureX.Infrastructure
```

### Frontend Issues

```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Fix permissions (Linux/Mac)
sudo chown -R $USER:$GROUP ~/.npm
```

### Database Issues

```sql
-- Kill all connections
USE master;
GO
ALTER DATABASE InsureX_Dev SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
ALTER DATABASE InsureX_Dev SET MULTI_USER;
GO

-- Shrink database
DBCC SHRINKDATABASE (InsureX_Dev);

-- Update statistics
EXEC sp_updatestats;
```

---

## Testing Commands

### Backend Tests

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test
dotnet test --filter "FullyQualifiedName~YourTestClass"

# Run tests in parallel
dotnet test --parallel
```

### Frontend Tests (when implemented)

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test
npm test -- YourComponent.test.tsx
```

---

## Performance Tips

### Backend

```csharp
// Use AsNoTracking for read-only queries
var items = await _context.Policies
    .AsNoTracking()
    .ToListAsync();

// Use pagination
var items = await _context.Policies
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync();

// Use Select to project only needed fields
var items = await _context.Policies
    .Select(p => new { p.Id, p.PolicyNumber, p.Status })
    .ToListAsync();

// Use Include for eager loading
var policy = await _context.Policies
    .Include(p => p.Claims)
    .FirstOrDefaultAsync(p => p.Id == id);
```

### Frontend

```tsx
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency]);

// Lazy load components
const LazyComponent = React.lazy(() => import('./LazyComponent'));
```

---

## Useful Links

| Resource | URL |
|----------|-----|
| GitHub Repo | https://github.com/luigi043/New-Insurex |
| .NET Docs | https://learn.microsoft.com/en-us/dotnet/ |
| React Docs | https://react.dev/ |
| Material-UI | https://mui.com/ |
| EF Core | https://learn.microsoft.com/en-us/ef/core/ |
| TypeScript | https://www.typescriptlang.org/docs/ |

---

## Keyboard Shortcuts

### Visual Studio Code

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+P | Command Palette |
| Ctrl+P | Quick Open File |
| Ctrl+` | Toggle Terminal |
| Ctrl+Shift+` | New Terminal |
| F5 | Start Debugging |
| Ctrl+Shift+F | Find in Files |
| Alt+Up/Down | Move Line |
| Ctrl+/ | Toggle Comment |

### Visual Studio

| Shortcut | Action |
|----------|--------|
| F5 | Start Debugging |
| Ctrl+F5 | Start Without Debugging |
| Ctrl+Shift+B | Build Solution |
| Ctrl+K, Ctrl+D | Format Document |
| Ctrl+. | Quick Actions |
| F12 | Go to Definition |
| Ctrl+- | Navigate Back |

---

**Last Updated**: 2024-01-15
