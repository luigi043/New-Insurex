
using InsureX.Domain.Entities;

namespace InsureX.Domain.Entities;

public class Transaction : BaseEntity
{
    public string TransactionNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public TransactionStatus Status { get; set; } = TransactionStatus.Pending;
    public string? Description { get; set; }
    
    public Guid? PolicyId { get; set; }
    public Policy? Policy { get; set; }
    
    public Guid? ClaimId { get; set; }
    public Claim? Claim { get; set; }
}

public enum TransactionType
{
    Premium,
    ClaimPayment,
    Refund,
    Fee
}

public enum TransactionStatus
{
    Pending,
    Completed,
    Failed,
    Cancelled
}