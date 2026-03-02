
using InsureX.Domain.Entities;
namespace InsureX.Domain.Entities;

public class Partner : BaseEntity
{
    public string CompanyName { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public PartnerType Type { get; set; }
    public PartnerStatus Status { get; set; } = PartnerStatus.Pending;
    
    // Navigation properties
    public ICollection<Policy> Policies { get; set; } = new List<Policy>();
}

public enum PartnerType
{
    Financer,
    Insurer,
    Broker
}

public enum PartnerStatus
{
    Pending,
    Active,
    Suspended,
    Rejected
}