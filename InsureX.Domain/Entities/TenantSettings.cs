namespace InsureX.Domain.Entities;

public class TenantSettings : BaseEntity
{
    public int TenantId { get; set; }
    public string SettingKey { get; set; } = string.Empty;
    public string SettingValue { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = "General";
    public bool IsEncrypted { get; set; }

    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
}

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
}
