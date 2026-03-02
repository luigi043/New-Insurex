using InsureX.Domain.Entities;

namespace InsureX.Domain.Events;

public class ClaimSubmittedEvent : DomainEvent
{
    public int ClaimId { get; }
    public int PolicyId { get; }
    public string PolicyNumber { get; }
    public decimal ClaimAmount { get; }
    public int TenantId { get; }

    public ClaimSubmittedEvent(Claim claim, Policy policy)
    {
        EventType = nameof(ClaimSubmittedEvent);
        ClaimId = claim.Id;
        PolicyId = policy.Id;
        PolicyNumber = policy.PolicyNumber;
        ClaimAmount = claim.Amount;
        TenantId = policy.TenantId;
    }
}
