using InsureX.Domain.Enums;

namespace InsureX.Domain.Entities;

public class Partner : BaseEntity
{
    public int TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? TradingName { get; set; }
    public PartnerType Type { get; set; }
    public PartnerStatus Status { get; set; } = PartnerStatus.Active;
    public string? RegistrationNumber { get; set; }
    public string? TaxId { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Mobile { get; set; }
    public string? Fax { get; set; }
    public string? Website { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    public string? ContactPersonName { get; set; }
    public string? ContactPersonEmail { get; set; }
    public string? ContactPersonPhone { get; set; }
    public string? ContactPersonTitle { get; set; }
    public string? BankName { get; set; }
    public string? BankAccountNumber { get; set; }
    public string? BankBranchCode { get; set; }
    public string? SwiftCode { get; set; }
    public string? IBAN { get; set; }
    public decimal? CommissionRate { get; set; }
    public string? Notes { get; set; }
    public string? Documents { get; set; } // JSON array of document URLs
    public DateTime? ContractStartDate { get; set; }
    public DateTime? ContractEndDate { get; set; }
    
    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public ICollection<Policy> PoliciesAsInsured { get; set; } = new List<Policy>();
    public ICollection<Policy> PoliciesAsBroker { get; set; } = new List<Policy>();
}
