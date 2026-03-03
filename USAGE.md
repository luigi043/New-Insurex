# InsureX Usage Guide

Developer guide for working with the InsureX Insurance Management System.

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

---

## Table of Contents

1. [Development Workflow](#development-workflow)
2. [Backend Development](#backend-development)
3. [Frontend Development](#frontend-development)
4. [Database Management](#database-management)
5. [API Usage](#api-usage)
6. [Testing](#testing)
7. [Common Tasks](#common-tasks)
8. [Best Practices](#best-practices)

---

## Development Workflow

### Daily Development Routine

```bash
# 1. Pull latest changes
git pull origin main

# 2. Start backend (Terminal 1)
cd InsureX.API
dotnet watch run

# 3. Start frontend (Terminal 2)
cd insurex-react
npm run dev

# 4. Open browser
# Frontend: http://localhost:5173
# API Docs: https://localhost:7001/swagger
```

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/policy-renewal

# Make changes and commit
git add .
git commit -m "feat: add policy renewal functionality"

# Push to remote
git push origin feature/policy-renewal

# Create Pull Request on GitHub
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code formatting
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

**Examples:**
```bash
git commit -m "feat: implement claim approval workflow"
git commit -m "fix: resolve JWT token expiration issue"
git commit -m "docs: update API documentation"
git commit -m "refactor: optimize policy search query"
```

---

## Backend Development

### Project Structure

```
InsureX.API/
├── Controllers/          # API endpoints
├── Features/            # Feature-based organization
├── Middleware/          # Custom middleware
└── Program.cs           # Application entry point

InsureX.Application/
├── Commands/            # CQRS commands
├── Queries/             # CQRS queries
├── Handlers/            # Command/Query handlers
├── DTOs/                # Data transfer objects
├── Validators/          # FluentValidation validators
└── Services/            # Business services

InsureX.Domain/
├── Entities/            # Domain entities
├── Enums/               # Enumerations
├── ValueObjects/        # Value objects
└── Interfaces/          # Domain interfaces

InsureX.Infrastructure/
├── Context/             # DbContext
├── Repositories/        # Data repositories
├── Security/            # Authentication/Authorization
└── Tenancy/             # Multi-tenancy support
```

### Adding a New Entity

#### 1. Create Domain Entity

```csharp
// InsureX.Domain/Entities/Product.cs
namespace InsureX.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
    public int TenantId { get; set; }
    
    // Navigation properties
    public virtual Tenant Tenant { get; set; } = null!;
}
```

#### 2. Add to DbContext

```csharp
// InsureX.Infrastructure/Context/ApplicationDbContext.cs
public DbSet<Product> Products { get; set; }

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);
    
    modelBuilder.Entity<Product>(entity =>
    {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
        entity.Property(e => e.Price).HasPrecision(18, 2);
        entity.HasQueryFilter(e => e.TenantId == _currentTenantId);
    });
}
```

#### 3. Create Migration

```bash
cd InsureX.API
dotnet ef migrations add AddProductEntity --project ../InsureX.Infrastructure
dotnet ef database update --project ../InsureX.Infrastructure
```

#### 4. Create DTOs

```csharp
// InsureX.Application/DTOs/ProductDto.cs
public record ProductDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public bool IsActive { get; init; }
}

public record CreateProductDto
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
}
```

#### 5. Create Repository

```csharp
// InsureX.Infrastructure/Repositories/ProductRepository.cs
public interface IProductRepository : IRepository<Product>
{
    Task<IEnumerable<Product>> GetActiveProductsAsync();
}

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context)
    {
    }
    
    public async Task<IEnumerable<Product>> GetActiveProductsAsync()
    {
        return await _dbSet
            .Where(p => p.IsActive)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }
}
```

#### 6. Create Controller

```csharp
// InsureX.API/Controllers/ProductsController.cs
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _repository;
    
    public ProductsController(IProductRepository repository)
    {
        _repository = repository;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        var products = await _repository.GetAllAsync();
        var dtos = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            IsActive = p.IsActive
        });
        return Ok(dtos);
    }
    
    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            IsActive = true
        };
        
        await _repository.AddAsync(product);
        await _repository.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }
}
```

#### 7. Register Services

```csharp
// InsureX.API/Program.cs
builder.Services.AddScoped<IProductRepository, ProductRepository>();
```

### Running Migrations

```bash
# Add new migration
dotnet ef migrations add MigrationName --project ../InsureX.Infrastructure

# Apply migrations
dotnet ef database update --project ../InsureX.Infrastructure

# Rollback to specific migration
dotnet ef database update PreviousMigrationName --project ../InsureX.Infrastructure

# Remove last migration (if not applied)
dotnet ef migrations remove --project ../InsureX.Infrastructure

# Generate SQL script
dotnet ef migrations script --project ../InsureX.Infrastructure --output migration.sql
```

### Debugging Backend

```bash
# Run with detailed logging
dotnet run --verbosity detailed

# Watch mode (auto-restart on changes)
dotnet watch run

# Debug in VS Code
# Press F5 or use Debug panel
```

---

## Frontend Development

### Project Structure

```
insurex-react/src/
├── components/          # Reusable components
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Layout components
│   └── Notifications/  # Notification system
├── pages/              # Page components
│   ├── auth/           # Login, Register
│   ├── dashboard/      # Dashboard
│   ├── policies/       # Policy management
│   ├── claims/         # Claims management
│   └── ...
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript types
├── utils/              # Utility functions
└── App.tsx             # Main app component
```

### Creating a New Page

#### 1. Create Page Component

```typescript
// src/pages/products/ProductList.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types/product.types';

const ProductList: React.FC = () => {
  const { products, loading, error, fetchProducts } = useProducts();
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <Box>
      <Typography variant="h4">Products</Typography>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </Box>
  );
};

export default ProductList;
```

#### 2. Create Custom Hook

```typescript
// src/hooks/useProducts.ts
import { useState } from 'react';
import { productService } from '../services/product.service';
import { Product } from '../types/product.types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const createProduct = async (product: Partial<Product>) => {
    try {
      const newProduct = await productService.create(product);
      setProducts([...products, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };
  
  return { products, loading, error, fetchProducts, createProduct };
};
```

#### 3. Create API Service

```typescript
// src/services/product.service.ts
import api from './api.service';
import { Product } from '../types/product.types';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },
  
  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  create: async (product: Partial<Product>): Promise<Product> => {
    const response = await api.post('/products', product);
    return response.data;
  },
  
  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  }
};
```

#### 4. Add TypeScript Types

```typescript
// src/types/product.types.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
```

#### 5. Add Route

```typescript
// src/App.tsx or src/routes/index.tsx
import ProductList from './pages/products/ProductList';

// In your routes configuration
<Route path="/products" element={<ProductList />} />
```

### Styling with Material-UI

```typescript
// Using sx prop
<Box sx={{ 
  display: 'flex', 
  flexDirection: 'column', 
  gap: 2,
  p: 3 
}}>
  <Typography variant="h4">Title</Typography>
</Box>

// Using styled components
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));
```

### State Management

```typescript
// Using Context API
import { createContext, useContext, useState } from 'react';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
```

---

## Database Management

### Viewing Database

```bash
# Using SQL Server Management Studio (SSMS)
# Connect to: (localdb)\MSSQLLocalDB or localhost
# Database: InsureX

# Using command line
sqlcmd -S "(localdb)\MSSQLLocalDB" -d InsureX -Q "SELECT * FROM Users"
```

### Common SQL Queries

```sql
-- View all tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

-- View table structure
EXEC sp_help 'Policies';

-- Count records
SELECT COUNT(*) FROM Policies;

-- View recent policies
SELECT TOP 10 * FROM Policies ORDER BY CreatedAt DESC;

-- Check user roles
SELECT u.Email, r.Name as Role 
FROM Users u 
JOIN UserRoles ur ON u.Id = ur.UserId 
JOIN Roles r ON ur.RoleId = r.Id;
```

### Seeding Data

```csharp
// InsureX.Infrastructure/Data/DbInitializer.cs
public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Seed roles
        if (!await context.Roles.AnyAsync())
        {
            var roles = new[]
            {
                new Role { Name = "Admin", NormalizedName = "ADMIN" },
                new Role { Name = "Manager", NormalizedName = "MANAGER" },
                new Role { Name = "Agent", NormalizedName = "AGENT" }
            };
            await context.Roles.AddRangeAsync(roles);
            await context.SaveChangesAsync();
        }
        
        // Seed users
        if (!await context.Users.AnyAsync())
        {
            var admin = new User
            {
                Email = "admin@insurex.com",
                FirstName = "Admin",
                LastName = "User",
                IsActive = true
            };
            await context.Users.AddAsync(admin);
            await context.SaveChangesAsync();
        }
    }
}
```

### Backup and Restore

```bash
# Backup database
sqlcmd -S "(localdb)\MSSQLLocalDB" -Q "BACKUP DATABASE InsureX TO DISK='C:\Backups\InsureX.bak'"

# Restore database
sqlcmd -S "(localdb)\MSSQLLocalDB" -Q "RESTORE DATABASE InsureX FROM DISK='C:\Backups\InsureX.bak' WITH REPLACE"

# Export data to CSV
bcp "SELECT * FROM InsureX.dbo.Policies" queryout "policies.csv" -c -t, -S "(localdb)\MSSQLLocalDB" -T
```

---

## API Usage

### Authentication

```bash
# Login
curl -X POST https://localhost:7001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@insurex.com",
    "password": "Admin123!"
  }'

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "abc123...",
  "expiresAt": "2026-03-04T15:00:00Z"
}
```

### Using JWT Token

```bash
# Set token variable
TOKEN="eyJhbGciOiJIUzI1NiIs..."

# Make authenticated request
curl https://localhost:7001/api/policies \
  -H "Authorization: Bearer $TOKEN"
```

### CRUD Operations

```bash
# GET - List all
curl https://localhost:7001/api/policies \
  -H "Authorization: Bearer $TOKEN"

# GET - Single item
curl https://localhost:7001/api/policies/1 \
  -H "Authorization: Bearer $TOKEN"

# POST - Create
curl -X POST https://localhost:7001/api/policies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "policyNumber": "POL-2026-001",
    "policyHolderName": "John Doe",
    "startDate": "2026-03-01",
    "endDate": "2027-03-01",
    "premium": 1200.00
  }'

# PUT - Update
curl -X PUT https://localhost:7001/api/policies/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "premium": 1500.00
  }'

# DELETE
curl -X DELETE https://localhost:7001/api/policies/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Pagination and Filtering

```bash
# Pagination
curl "https://localhost:7001/api/policies?page=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN"

# Filtering
curl "https://localhost:7001/api/policies?status=Active&search=John" \
  -H "Authorization: Bearer $TOKEN"

# Sorting
curl "https://localhost:7001/api/policies?sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Testing

### Backend Unit Tests

```csharp
// InsureX.Tests/Application/PolicyServiceTests.cs
using Xunit;
using Moq;

public class PolicyServiceTests
{
    private readonly Mock<IPolicyRepository> _mockRepo;
    private readonly PolicyService _service;
    
    public PolicyServiceTests()
    {
        _mockRepo = new Mock<IPolicyRepository>();
        _service = new PolicyService(_mockRepo.Object);
    }
    
    [Fact]
    public async Task CreatePolicy_ValidData_ReturnsPolicy()
    {
        // Arrange
        var dto = new CreatePolicyDto { PolicyNumber = "POL-001" };
        var policy = new Policy { Id = 1, PolicyNumber = "POL-001" };
        _mockRepo.Setup(r => r.AddAsync(It.IsAny<Policy>()))
                 .ReturnsAsync(policy);
        
        // Act
        var result = await _service.CreatePolicyAsync(dto);
        
        // Assert
        Assert.NotNull(result);
        Assert.Equal("POL-001", result.PolicyNumber);
    }
}
```

### Running Tests

```bash
# Run all tests
dotnet test

# Run specific test project
dotnet test InsureX.Tests/InsureX.Tests.csproj

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test
dotnet test --filter "FullyQualifiedName~PolicyServiceTests"

# Run with verbose output
dotnet test --verbosity detailed
```

### Frontend Testing (Future)

```typescript
// src/__tests__/ProductList.test.tsx
import { render, screen } from '@testing-library/react';
import ProductList from '../pages/products/ProductList';

describe('ProductList', () => {
  it('renders product list', () => {
    render(<ProductList />);
    expect(screen.getByText('Products')).toBeInTheDocument();
  });
});
```

---

## Common Tasks

### Adding a New User Role

```sql
-- Insert new role
INSERT INTO Roles (Name, NormalizedName, CreatedAt)
VALUES ('Auditor', 'AUDITOR', GETDATE());

-- Assign role to user
INSERT INTO UserRoles (UserId, RoleId)
SELECT u.Id, r.Id
FROM Users u, Roles r
WHERE u.Email = 'user@example.com' AND r.Name = 'Auditor';
```

### Resetting User Password

```bash
# Use the password reset endpoint
curl -X POST https://localhost:7001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "token": "reset-token-from-email",
    "newPassword": "NewPassword123!"
  }'
```

### Clearing Application Logs

```bash
# Delete log files
rm -rf InsureX.API/logs/*

# Or on Windows
del /Q InsureX.API\logs\*
```

### Updating Dependencies

```bash
# Backend - Update all NuGet packages
dotnet list package --outdated
dotnet add package PackageName

# Frontend - Update npm packages
npm outdated
npm update
npm install package-name@latest
```

### Environment-Specific Configuration

```json
// appsettings.Production.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=prod-server;Database=InsureX_Prod;..."
  },
  "JwtSettings": {
    "SecretKey": "production-secret-key-very-long-and-secure"
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Warning"
    }
  }
}
```

---

## Best Practices

### Backend Best Practices

1. **Use DTOs for API contracts**
   - Never expose domain entities directly
   - Use AutoMapper or manual mapping

2. **Implement proper error handling**
   ```csharp
   try
   {
       // Operation
   }
   catch (NotFoundException ex)
   {
       return NotFound(ex.Message);
   }
   catch (ValidationException ex)
   {
       return BadRequest(ex.Errors);
   }
   ```

3. **Use async/await consistently**
   ```csharp
   public async Task<ActionResult> GetData()
   {
       var data = await _repository.GetAllAsync();
       return Ok(data);
   }
   ```

4. **Implement repository pattern**
   - Separate data access from business logic
   - Use interfaces for testability

5. **Add XML documentation**
   ```csharp
   /// <summary>
   /// Creates a new policy
   /// </summary>
   /// <param name="dto">Policy creation data</param>
   /// <returns>Created policy</returns>
   [HttpPost]
   public async Task<ActionResult<PolicyDto>> CreatePolicy(CreatePolicyDto dto)
   ```

### Frontend Best Practices

1. **Component organization**
   - Keep components small and focused
   - Extract reusable logic to custom hooks
   - Use TypeScript for type safety

2. **Error handling**
   ```typescript
   try {
     await api.post('/endpoint', data);
     showSuccess('Operation successful');
   } catch (error) {
     showError(error.message);
   }
   ```

3. **Performance optimization**
   - Use React.memo for expensive components
   - Implement virtualization for large lists
   - Lazy load routes and components

4. **Accessibility**
   - Use semantic HTML
   - Add ARIA labels
   - Ensure keyboard navigation

5. **Code formatting**
   ```bash
   # Run linter
   npm run lint
   
   # Fix auto-fixable issues
   npm run lint -- --fix
   ```

### Security Best Practices

1. **Never commit secrets**
   - Use environment variables
   - Add sensitive files to .gitignore

2. **Validate all inputs**
   - Backend: FluentValidation
   - Frontend: Form validation

3. **Use HTTPS in production**
   - Configure SSL certificates
   - Redirect HTTP to HTTPS

4. **Implement rate limiting**
   - Prevent brute force attacks
   - Protect against DDoS

5. **Keep dependencies updated**
   - Regularly check for security updates
   - Use Dependabot or similar tools

---

## Additional Resources

- **API Documentation**: https://localhost:7001/swagger
- **Project Checklist**: [Checklist.md](./Checklist.md)
- **Setup Guide**: [SETUP.md](./SETUP.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Last Updated**: 2026-03-03
