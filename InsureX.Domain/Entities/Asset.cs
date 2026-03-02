using System;

namespace InsureX.Domain.Entities;

public abstract class Asset
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Value { get; set; }
    
    // ADD THIS PROPERTY
    public decimal InsuredValue { get; set; }  // ADD THIS
    
    public AssetStatus Status { get; set; }
    public AssetType Type { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime AcquisitionDate { get; set; }
    
    // ADD THIS
    public bool IsDeleted { get; set; } = false;
    
    public Guid PolicyId { get; set; }
    public Policy Policy { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public enum AssetStatus
{
    Active,
    Inactive,
    UnderMaintenance,
    Disposed,
    Claimed
}

public enum AssetType
{
    Vehicle,
    Property,
    Watercraft,
    Aviation,
    StockInventory,
    AccountsReceivable,
    Machinery,
    PlantEquipment,
    BusinessInterruption,
    KeymanInsurance,
    ElectronicEquipment
}