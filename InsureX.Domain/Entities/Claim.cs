using System;

namespace InsureX.Domain.Entities;

public class Claim : BaseEntity
{
    public string ClaimNumber { get; set; } = string.Empty;
    public DateTime IncidentDate { get; set; }
    public DateTime FilingDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal ClaimAmount { get; set; }
    public decimal ApprovedAmount { get; set; }
    public string Status { get; set; } = string.Empty; // Filed, Under Review, Approved, Rejected, Paid
    public string? AdjusterNotes { get; set; }
    
    // Foreign Keys
    public Guid PolicyId { get; set; }
    public Guid? AssetId { get; set; }
    
    // Navigation Properties
    public virtual Policy? Policy { get; set; }
    public virtual Asset? Asset { get; set; }
}
