using InsureX.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace InsureX.Infrastructure.Tenancy;

public class TenantContext : ITenantContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private int? _tenantId;

    public TenantContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int TenantId
    {
        get
        {
            if (_tenantId.HasValue)
                return _tenantId.Value;

            // Try to get from HTTP context
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext != null)
            {
                // From header
                var headerValue = httpContext.Request.Headers["X-Tenant-ID"].FirstOrDefault();
                if (!string.IsNullOrEmpty(headerValue) && int.TryParse(headerValue, out var headerTenantId))
                {
                    _tenantId = headerTenantId;
                    return headerTenantId;
                }

                // From user claims
                var claimValue = httpContext.User?.FindFirst("tenant_id")?.Value;
                if (!string.IsNullOrEmpty(claimValue) && int.TryParse(claimValue, out var claimTenantId))
                {
                    _tenantId = claimTenantId;
                    return claimTenantId;
                }
            }

            // Default tenant (for development/testing)
            return 1;
        }
    }

    public string? TenantName => _httpContextAccessor.HttpContext?.User?.FindFirst("tenant_name")?.Value;

    public bool IsValid => TenantId > 0;

    public void SetTenantId(int tenantId)
    {
        _tenantId = tenantId;
    }
}
