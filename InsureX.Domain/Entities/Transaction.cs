namespace InsureX.Domain.Entities;

public class Transaction : BaseEntity
{
    public string TransactionReference { get; set; } = string.Empty;
    public int TenantId { get; set; }
    public TransactionType Type { get; set; }
    public TransactionStatus Status { get; set; } = TransactionStatus.Pending;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string Description { get; set; } = string.Empty;
    public int? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }
    public DateTime TransactionDate { get; set; }
    public DateTime? PostedDate { get; set; }
    public string? Notes { get; set; }
    public int? ApprovedById { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? RejectionReason { get; set; }
    public string? ExternalReference { get; set; }
    
    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public User? ApprovedBy { get; set; }
}

public enum TransactionType
{
    Premium = 0,
    ClaimPayment = 1,
    Commission = 2,
    Refund = 3,
    Adjustment = 4,
    Fee = 5,
    Interest = 6,
    Other = 7
}

public enum TransactionStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Posted = 3,
    Reversed = 4
}
