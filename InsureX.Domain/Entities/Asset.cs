namespace InsureX.Domain.Entities
{
    public abstract class Asset : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public AssetStatus Status { get; set; } = AssetStatus.Active;
        public Guid PolicyId { get; set; }
        public Policy Policy { get; set; } = null!;
        public AssetType Type { get; set; }
        public new string Location { get; set; } = string.Empty;
        public DateTime AcquisitionDate { get; set; }
        public string? InsuranceCertificateNumber { get; set; }
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

    // Vehicle Asset
    public class VehicleAsset : Asset
    {
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string RegistrationNumber { get; set; } = string.Empty;
        public string VinNumber { get; set; } = string.Empty;
        public string EngineNumber { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public int Mileage { get; set; }
        public VehicleType VehicleType { get; set; }
        public FuelType FuelType { get; set; }
        public string? ParkingLocation { get; set; }
        public bool IsCommercial { get; set; }
        public string? DriverLicenseRequired { get; set; }
    }

    public enum VehicleType
    {
        Car,
        Truck,
        Motorcycle,
        Bus,
        Van,
        Trailer,
        Other
    }

    public enum FuelType
    {
        Petrol,
        Diesel,
        Electric,
        Hybrid,
        LPG,
        Other
    }

    // Property Asset
    public class PropertyAsset : Asset
    {
        public PropertyType PropertyType { get; set; }
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public decimal SquareFeet { get; set; }
        public int YearBuilt { get; set; }
        public int NumberOfFloors { get; set; }
        public ConstructionType ConstructionType { get; set; }
        public string? RoofType { get; set; }
        public bool HasSecuritySystem { get; set; }
        public bool HasFireAlarm { get; set; }
        public bool HasSprinklerSystem { get; set; }
        public string? TenantInfo { get; set; }
        public PropertyUseType UseType { get; set; }
    }

    public enum PropertyType
    {
        Residential,
        Commercial,
        Industrial,
        Agricultural,
        MixedUse
    }

    public enum ConstructionType
    {
        WoodFrame,
        SteelFrame,
        Concrete,
        Brick,
        Stone,
        Other
    }

    public enum PropertyUseType
    {
        OwnerOccupied,
        Rental,
        Vacant,
        UnderConstruction,
        Seasonal
    }

    // Watercraft Asset
    public class WatercraftAsset : Asset
    {
        public string VesselName { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public string HullNumber { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public decimal Length { get; set; }
        public WatercraftType WatercraftType { get; set; }
        public string HomePort { get; set; } = string.Empty;
        public string? MooringLocation { get; set; }
        public int PassengerCapacity { get; set; }
        public string? EngineType { get; set; }
        public decimal? MaxSpeed { get; set; }
        public string? NavigationArea { get; set; }
        public bool IsChartered { get; set; }
        public string? CharterCompany { get; set; }
    }

    public enum WatercraftType
    {
        Yacht,
        Sailboat,
        Motorboat,
        FishingVessel,
        JetSki,
        CommercialVessel,
        Other
    }

    // Aviation Asset
    public class AviationAsset : Asset
    {
        public string AircraftRegistration { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public int TotalFlightHours { get; set; }
        public string? EngineType { get; set; }
        public int PassengerCapacity { get; set; }
        public string? HomeAirport { get; set; }
        public string? HangarLocation { get; set; }
        public string? PilotLicenseType { get; set; }
        public string? UsageType { get; set; }
        public bool IsCommercial { get; set; }
        public DateTime LastInspectionDate { get; set; }
        public DateTime NextInspectionDue { get; set; }
    }

    // Stock/Inventory Asset
    public class StockInventoryAsset : Asset
    {
        public string InventoryType { get; set; } = string.Empty;
        public string StorageLocation { get; set; } = string.Empty;
        public decimal TotalValue { get; set; }
        public string? SupplierInfo { get; set; }
        public int ReorderLevel { get; set; }
        public string? InventoryTurnover { get; set; }
        public bool IsPerishable { get; set; }
        public bool RequiresRefrigeration { get; set; }
        public string? SecurityMeasures { get; set; }
        public DateTime LastInventoryDate { get; set; }
    }

    // Accounts Receivable Asset
    public class AccountsReceivableAsset : Asset
    {
        public string DebtorName { get; set; } = string.Empty;
        public string? DebtorAddress { get; set; }
        public decimal OutstandingAmount { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public int DaysOutstanding { get; set; }
        public string? CreditTerms { get; set; }
        public string? IndustrySector { get; set; }
        public string? PaymentHistory { get; set; }
        public decimal? CreditLimit { get; set; }
        public bool IsSecured { get; set; }
        public string? CollateralDetails { get; set; }
    }

    // Machinery Asset
    public class MachineryAsset : Asset
    {
        public string MachineType { get; set; } = string.Empty;
        public string Manufacturer { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public int YearOfManufacture { get; set; }
        public new string Location { get; set; } = string.Empty;
        public string? TechnicalSpecs { get; set; }
        public string? MaintenanceSchedule { get; set; }
        public DateTime LastMaintenanceDate { get; set; }
        public string? OperatorRequirements { get; set; }
        public decimal? ReplacementCost { get; set; }
        public bool IsLeased { get; set; }
        public string? LessorInfo { get; set; }
    }

    // Plant & Equipment Asset
    public class PlantEquipmentAsset : Asset
    {
        public string EquipmentType { get; set; } = string.Empty;
        public string Manufacturer { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public int YearOfManufacture { get; set; }
        public string InstallationLocation { get; set; } = string.Empty;
        public decimal? Capacity { get; set; }
        public string? PowerRequirements { get; set; }
        public string? MaintenanceContract { get; set; }
        public DateTime InstallationDate { get; set; }
        public string? SafetyCertifications { get; set; }
        public decimal? DepreciationRate { get; set; }
    }

    // Business Interruption Asset
    public class BusinessInterruptionAsset : Asset
    {
        public string BusinessType { get; set; } = string.Empty;
        public string? BusinessLocation { get; set; }
        public decimal AnnualRevenue { get; set; }
        public decimal FixedCosts { get; set; }
        public decimal VariableCosts { get; set; }
        public int IndemnityPeriod { get; set; }
        public string? KeySuppliers { get; set; }
        public string? KeyCustomers { get; set; }
        public string? BackupFacilities { get; set; }
        public decimal? GrossProfit { get; set; }
        public string? BusinessContinuityPlan { get; set; }
    }

    // Keyman Insurance Asset
    public class KeymanInsuranceAsset : Asset
    {
        public string KeyPersonName { get; set; } = string.Empty;
        public string? KeyPersonRole { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? HealthStatus { get; set; }
        public decimal AnnualSalary { get; set; }
        public string? SkillsExpertise { get; set; }
        public string? ReplacementCost { get; set; }
        public string? YearsOfService { get; set; }
        public string? SuccessionPlan { get; set; }
        public decimal? ContributionToProfit { get; set; }
        public string? NonCompeteAgreement { get; set; }
    }

    // Electronic Equipment Asset
    public class ElectronicEquipmentAsset : Asset
    {
        public string EquipmentType { get; set; } = string.Empty;
        public string Manufacturer { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public int YearOfPurchase { get; set; }
        public new string Location { get; set; } = string.Empty;
        public string? TechnicalSpecifications { get; set; }
        public bool IsPortable { get; set; }
        public string? SoftwareLicenses { get; set; }
        public string? MaintenanceContract { get; set; }
        public string? DataBackupProcedure { get; set; }
        public decimal? ReplacementCost { get; set; }
        public string? PowerBackup { get; set; }
    }
}