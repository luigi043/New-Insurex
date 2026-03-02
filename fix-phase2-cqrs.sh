#!/bin/bash
# Phase 2: Convert Service Pattern to CQRS
# Transforms PolicyService into proper Commands/Queries/Handlers

echo "🔄 PHASE 2: CQRS Migration"
echo "=========================="

# 1. Create Base Command/Query interfaces
echo "📋 Step 1: Creating base interfaces..."

cat > InsureX.Application/Interfaces/ICommand.cs << 'EOF'
using MediatR;

namespace InsureX.Application.Interfaces;

// Marker interfaces for CQRS
public interface ICommand<out TResponse> : IRequest<TResponse> { }
public interface ICommand : IRequest { }

public interface IQuery<out TResponse> : IRequest<TResponse> { }
EOF

echo "✅ Base interfaces created"

# 2. Convert CreatePolicy to CQRS
echo "🔄 Step 2: Converting CreatePolicy to Command..."

cat > InsureX.Application/Commands/Policy/CreatePolicyCommand.cs << 'EOF'
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;

namespace InsureX.Application.Commands.Policy;

public record CreatePolicyCommand(
    string PolicyNumber,
    string PolicyType,
    decimal Premium,
    DateTime StartDate,
    DateTime EndDate,
    int TenantId,
    int? AssetId = null,
    int? PartnerId = null
) : ICommand<Policy>;
EOF

cat > InsureX.Application/Handlers/Policy/CreatePolicyCommandHandler.cs << 'EOF'
using InsureX.Application.Commands.Policy;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using MediatR;

namespace InsureX.Application.Handlers.Policy;

public class CreatePolicyCommandHandler : IRequestHandler<CreatePolicyCommand, Policy>
{
    private readonly IPolicyRepository _policyRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreatePolicyCommandHandler(
        IPolicyRepository policyRepository,
        IUnitOfWork unitOfWork)
    {
        _policyRepository = policyRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Policy> Handle(CreatePolicyCommand request, CancellationToken cancellationToken)
    {
        var policy = new Policy
        {
            PolicyNumber = request.PolicyNumber,
            PolicyType = request.PolicyType,
            Premium = request.Premium,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            TenantId = request.TenantId,
            AssetId = request.AssetId,
            PartnerId = request.PartnerId,
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };

        await _policyRepository.AddAsync(policy, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return policy;
    }
}
EOF

echo "✅ CreatePolicy command created"

# 3. Create GetPolicyById Query
echo "🔄 Step 3: Creating GetPolicyById Query..."

cat > InsureX.Application/Queries/Policy/GetPolicyByIdQuery.cs << 'EOF'
using InsureX.Application.DTOs.Policy;
using InsureX.Application.Interfaces;

namespace InsureX.Application.Queries.Policy;

public record GetPolicyByIdQuery(int Id) : IQuery<PolicyDto?>;
EOF

cat > InsureX.Application/Handlers/Policy/GetPolicyByIdQueryHandler.cs << 'EOF'
using InsureX.Application.DTOs.Policy;
using InsureX.Application.Queries.Policy;
using InsureX.Domain.Interfaces;
using MediatR;

namespace InsureX.Application.Handlers.Policy;

public class GetPolicyByIdQueryHandler : IRequestHandler<GetPolicyByIdQuery, PolicyDto?>
{
    private readonly IPolicyRepository _policyRepository;

    public GetPolicyByIdQueryHandler(IPolicyRepository policyRepository)
    {
        _policyRepository = policyRepository;
    }

    public async Task<PolicyDto?> Handle(GetPolicyByIdQuery request, CancellationToken cancellationToken)
    {
        var policy = await _policyRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (policy == null) return null;

        return new PolicyDto
        {
            Id = policy.Id,
            PolicyNumber = policy.PolicyNumber,
            PolicyType = policy.PolicyType,
            Premium = policy.Premium,
            StartDate = policy.StartDate,
            EndDate = policy.EndDate,
            Status = policy.Status,
            TenantId = policy.TenantId
        };
    }
}
EOF

echo "✅ GetPolicyById query created"

# 4. Create GetAllPolicies Query with Pagination
echo "🔄 Step 4: Creating GetAllPolicies Query..."

cat > InsureX.Application/Queries/Policy/GetAllPoliciesQuery.cs << 'EOF'
using InsureX.Application.DTOs.Policy;
using InsureX.Application.Interfaces;

namespace InsureX.Application.Queries.Policy;

public record GetAllPoliciesQuery(
    int Page = 1,
    int PageSize = 10,
    string? SearchTerm = null,
    string? Status = null,
    int? TenantId = null
) : IQuery<PaginatedList<PolicyDto>>;
EOF

cat > InsureX.Application/DTOs/Policy/PaginatedList.cs << 'EOF'
namespace InsureX.Application.DTOs.Policy;

public class PaginatedList<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;
}
EOF

cat > InsureX.Application/DTOs/Policy/PolicyDto.cs << 'EOF'
namespace InsureX.Application.DTOs.Policy;

public class PolicyDto
{
    public int Id { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public string PolicyType { get; set; } = string.Empty;
    public decimal Premium { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public int TenantId { get; set; }
    public DateTime CreatedAt { get; set; }
}
EOF

echo "✅ Policy DTOs and pagination created"

# 5. Create Validator for CreatePolicyCommand
echo "🔄 Step 5: Creating FluentValidation validator..."

cat > InsureX.Application/Validators/Policy/CreatePolicyCommandValidator.cs << 'EOF'
using FluentValidation;
using InsureX.Application.Commands.Policy;

namespace InsureX.Application.Validators.Policy;

public class CreatePolicyCommandValidator : AbstractValidator<CreatePolicyCommand>
{
    public CreatePolicyCommandValidator()
    {
        RuleFor(x => x.PolicyNumber)
            .NotEmpty().WithMessage("Policy number is required")
            .MaximumLength(50).WithMessage("Policy number cannot exceed 50 characters");

        RuleFor(x => x.PolicyType)
            .NotEmpty().WithMessage("Policy type is required")
            .MaximumLength(100);

        RuleFor(x => x.Premium)
            .GreaterThan(0).WithMessage("Premium must be greater than zero");

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Start date is required")
            .Must(BeInTheFuture).WithMessage("Start date must be in the future");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date");

        RuleFor(x => x.TenantId)
            .GreaterThan(0).WithMessage("Valid tenant is required");
    }

    private bool BeInTheFuture(DateTime date)
    {
        return date.Date >= DateTime.UtcNow.Date;
    }
}
EOF

echo "✅ Validator created"

# 6. Update Program.cs to add FluentValidation and Behaviors
echo "🔄 Step 6: Updating Program.cs with behaviors..."

cat > InsureX.API/Program.cs << 'EOF'
using InsureX.Infrastructure.Data;
using InsureX.Application.Interfaces;
using InsureX.Infrastructure.Repositories;
using InsureX.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using InsureX.Infrastructure.Services;
using InsureX.Application.Behaviors;
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

// Register services (keep for backward compatibility during migration)
builder.Services.AddScoped<IAuthService, AuthService>();
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

// FIXED: MediatR with behaviors
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(IAuthService).Assembly);
    
    // Add pipeline behaviors
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
});

// Add FluentValidation
builder.Services.AddValidatorsFromAssembly(typeof(IAuthService).Assembly);

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

echo "✅ Program.cs updated with behaviors"

echo ""
echo "🎉 PHASE 2 COMPLETE!"
echo "Next: Run ./fix-phase3-domain.sh to enrich domain layer"