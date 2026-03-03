using InsureX.Domain.Enums;

namespace InsureX.Domain.Entities;

public class Asset : BaseEntity
{
    public int TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public AssetType Type { get; set; }
    public decimal Value { get; set; }
    public string? Location { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public string? SerialNumber { get; set; }
    public AssetStatus Status { get; set; } = AssetStatus.Active;
    public string? Manufacturer { get; set; }
    public string? Model { get; set; }
    public int? Year { get; set; }
    public string? RegistrationNumber { get; set; }
    public string? VIN { get; set; } // For vehicles
    public string? IMEI { get; set; } // For electronic equipment
    public decimal? DepreciationRate { get; set; }
    public DateTime? WarrantyExpiryDate { get; set; }
    public string? InsuranceReference { get; set; }
    public string? Notes { get; set; }
    
    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public ICollection<PolicyAsset> PolicyAssets { get; set; } = new List<PolicyAsset>();
    public ICollection<Claim> Claims { get; set; } = new List<Claim>();
}

// Join entity for many-to-many relationship
public class PolicyAsset
{
    public int PolicyId { get; set; }
    public Policy Policy { get; set; } = null!;
    public int AssetId { get; set; }
    public Asset Asset { get; set; } = null!;
    public decimal InsuredValue { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
