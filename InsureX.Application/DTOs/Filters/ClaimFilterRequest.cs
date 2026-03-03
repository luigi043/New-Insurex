using InsureX.Application.DTOs;

namespace InsureX.Application.DTOs.Filters;

public class ClaimFilterRequest : PaginationRequest
{
    public int? PolicyId { get; set; }
    public string? Status { get; set; }
    public string? ClaimType { get; set; }
    public DateTime? FromIncidentDate { get; set; }
    public DateTime? ToIncidentDate { get; set; }
    public decimal? MinAmount { get; set; }
    public decimal? MaxAmount { get; set; }
}
