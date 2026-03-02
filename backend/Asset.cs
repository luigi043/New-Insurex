using System;
using System.Text.Json;

namespace InsureX.Domain.Entities
{
    public class Asset
    {
        public int Id { get; set; }
        public int PolicyId { get; set; }
        public Policy Policy { get; set; } = null!;

        public AssetType AssetType { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal InsuredValue { get; set; }

        // Flexible extra fields stored as JSON per asset type
        public string? ExtendedDataJson { get; set; }

        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public enum AssetType
    {
        Vehicle = 1,
        Property = 2,
        Watercraft = 3,
        Aviation = 4,
        StockInventory = 5,
        AccountsReceivable = 6,
        Machinery = 7,
        PlantEquipment = 8,
        BusinessInterruption = 9,
        KeymanInsurance = 10,
        ElectronicEquipment = 11
    }

    // ── Per-asset extended data DTOs ─────────────────────────────────────────

    public class VehicleData
    {
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string RegistrationNumber { get; set; } = string.Empty;
        public string VinNumber { get; set; } = string.Empty;
        public string EngineNumber { get; set; } = string.Empty;
        public string Colour { get; set; } = string.Empty;
        public string BodyType { get; set; } = string.Empty;
        public int Mileage { get; set; }
        public bool HasTracker { get; set; }
        public string StorageLocation { get; set; } = string.Empty;
    }

    public class PropertyData
    {
        public string StreetAddress { get; set; } = string.Empty;
        public string Suburb { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string PropertyType { get; set; } = string.Empty; // Residential/Commercial/Industrial
        public int ConstructionYear { get; set; }
        public string RoofType { get; set; } = string.Empty;
        public string WallConstruction { get; set; } = string.Empty;
        public double FloorArea { get; set; }
        public bool HasAlarm { get; set; }
        public bool HasElectricFence { get; set; }
        public bool HasGuardedComplex { get; set; }
    }

    public class WatercraftData
    {
        public string VesselName { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public double LengthMetres { get; set; }
        public string EngineType { get; set; } = string.Empty;
        public int HorsePower { get; set; }
        public string MooringLocation { get; set; } = string.Empty;
        public bool IsOceanGoing { get; set; }
    }

    public class AviationData
    {
        public string AircraftRegistration { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string SerialNumber { get; set; } = string.Empty;
        public string HomeBase { get; set; } = string.Empty;
        public int TotalFlightHours { get; set; }
        public bool IsCommercial { get; set; }
        public string PilotLicenceNumber { get; set; } = string.Empty;
    }

    public class StockInventoryData
    {
        public string StockDescription { get; set; } = string.Empty;
        public string StorageAddress { get; set; } = string.Empty;
        public bool IsRefrigerated { get; set; }
        public bool HasSprinklerSystem { get; set; }
        public string SecurityMeasures { get; set; } = string.Empty;
        public decimal MaxStockValue { get; set; }
    }

    public class AccountsReceivableData
    {
        public string BusinessName { get; set; } = string.Empty;
        public string DebtorsBookDescription { get; set; } = string.Empty;
        public decimal AverageMonthlyDebtors { get; set; }
        public int AverageDebtorDays { get; set; }
        public bool OffSiteBackup { get; set; }
    }

    public class MachineryData
    {
        public string MachineryDescription { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int YearOfManufacture { get; set; }
        public string SerialNumber { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string MaintenanceFrequency { get; set; } = string.Empty;
    }

    public class PlantEquipmentData
    {
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public bool IsPortable { get; set; }
        public bool IsStationary { get; set; }
        public int YearOfManufacture { get; set; }
        public string LastServiceDate { get; set; } = string.Empty;
    }

    public class BusinessInterruptionData
    {
        public string BusinessName { get; set; } = string.Empty;
        public string BusinessType { get; set; } = string.Empty;
        public decimal AnnualTurnover { get; set; }
        public decimal AnnualGrossProfit { get; set; }
        public int IndemnityPeriodMonths { get; set; }
        public bool IncludesWagesProtection { get; set; }
    }

    public class KeymanData
    {
        public string KeymanName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string IDNumber { get; set; } = string.Empty;
        public decimal AnnualSalary { get; set; }
        public string CoverReason { get; set; } = string.Empty;
        public decimal CoverAmount { get; set; }
    }

    public class ElectronicEquipmentData
    {
        public string Description { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public int YearOfPurchase { get; set; }
        public decimal PurchasePrice { get; set; }
        public string Location { get; set; } = string.Empty;
        public bool IsPortable { get; set; }
        public bool HasWarranty { get; set; }
    }
}
