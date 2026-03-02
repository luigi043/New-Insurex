namespace InsureX.Application.DTOs.Policy;

public class CreatePolicyDto
{
    public string PolicyNumber { get; set; } = string.Empty;
    public string PolicyType { get; set; } = string.Empty;
    public decimal Premium { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TenantId { get; set; }
    public int? AssetId { get; set; }
    public int? PartnerId { get; set; }
}
