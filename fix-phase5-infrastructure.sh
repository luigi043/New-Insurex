#!/bin/bash
# Phase 5: Final Cleanup - Remove Legacy, Add Global Exception Handling, Tests

echo "🏗️ PHASE 5: Infrastructure Cleanup & Final Touches"
echo "===================================================="

# 1. Create Global Exception Handler Middleware
echo "📋 Step 1: Creating global exception handler..."

cat > InsureX.API/Middleware/ExceptionHandlingMiddleware.cs << 'EOF'
using System.Net;
using FluentValidation;
using InsureX.Application.Exceptions;

namespace InsureX.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            await HandleValidationExceptionAsync(context, ex);
        }
        catch (DomainException ex)
        {
            await HandleDomainExceptionAsync(context, ex);
        }
        catch (UnauthorizedAccessException ex)
        {
            await HandleUnauthorizedExceptionAsync(context, ex);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleValidationExceptionAsync(HttpContext context, ValidationException exception)
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        context.Response.ContentType = "application/json";

        var errors = exception.Errors.Select(e => new
        {
            Property = e.PropertyName,
            Message = e.ErrorMessage
        });

        var response = new
        {
            Status = HttpStatusCode.BadRequest,
            Message = "Validation failed",
            Errors = errors
        };

        return context.Response.WriteAsJsonAsync(response);
    }

    private static Task HandleDomainExceptionAsync(HttpContext context, DomainException exception)
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        context.Response.ContentType = "application/json";

        var response = new
        {
            Status = HttpStatusCode.BadRequest,
            Message = exception.Message,
            Code = exception.Code
        };

        return context.Response.WriteAsJsonAsync(response);
    }

    private static Task HandleUnauthorizedExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/json";

        var response = new
        {
            Status = HttpStatusCode.Unauthorized,
            Message = exception.Message
        };

        return context.Response.WriteAsJsonAsync(response);
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "Unhandled exception occurred");

        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        var response = new
        {
            Status = HttpStatusCode.InternalServerError,
            Message = "An unexpected error occurred"
        };

        return context.Response.WriteAsJsonAsync(response);
    }
}
EOF

echo "✅ Exception handling middleware created"

# 2. Create Domain Exception
echo "📋 Step 2: Creating domain exception..."

cat > InsureX.Application/Exceptions/DomainException.cs << 'EOF'
namespace InsureX.Application.Exceptions;

public class DomainException : Exception
{
    public string Code { get; }

    public DomainException(string message, string code = "DOMAIN_ERROR") : base(message)
    {
        Code = code;
    }
}
EOF

echo "✅ Domain exception created"

# 3. Update Program.cs with all middleware
echo "📋 Step 3: Final Program.cs update..."

cat > InsureX.API/Program.cs << 'EOF'
using InsureX.Infrastructure.Data;
using InsureX.Application.Interfaces;
using InsureX.Infrastructure.Repositories;
using InsureX.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using InsureX.Infrastructure.Services;
using InsureX.Application.Behaviors;
using InsureX.API.Middleware;
using FluentValidation;
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
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ITenantContext, TenantContext>();
builder.Services.AddScoped<ITenantValidationService, TenantValidationService>();
builder.Services.AddScoped<IPremiumCalculationService, PremiumCalculationService>();

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

// MediatR with pipeline behaviors
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(IAuthService).Assembly);
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
});

// FluentValidation
builder.Services.AddValidatorsFromAssembly(typeof(IAuthService).Assembly);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Custom middleware (order matters!)
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RateLimitingMiddleware>();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await context.Database.MigrateAsync();

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

echo "✅ Program.cs finalized"

# 4. Create test project structure
echo "📋 Step 4: Creating test project structure..."

mkdir -p InsureX.Tests/Unit/Commands
mkdir -p InsureX.Tests/Unit/Queries
mkdir -p InsureX.Tests/Unit/Validators
mkdir -p InsureX.Tests/Integration
mkdir -p InsureX.Tests/Common

cat > InsureX.Tests/Unit/Validators/CreatePolicyCommandValidatorTests.cs << 'EOF'
using FluentValidation.TestHelper;
using InsureX.Application.Commands.Policy;
using InsureX.Application.Validators.Policy;
using Xunit;

namespace InsureX.Tests.Unit.Validators;

public class CreatePolicyCommandValidatorTests
{
    private readonly CreatePolicyCommandValidator _validator;

    public CreatePolicyCommandValidatorTests()
    {
        _validator = new CreatePolicyCommandValidator();
    }

    [Fact]
    public void Should_Have_Error_When_PolicyNumber_Is_Empty()
    {
        var command = new CreatePolicyCommand("", "Type", 100, DateTime.Now, DateTime.Now.AddMonths(1), 1);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.PolicyNumber);
    }

    [Fact]
    public void Should_Have_Error_When_Premium_Is_Zero()
    {
        var command = new CreatePolicyCommand("POL-001", "Type", 0, DateTime.Now, DateTime.Now.AddMonths(1), 1);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Premium);
    }

    [Fact]
    public void Should_Have_Error_When_EndDate_Before_StartDate()
    {
        var start = DateTime.Now.AddMonths(1);
        var end = DateTime.Now;
        var command = new CreatePolicyCommand("POL-001", "Type", 100, start, end, 1);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.EndDate);
    }

    [Fact]
    public void Should_Not_Have_Error_When_Command_Is_Valid()
    {
        var command = new CreatePolicyCommand("POL-001", "Type", 100, DateTime.Now.AddDays(1), DateTime.Now.AddMonths(1), 1);
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }
}
EOF

echo "✅ Test structure created"

# 5. Create cleanup script for legacy code
echo "📋 Step 5: Creating legacy cleanup script..."

cat > cleanup-legacy.sh << 'EOF'
#!/bin/bash
# WARNING: This moves legacy code to _Archive/legacy-backup/
# Run this only after confirming new structure works!

echo "🗄️ Archiving legacy code..."

mkdir -p _Archive/legacy-backup

# Move legacy projects to archive
mv IAPR_API/ _Archive/legacy-backup/ 2>/dev/null || true
mv IAPR_Data/ _Archive/legacy-backup/ 2>/dev/null || true
mv IAPR_Web/ _Archive/legacy-backup/ 2>/dev/null || true
mv InsurexService/ _Archive/legacy-backup/ 2>/dev/null || true
mv WcfService1/ _Archive/legacy-backup/ 2>/dev/null || true
mv WcfServiceLibrary1/ _Archive/legacy-backup/ 2>/dev/null || true
mv WcfServiceLibrary2/ _Archive/legacy-backup/ 2>/dev/null || true
mv WebApplication1/ _Archive/legacy-backup/ 2>/dev/null || true
mv WebApplication2/ _Archive/legacy-backup/ 2>/dev/null || true
mv WebApplication3/ _Archive/legacy-backup/ 2>/dev/null || true

# Remove old solution file
mv Insured_Assest_Protection_Register.sln _Archive/legacy-backup/ 2>/dev/null || true

echo "✅ Legacy code archived to _Archive/legacy-backup/"
echo "⚠️  If you need to restore: git checkout HEAD -- [foldername]"
EOF