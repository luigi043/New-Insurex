using InsureX.Domain.Entities;

namespace InsureX.Domain.Events;

public class PolicyCreatedEvent : DomainEvent
{
    public int PolicyId { get; }
    public string PolicyNumber { get; }
    public int TenantId { get; }
    public DateTime StartDate { get; }
    public DateTime EndDate { get; }

    public PolicyCreatedEvent(Policy policy)
    {
        EventType = nameof(PolicyCreatedEvent);
        PolicyId = policy.Id;
        PolicyNumber = policy.PolicyNumber;
        TenantId = policy.TenantId;
        StartDate = policy.StartDate;
        EndDate = policy.EndDate;
    }
}
