// InsureX.Domain/Entities/Invoice.cs
namespace InsureX.Domain.Entities;

public class Invoice : BaseEntity
{
    public Guid TenantId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public int? PolicyId { get; set; }
    public int? PartnerId { get; set; }
    public decimal Amount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount => Amount + TaxAmount;
    public InvoiceStatus Status { get; set; } = InvoiceStatus.DRAFT;
    public DateTime IssueDate { get; set; } = DateTime.UtcNow;
    public DateTime DueDate { get; set; }
    public DateTime? PaidDate { get; set; }
    public string? Notes { get; set; }
    
    // Navigation
    public Policy? Policy { get; set; }
    public Partner? Partner { get; set; }
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}

public enum InvoiceStatus
{
    DRAFT,
    SENT,
    PARTIAL,
    PAID,
    OVERDUE,
    CANCELLED
}