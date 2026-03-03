using InsureX.Domain.Interfaces;

namespace InsureX.API.Middleware;

public class TenantResolutionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<TenantResolutionMiddleware> _logger;

    public TenantResolutionMiddleware(RequestDelegate next, ILogger<TenantResolutionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, ITenantContext tenantContext)
    {
        // Try to get tenant from header
        var tenantIdHeader = context.Request.Headers["X-Tenant-ID"].FirstOrDefault();
        
        // Or from JWT claim
        var tenantClaim = context.User?.FindFirst("tenant_id")?.Value;
        
        var tenantId = tenantIdHeader ?? tenantClaim;

        if (!string.IsNullOrEmpty(tenantId) && int.TryParse(tenantId, out var id))
        {
            // Set tenant on context - this would be implemented in your TenantContext class
            _logger.LogDebug("Tenant resolved: {TenantId}", id);
        }
        else
        {
            _logger.LogDebug("No tenant resolved for request");
        }

        await _next(context);
    }
}

public static class TenantResolutionMiddlewareExtensions
{
    public static IApplicationBuilder UseTenantResolution(this IApplicationBuilder app)
    {
        return app.UseMiddleware<TenantResolutionMiddleware>();
    }
}
