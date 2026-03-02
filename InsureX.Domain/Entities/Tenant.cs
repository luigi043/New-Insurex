
using InsureX.Domain.Entities;
namespace InsureX.Domain.Entities;

public class Tenant : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Subdomain { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public TenantStatus Status { get; set; } = TenantStatus.Active;
    public DateTime? SubscriptionEndDate { get; set; }
}

public enum TenantStatus
{
    Active,
    Suspended,
    Cancelled
}