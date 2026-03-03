using InsureX.Application.DTOs;

namespace InsureX.Application.DTOs.Filters;

public class AssetFilterRequest : PaginationRequest
{
    public string? Type { get; set; }
    public string? Status { get; set; }
    public decimal? MinValue { get; set; }
    public decimal? MaxValue { get; set; }
    public DateTime? WarrantyExpiringBefore { get; set; }
}
