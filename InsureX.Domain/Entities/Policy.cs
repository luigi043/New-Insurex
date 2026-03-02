using System;
using System.Collections.Generic;

namespace InsureX.Domain.Entities;

public class Policy
{
    public Guid Id { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public PolicyType Type { get; set; }
    public decimal CoverageAmount { get; set; }
    public decimal Premium { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public PolicyStatus Status { get; set; }
    
    // ADD THESE PROPERTIES
    public bool IsDeleted { get; set; } = false;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    public Guid ClientId { get; set; }
    public User Client { get; set; } = null!;
    public Guid? InsurerId { get; set; }
    public User? Insurer { get; set; }
    
    // ADD THIS
    public User? CreatedByUser { get; set; }
    public Guid? CreatedByUserId { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
    public ICollection<Claim> Claims { get; set; } = new List<Claim>();
    public ICollection<PolicyDocument> Documents { get; set; } = new List<PolicyDocument>();
}

public enum PolicyType
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
    ElectronicEquipment,
    GeneralLiability
}

public enum PolicyStatus
{
    Draft,
    Pending,
    Active,
    Expired,
    Cancelled,
    Suspended
}

// ADD THIS ENUM
public enum PaymentStatus
{
    Pending,
    Partial,
    Paid,
    Overdue,
    Cancelled
}