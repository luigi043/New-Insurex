using InsureX.Domain.Entities;

namespace InsureX.Domain.Events;

public class ClaimSubmittedEvent
{
    public Claim Claim { get; }
    public DateTime SubmittedAt { get; }
    public string SubmittedBy { get; }

    public ClaimSubmittedEvent(Claim claim, string submittedBy)
    {
        Claim = claim;
        SubmittedAt = DateTime.UtcNow;
        SubmittedBy = submittedBy;
    }

    public int ClaimId => Claim.Id;
    public string ClaimNumber => Claim.ClaimNumber;
    public decimal ClaimedAmount => Claim.ClaimedAmount;
    public int PolicyId => Claim.PolicyId;
    public int TenantId => Claim.TenantId;
}
