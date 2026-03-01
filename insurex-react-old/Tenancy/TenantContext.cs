using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace InsureX.Infrastructure.Tenancy;

public interface ITenantContext
{
    Guid TenantId { get; }
    string? TenantName { get; }
}

public class TenantContext : ITenantContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TenantContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid TenantId
    {
        get
        {
            // Get tenant from claims (for authenticated users)
            var tenantClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("tenant_id");
            if (tenantClaim != null && Guid.TryParse(tenantClaim.Value, out var tenantId))
            {
                return tenantId;
            }

            // For system integrations, get from header
            var tenantHeader = _httpContextAccessor.HttpContext?.Request.Headers["X-Tenant-Id"].FirstOrDefault();
            if (!string.IsNullOrEmpty(tenantHeader) && Guid.TryParse(tenantHeader, out tenantId))
            {
                return tenantId;
            }

            // For development, return a default tenant
            #if DEBUG
            return Guid.Parse("11111111-1111-1111-1111-111111111111");
            #endif

            throw new UnauthorizedAccessException("Tenant context not found");
        }
    }

    public string? TenantName => _httpContextAccessor.HttpContext?.User?.FindFirst("tenant_name")?.Value;
}
