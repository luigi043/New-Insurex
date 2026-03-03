using InsureX.Domain.Enums;

namespace InsureX.Domain.Entities;

public class Policy : BaseEntity
{
    public string PolicyNumber { get; set; } = string.Empty;
    public int TenantId { get; set; }
    public PolicyType Type { get; set; }
    public PolicyStatus Status { get; set; } = PolicyStatus.Draft;
    public decimal PremiumAmount { get; set; }
    public decimal CoverageAmount { get; set; }
    public decimal Deductible { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public PaymentFrequency PaymentFrequency { get; set; }
    public int? InsuredId { get; set; } // Partner ID
    public int? BrokerId { get; set; } // Partner ID
    public int? UnderwriterId { get; set; } // User ID
    public string? Description { get; set; }
    public string? TermsAndConditions { get; set; }
    public string? Exclusions { get; set; }
    public string? Notes { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public int? ApprovedById { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }
    public int? CancelledById { get; set; }
    
    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public Partner? Insured { get; set; }
    public Partner? Broker { get; set; }
    public User? Underwriter { get; set; }
    public User? ApprovedBy { get; set; }
    public User? CancelledBy { get; set; }
    public ICollection<PolicyAsset> PolicyAssets { get; set; } = new List<PolicyAsset>();
    public ICollection<Claim> Claims { get; set; } = new List<Claim>();
    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    
    public bool IsExpired => DateTime.UtcNow > EndDate;
    public bool IsActive => Status == PolicyStatus.Active && !IsExpired;
    public int DaysUntilExpiry => (EndDate - DateTime.UtcNow).Days;
}
