using InsureX.Application.DTOs;

namespace InsureX.Application.DTOs.Filters;

public class PolicyFilterRequest : PaginationRequest
{
    public string? Status { get; set; }
    public string? PolicyType { get; set; }
    public int? InsuredId { get; set; }
    public int? BrokerId { get; set; }
    public DateTime? FromStartDate { get; set; }
    public DateTime? ToEndDate { get; set; }
    public decimal? MinPremium { get; set; }
    public decimal? MaxPremium { get; set; }
}
