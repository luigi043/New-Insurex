using InsureX.Domain.Events;
using InsureX.Domain.ValueObjects;

namespace InsureX.Domain.Entities;

public class Policy : BaseEntity
{
    public string PolicyNumber { get; private set; } = string.Empty;
    public string PolicyType { get; private set; } = string.Empty;
    public decimal Premium { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public string Status { get; private set; } = "Active";
    public int TenantId { get; private set; }
    public int? AssetId { get; private set; }
    public int? PartnerId { get; private set; }
    
    // Navigation properties
    public Asset? Asset { get; private set; }
    public Partner? Partner { get; private set; }
    public Tenant? Tenant { get; private set; }
    public ICollection<Claim> Claims { get; private set; } = new List<Claim>();

    // Domain logic methods
    public static Policy Create(
        string policyNumber,
        string policyType,
        decimal premium,
        DateTime startDate,
        DateTime endDate,
        int tenantId,
        int? assetId = null,
        int? partnerId = null)
    {
        var policy = new Policy
        {
            PolicyNumber = new PolicyNumber(policyNumber).Value,
            PolicyType = policyType,
            Premium = premium,
            StartDate = startDate,
            EndDate = endDate,
            TenantId = tenantId,
            AssetId = assetId,
            PartnerId = partnerId,
            Status = "Active"
        };

        policy.SetCreated("system");
        policy.AddDomainEvent(new PolicyCreatedEvent(policy));

        return policy;
    }

    public void UpdateDates(DateTime newStartDate, DateTime newEndDate)
    {
        if (newEndDate <= newStartDate)
            throw new InvalidOperationException("End date must be after start date");

        StartDate = newStartDate;
        EndDate = newEndDate;
        SetUpdated("system");
    }

    public void Expire()
    {
        if (Status == "Expired")
            throw new InvalidOperationException("Policy is already expired");

        Status = "Expired";
        SetUpdated("system");
        AddDomainEvent(new PolicyExpiredEvent(this));
    }

    public void Cancel(string reason)
    {
        if (Status != "Active")
            throw new InvalidOperationException($"Cannot cancel policy with status {Status}");

        Status = "Cancelled";
        SetUpdated("system");
    }

    public void Reinstate()
    {
        if (Status != "Expired" && Status != "Cancelled")
            throw new InvalidOperationException($"Cannot reinstate policy with status {Status}");

        Status = "Active";
        SetUpdated("system");
    }

    public bool IsActive() => Status == "Active" && DateTime.UtcNow <= EndDate;
    public bool IsExpired() => DateTime.UtcNow > EndDate || Status == "Expired";
    
    public Money GetPremium() => new(Premium);
    public DateRange GetCoveragePeriod() => new(StartDate, EndDate);
}
