using InsureX.Domain.Events;

namespace InsureX.Domain.Entities;

public class Claim : BaseEntity
{
    public string ClaimNumber { get; private set; } = string.Empty;
    public int PolicyId { get; private set; }
    public decimal Amount { get; private set; }
    public string Description { get; private set; } = string.Empty;
    public string Status { get; private set; } = "Submitted";
    public DateTime IncidentDate { get; private set; }
    public string? ResolutionNotes { get; private set; }
    public DateTime? ResolvedAt { get; private set; }
    
    public Policy Policy { get; private set; } = null!;

    public static Claim Create(
        string claimNumber,
        int policyId,
        decimal amount,
        string description,
        DateTime incidentDate)
    {
        if (amount <= 0)
            throw new ArgumentException("Claim amount must be positive");

        var claim = new Claim
        {
            ClaimNumber = claimNumber,
            PolicyId = policyId,
            Amount = amount,
            Description = description,
            IncidentDate = incidentDate,
            Status = "Submitted"
        };

        claim.SetCreated("system");
        return claim;
    }

    public void Approve(string? notes = null)
    {
        if (Status != "Submitted" && Status != "UnderReview")
            throw new InvalidOperationException($"Cannot approve claim with status {Status}");

        Status = "Approved";
        ResolutionNotes = notes;
        ResolvedAt = DateTime.UtcNow;
        SetUpdated("system");
    }

    public void Reject(string reason)
    {
        if (Status != "Submitted" && Status != "UnderReview")
            throw new InvalidOperationException($"Cannot reject claim with status {Status}");

        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("Rejection reason is required");

        Status = "Rejected";
        ResolutionNotes = reason;
        ResolvedAt = DateTime.UtcNow;
        SetUpdated("system");
    }

    public void Review()
    {
        if (Status != "Submitted")
            throw new InvalidOperationException("Only submitted claims can be put under review");

        Status = "UnderReview";
        SetUpdated("system");
    }

    public void SubmitToPolicy(Policy policy)
    {
        if (!policy.IsActive())
            throw new InvalidOperationException("Cannot submit claim to inactive policy");

        AddDomainEvent(new ClaimSubmittedEvent(this, policy));
    }
}
