namespace InsureX.Domain.Interfaces;

public interface ITenantContext
{
    int TenantId { get; }
    string? TenantName { get; }
    bool IsValid { get; }
}
