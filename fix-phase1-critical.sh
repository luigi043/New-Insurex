#!/bin/bash
# Phase 1: Critical Architecture Fixes
# Run this first - fixes broken MediatR and cleans structure

echo "🔧 PHASE 1: Critical Fixes"
echo "============================"

# 1. Fix MediatR Configuration in Program.cs
echo "📋 Step 1: Fixing MediatR registration..."

cat > InsureX.API/Program.cs << 'EOF'
using InsureX.Infrastructure.Data;
using InsureX.Application.Interfaces;
using InsureX.Infrastructure.Repositories;
using InsureX.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using InsureX.Infrastructure.Services;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Server=(localdb)\\MSSQLLocalDB;Database=InsurexDb;Trusted_Connection=True;TrustServerCertificate=True;"));

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPolicyRepository, PolicyRepository>();
builder.Services.AddScoped<IAssetRepository, AssetRepository>();
builder.Services.AddScoped<IClaimRepository, ClaimRepository>();
builder.Services.AddScoped<ITenantRepository, TenantRepository>();

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPolicyService, PolicyService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ITenantContext, TenantContext>();
builder.Services.AddScoped<ITenantValidationService, TenantValidationService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// FIXED: MediatR registration from Application layer
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(IAuthService).Assembly));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

// Initialize database and run validation
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await context.Database.MigrateAsync();

    // Run validation for each tenant
    var validationService = scope.ServiceProvider.GetRequiredService<ITenantValidationService>();
    var tenants = await context.Tenants.ToListAsync();

    foreach (var tenant in tenants)
    {
        await validationService.ValidatePolicyDatesAsync(tenant.Id);
        await validationService.CheckExpiredPoliciesAsync(tenant.Id);
    }
}

app.Run();
EOF

echo "✅ MediatR fixed - now registers from Application layer"

# 2. Create proper folder structure for CQRS
echo "📁 Step 2: Creating CQRS folder structure..."

mkdir -p InsureX.Application/Commands/Policy
mkdir -p InsureX.Application/Queries/Policy
mkdir -p InsureX.Application/Handlers/Policy
mkdir -p InsureX.Application/Behaviors
mkdir -p InsureX.Application/Validators

echo "✅ CQRS folders created"

# 3. Add FluentValidation package
echo "📦 Step 3: Updating packages..."

cat >> Directory.Packages.props << 'EOF'
    <PackageVersion Include="FluentValidation" Version="11.9.0" />
    <PackageVersion Include="FluentValidation.DependencyInjectionExtensions" Version="11.9.0" />
    <PackageVersion Include="MediatR" Version="12.2.0" />
EOF

echo "✅ Packages updated"

# 4. Create Validation Behavior
echo "🧩 Step 4: Creating Validation Pipeline Behavior..."

cat > InsureX.Application/Behaviors/ValidationBehavior.cs << 'EOF'
using FluentValidation;
using MediatR;

namespace InsureX.Application.Behaviors;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any()) return await next();

        var context = new ValidationContext<TRequest>(request);
        var validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var failures = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Any())
        {
            throw new ValidationException(failures);
        }

        return await next();
    }
}
EOF

echo "✅ ValidationBehavior created"

# 5. Create Logging Behavior
echo "🧩 Step 5: Creating Logging Pipeline Behavior..."

cat > InsureX.Application/Behaviors/LoggingBehavior.cs << 'EOF'
using MediatR;
using Microsoft.Extensions.Logging;

namespace InsureX.Application.Behaviors;

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        _logger.LogInformation("Handling {RequestName}", requestName);

        var response = await next();

        _logger.LogInformation("Handled {RequestName}", requestName);
        return response;
    }
}
EOF

echo "✅ LoggingBehavior created"

# 6. Update Application.csproj
echo "📝 Step 6: Updating Application.csproj..."

cat > InsureX.Application/InsureX.Application.csproj << 'EOF'
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="MediatR" />
    <PackageReference Include="FluentValidation" />
    <PackageReference Include="FluentValidation.DependencyInjectionExtensions" />
    <PackageReference Include="Microsoft.EntityFrameworkCore" />
    <PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\InsureX.Domain\InsureX.Domain.csproj" />
    <ProjectReference Include="..\InsureX.Shared\InsureX.Shared.csproj" />
  </ItemGroup>

</Project>
EOF

echo "✅ Application.csproj updated"

echo ""
echo "🎉 PHASE 1 COMPLETE!"
echo "Next: Run ./fix-phase2-cqrs.sh to convert services to CQRS"