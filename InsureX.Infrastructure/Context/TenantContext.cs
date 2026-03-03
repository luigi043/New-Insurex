using InsureX.Domain.Interfaces;

namespace InsureX.Infrastructure.Context;

public class TenantContext : ITenantContext
{
    private int _tenantId;
    private string? _tenantName;

    public int TenantId => _tenantId;
    public string? TenantName => _tenantName;
    public bool IsValid => _tenantId > 0;

    public void SetTenant(int tenantId, string? tenantName = null)
    {
        _tenantId = tenantId;
        _tenantName = tenantName;
    }
}
