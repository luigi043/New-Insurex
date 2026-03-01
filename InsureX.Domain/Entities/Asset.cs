using System;

namespace InsureX.Domain.Entities;

public class Asset : BaseEntity
{
    public string AssetType { get; set; } = string.Empty; // Vehicle, Property, Watercraft, etc.
    public string Description { get; set; } = string.Empty;
    public decimal FinanceValue { get; set; }
    public decimal InsuredValue { get; set; }
    public string Status { get; set; } = string.Empty; // Active, Removed, Pending
    public string? SerialNumber { get; set; }
    public string? Identification { get; set; } // VIN, ERF Number, Tail Number, etc.
    
    // JSON field for type-specific data (matching legacy JSON storage)
    public string AssetDataJson { get; set; } = "{}";
    
    // Foreign Keys
    public Guid PolicyId { get; set; }
    
    // Navigation Properties
    public virtual Policy? Policy { get; set; }
}
