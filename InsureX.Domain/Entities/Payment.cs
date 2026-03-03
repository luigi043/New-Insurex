using InsureX.Domain.Enums;

namespace InsureX.Domain.Entities;

public class Payment : BaseEntity
{
    public string PaymentReference { get; set; } = string.Empty;
    public int TenantId { get; set; }
    public int InvoiceId { get; set; }
    public decimal Amount { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public DateTime PaymentDate { get; set; }
    public string? TransactionId { get; set; }
    public string? BankReference { get; set; }
    public string? CheckNumber { get; set; }
    public string? CardLastFourDigits { get; set; }
    public string? CardType { get; set; }
    public string? Notes { get; set; }
    public bool IsReconciled { get; set; }
    public DateTime? ReconciledAt { get; set; }
    public int? ReconciledById { get; set; }
    public int? ProcessedById { get; set; }
    public string? Currency { get; set; } = "USD";
    public decimal? ExchangeRate { get; set; }
    public decimal? OriginalAmount { get; set; }
    public string? OriginalCurrency { get; set; }
    
    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public Invoice Invoice { get; set; } = null!;
    public User? ReconciledBy { get; set; }
    public User? ProcessedBy { get; set; }
}
