using InsureX.Domain.Entities;

namespace InsureX.Domain.Events;

public class PolicyExpiredEvent : DomainEvent
{
    public int PolicyId { get; }
    public string PolicyNumber { get; }
    public int TenantId { get; }
    public DateTime ExpiredDate { get; }

    public PolicyExpiredEvent(Policy policy)
    {
        EventType = nameof(PolicyExpiredEvent);
        PolicyId = policy.Id;
        PolicyNumber = policy.PolicyNumber;
        TenantId = policy.TenantId;
        ExpiredDate = DateTime.UtcNow;
    }
}
