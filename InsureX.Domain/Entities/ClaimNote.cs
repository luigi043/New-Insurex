using System;

namespace InsureX.Domain.Entities;

public class ClaimNote : BaseEntity
{
    public Guid ClaimId { get; set; }
    public Claim Claim { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public bool IsInternal { get; set; }
}