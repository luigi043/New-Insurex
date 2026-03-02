using System;
using InsureX.Domain.Interfaces;

namespace InsureX.Infrastructure.Context;

public class TenantContext : ITenantContext
{
    private Guid _tenantId;
    private string? _tenantName;

    public Guid TenantId => _tenantId;
    public string? TenantName => _tenantName;

    public void SetTenant(Guid tenantId, string? tenantName = null)
    {
        _tenantId = tenantId;
        _tenantName = tenantName;
    }
}