using System;

namespace InsureX.Domain.Entities;

public class Transaction : BaseEntity
{
    public string TransactionNumber { get; set; } = string.Empty;
    public DateTime TransactionDate { get; set; }
    public string TransactionType { get; set; } = string.Empty; // Premium Payment, Claim Payment, Refund
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public string? Reference { get; set; }
    public string Status { get; set; } = string.Empty; // Pending, Completed, Failed
    
    // Foreign Keys
    public Guid PolicyId { get; set; }
    public Guid? ClaimId { get; set; }
    
    // Navigation Properties
    public virtual Policy? Policy { get; set; }
    public virtual Claim? Claim { get; set; }
}
