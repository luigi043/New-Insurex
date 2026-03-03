using System.Text;
using InsureX.API.Middleware;
using InsureX.Application.Interfaces;
using InsureX.Application.Services;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using InsureX.Infrastructure.Repositories;
using InsureX.Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "InsureX API", 
        Version = "v1",
        Description = "Insurance Management System API",
        Contact = new OpenApiContact
        {
            Name = "InsureX Support",
            Email = "support@insurex.com"
        }
    });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database Context
builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
    });
});

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Log.Warning("Authentication failed: {Message}", context.Exception.Message);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Log.Debug("Token validated for user: {User}", context.Principal?.Identity?.Name);
            return Task.CompletedTask;
        }
    };
});

// Authorization Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("InsurerOnly", policy => policy.RequireRole("Admin", "Insurer"));
    options.AddPolicy("BrokerAccess", policy => policy.RequireRole("Admin", "Insurer", "Broker"));
    options.AddPolicy("ClaimsProcessor", policy => policy.RequireRole("Admin", "Insurer", "ClaimsProcessor"));
    options.AddPolicy("Accounting", policy => policy.RequireRole("Admin", "Insurer", "Accountant"));
});

// Register Repositories
builder.Services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<ApplicationDbContext>());
builder.Services.AddScoped<IAssetRepository, AssetRepository>();
builder.Services.AddScoped<IClaimRepository, ClaimRepository>();
builder.Services.AddScoped<IPolicyRepository, PolicyRepository>();
builder.Services.AddScoped<IPartnerRepository, PartnerRepository>();
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Register Services
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IClaimService, ClaimService>();
builder.Services.AddScoped<IPolicyService, PolicyService>();
builder.Services.AddScoped<IPartnerService, PartnerService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IJwtService, JwtService>();

// Tenant Context
builder.Services.AddScoped<ITenantContext, TenantContext>();

// Health Checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>("database", tags: new[] { "db", "sql" })
    .AddCheck("memory", () => 
    {
        var allocatedMemory = GC.GetTotalMemory(false);
        var threshold = 1024L * 1024L * 1024L; // 1GB
        return allocatedMemory < threshold 
            ? Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy("Memory usage is normal") 
            : Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Degraded("Memory usage is high");
    }, tags: new[] { "memory" });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[] { "http://localhost:3000" };
        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Rate Limiting
builder.Services.AddMemoryCache();
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("fixed", limiterOptions =>
    {
        limiterOptions.PermitLimit = 100;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueProcessingOrder = System.Threading.RateLimiting.QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = 10;
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "InsureX API V1");
        c.DocumentTitle = "InsureX API Documentation";
    });
}

// Security Headers
app.UseSecurityHeaders();

// Global Exception Handler (should be first)
app.UseGlobalExceptionHandler();

// Request Validation
app.UseRequestValidation();

// Request Timing
app.UseRequestTiming();

// HTTPS Redirection
app.UseHttpsRedirection();

// CORS
app.UseCors("AllowSpecificOrigins");

// Rate Limiting
app.UseRateLimiter();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Tenant Resolution
app.UseTenantResolution();

// Health Checks
app.MapHealthChecks("/health", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var response = new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                exception = e.Value.Exception?.Message,
                duration = e.Value.Duration.ToString()
            }),
            totalDuration = report.TotalDuration.ToString()
        };
        await context.Response.WriteAsJsonAsync(response);
    }
});

app.MapHealthChecks("/health/ready", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("db"),
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { status = report.Status.ToString() });
    }
});

app.MapHealthChecks("/health/live", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = _ => false,
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { status = report.Status.ToString() });
    }
});

// Controllers
app.MapControllers();

// Ensure database is created and migrated
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        Log.Information("Applying database migrations...");
        await dbContext.Database.MigrateAsync();
        Log.Information("Database migrations applied successfully");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "An error occurred while applying database migrations");
    }
}

app.Run();
