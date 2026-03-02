// InsureX.Domain/Entities/Payment.cs
namespace InsureX.Domain.Entities;

public class Payment : BaseEntity
{
    public int InvoiceId { get; set; }
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public string? TransactionId { get; set; }
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }
    
    // Navigation
    public Invoice Invoice { get; set; } = null!;
}

public enum PaymentMethod
{
    CREDIT_CARD,
    BANK_TRANSFER,
    CASH,
    CHECK,
    DIGITAL_WALLET
}