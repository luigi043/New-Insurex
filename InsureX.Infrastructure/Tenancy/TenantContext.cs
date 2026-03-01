using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using InsureX.Domain.Interfaces;

namespace InsureX.Infrastructure.Tenancy;

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
            try
            {
                // Get tenant from claims (for authenticated users)
                var tenantClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("tenant_id");
                if (tenantClaim != null && Guid.TryParse(tenantClaim.Value, out var tenantId))
                {
                    return tenantId;
                }

                // For development, return a fixed tenant ID
                return Guid.Parse("11111111-1111-1111-1111-111111111111");
            }
            catch
            {
                return Guid.Parse("11111111-1111-1111-1111-111111111111");
            }
        }
    }

    public string? TenantName => "Development Tenant";
}
