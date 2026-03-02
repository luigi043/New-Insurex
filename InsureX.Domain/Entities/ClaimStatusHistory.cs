using System;

namespace InsureX.Domain.Entities;

public class ClaimStatusHistory : BaseEntity
{
    public Guid ClaimId { get; set; }
    public Claim Claim { get; set; } = null!;
    public ClaimStatus OldStatus { get; set; }
    public ClaimStatus NewStatus { get; set; }
    public string ChangedBy { get; set; } = string.Empty;
    public string? Reason { get; set; }
}