using InsureX.Infrastructure.Data; using InsureX.Application.Interfaces; using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Repositories; using InsureX.Infrastructure.Security; using InsureX.Infrastructure.Services;
using InsureX.Application.Services; using InsureX.Application.Services.Dashboard; using Microsoft.EntityFrameworkCore;
using InsureX.Application.Behaviors; using FluentValidation; using MediatR; using Serilog;

var builder = WebApplication.CreateBuilder(args);
Log.Logger = new LoggerConfiguration().WriteTo.Console().WriteTo.File("logs/insurex-.txt", rollingInterval: RollingInterval.Day).CreateLogger();
builder.Host.UseSerilog();

builder.Services.AddControllers().AddEndpointsApiExplorer().AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new() { Title = "InsureX API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme {
        Description = "JWT Authorization header using the Bearer scheme", Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header, Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey, Scheme = "Bearer"
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection") ?? "Server=(localdb)\\MSSQLLocalDB;Database=InsurexDb;Trusted_Connection=True;TrustServerCertificate=True;"));

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>().AddScoped<IPolicyRepository, PolicyRepository>()
    .AddScoped<IAssetRepository, AssetRepository>().AddScoped<IClaimRepository, ClaimRepository>()
    .AddScoped<ITenantRepository, TenantRepository>().AddScoped<IPartnerRepository, PartnerRepository>()
    .AddScoped<IRefreshTokenRepository, RefreshTokenRepository>().AddScoped<IUnitOfWork, UnitOfWork>();

// Services
builder.Services.AddScoped<IAuthService, AuthService>().AddScoped<IJwtService, JwtService>()
    .AddScoped<IPasswordHasher, PasswordHasher>().AddScoped<ITenantContext, TenantContext>()
    .AddScoped<ITenantValidationService, TenantValidationService>().AddScoped<IPolicyService, PolicyService>()
    .AddScoped<IDashboardService, DashboardService>().AddScoped<IClaimService, ClaimService>()
    .AddScoped<IAssetService, AssetService>().AddScoped<IPartnerService, PartnerService>();

builder.Services.AddCors(options => options.AddPolicy("AllowFrontend", policy => 
    policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "http://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

builder.Services.AddMediatR(cfg => { cfg.RegisterServicesFromAssembly(typeof(IAuthService).Assembly);
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>)); });

builder.Services.AddValidatorsFromAssembly(typeof(IAuthService).Assembly).AddAutoMapper(typeof(IAuthService).Assembly);

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = System.Text.Encoding.UTF8.GetBytes(jwtSettings["Secret"] ?? "your-super-secret-key-with-at-least-32-characters!");
builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => {
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters {
        ValidateIssuerSigningKey = true, IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key),
        ValidateIssuer = true, ValidIssuer = jwtSettings["Issuer"] ?? "InsureX",
        ValidateAudience = true, ValidAudience = jwtSettings["Audience"] ?? "InsureX.Client", ValidateLifetime = true, ClockSkew = TimeSpan.Zero
    };
});

var app = builder.Build();
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }
app.UseSerilogRequestLogging().UseHttpsRedirection().UseCors("AllowFrontend").UseAuthentication().UseAuthorization().MapControllers();

using (var scope = app.Services.CreateScope()) {
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await context.Database.MigrateAsync();
}
app.Run();
