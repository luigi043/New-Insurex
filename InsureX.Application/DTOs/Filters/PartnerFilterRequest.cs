using InsureX.Application.DTOs;

namespace InsureX.Application.DTOs.Filters;

public class PartnerFilterRequest : PaginationRequest
{
    public string? Type { get; set; }
    public string? Status { get; set; }
}
