using System;

namespace InsureX.Domain.Interfaces;

public interface ITenantContext
{
    Guid TenantId { get; }
    string? TenantName { get; }
}
