namespace InsureX.Domain.Enums;

public enum AssetType
{
    Vehicle = 0,
    Property = 1,
    Watercraft = 2,
    Aviation = 3,
    StockInventory = 4,
    AccountsReceivable = 5,
    Machinery = 6,
    PlantEquipment = 7,
    BusinessInterruption = 8,
    KeymanInsurance = 9,
    ElectronicEquipment = 10,
    Equipment = 11,
    Inventory = 12,
    Other = 13
}

public enum AssetStatus
{
    Active = 0,
    Inactive = 1,
    UnderMaintenance = 2,
    Disposed = 3,
    Claimed = 4
}
