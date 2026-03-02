
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
    public DateTime? ContractStartDate { get; set; }
    public DateTime? ContractEndDate { get; set; }
    public DateTime? LastReviewDate { get; set; }
    public DateTime? NextReviewDate { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? ApprovedBy { get; set; }
    public DateTime? SuspendedAt { get; set; }
    public string? SuspendedReason { get; set; }
    
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