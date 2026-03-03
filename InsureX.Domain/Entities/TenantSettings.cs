namespace InsureX.Domain.Entities;

public class TenantSettings : BaseEntity
{
    public int TenantId { get; set; }
    public string SettingKey { get; set; } = string.Empty;
    public string SettingValue { get; set; } = string.Empty;
<<<<<<< HEAD
    public string? SettingType { get; set; } // String, Number, Boolean, JSON
    public string? Category { get; set; } // General, Billing, Notifications, Security, etc.
    public string? Description { get; set; }
    public bool IsEncrypted { get; set; } = false;
=======
    public string? Description { get; set; }
    public string Category { get; set; } = "General";
    public bool IsEncrypted { get; set; }
>>>>>>> main

    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
}

<<<<<<< HEAD
public class TenantOnboarding : BaseEntity
{
    public int TenantId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string ContactPersonName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public string? TaxId { get; set; }
    public string? RegistrationNumber { get; set; }
    public string? Industry { get; set; }
    public int? EmployeeCount { get; set; }
    public string OnboardingStatus { get; set; } = "Pending"; // Pending, InProgress, Completed, Failed
    public DateTime? CompletedAt { get; set; }
    public string? Notes { get; set; }
    public string? SubscriptionPlan { get; set; }
    public DateTime? TrialExpiryDate { get; set; }

    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
=======
public class TenantOnboardingRequest
{
    public string TenantName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ContactEmail { get; set; } = string.Empty;
    public string? ContactPhone { get; set; }
    public string? Address { get; set; }
    public string? TaxId { get; set; }
    public string? RegistrationNumber { get; set; }
    public string AdminEmail { get; set; } = string.Empty;
    public string AdminFirstName { get; set; } = string.Empty;
    public string AdminLastName { get; set; } = string.Empty;
    public string AdminPassword { get; set; } = string.Empty;
    public Dictionary<string, string>? InitialSettings { get; set; }
>>>>>>> main
}
