using System;
using System.Collections.Generic;

namespace InsureX.Domain.Entities;

public class Policy : BaseEntity
{
    public string PolicyNumber { get; set; } = string.Empty;
    public string PolicyType { get; set; } = string.Empty; // Personal, Business
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Premium { get; set; }
    public decimal InsuredValue { get; set; }
    public string Status { get; set; } = string.Empty; // Active, Suspended, Cancelled, Expired
    public string? PaymentStatus { get; set; } // Paid, Pending, Overdue
    
    // Foreign Keys
    public Guid PartnerId { get; set; }
    public Guid? InsurerId { get; set; }
    public Guid? FinancerId { get; set; }
    public Guid CreatedByUserId { get; set; }
    public Guid TenantId { get; set; } // Add missing TenantId
    
    // Navigation Properties
    public virtual Partner? Partner { get; set; }
    public virtual Partner? Insurer { get; set; }
    public virtual Partner? Financer { get; set; }
    public virtual User? CreatedByUser { get; set; }
    public virtual Tenant? Tenant { get; set; }
    public virtual ICollection<Asset> Assets { get; set; } = new List<Asset>();
    public virtual ICollection<Claim> Claims { get; set; } = new List<Claim>();
    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
