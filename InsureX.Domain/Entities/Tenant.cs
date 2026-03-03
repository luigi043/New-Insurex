namespace InsureX.Domain.Entities;

public class Tenant : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? PrimaryColor { get; set; }
    public string? SecondaryColor { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public string? Address { get; set; }
    public string? TaxId { get; set; }
    public string? RegistrationNumber { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? SubscriptionExpiryDate { get; set; }
    
    // Navigation properties
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Policy> Policies { get; set; } = new List<Policy>();
    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
    public ICollection<Claim> Claims { get; set; } = new List<Claim>();
    public ICollection<Partner> Partners { get; set; } = new List<Partner>();
    public ICollection<TenantSettings> Settings { get; set; } = new List<TenantSettings>();
}
