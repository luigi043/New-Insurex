namespace InsureX.Application.DTOs;

public class PaginationRequest
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = false;
    public string? SearchTerm { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;
}

public class FilterRequest
{
    public string? Status { get; set; }
    public string? Type { get; set; }
    public int? PolicyId { get; set; }
    public int? PartnerId { get; set; }
    public int? AssetId { get; set; }
    public decimal? MinAmount { get; set; }
    public decimal? MaxAmount { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

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

public class AssetFilterRequest : PaginationRequest
{
    public string? Type { get; set; }
    public string? Status { get; set; }
    public decimal? MinValue { get; set; }
    public decimal? MaxValue { get; set; }
    public DateTime? WarrantyExpiringBefore { get; set; }
}

public class PartnerFilterRequest : PaginationRequest
{
    public string? Type { get; set; }
    public string? Status { get; set; }
}

public class InvoiceFilterRequest : PaginationRequest
{
    public string? Status { get; set; }
    public int? PolicyId { get; set; }
    public int? PartnerId { get; set; }
    public bool? IsOverdue { get; set; }
    public DateTime? FromDueDate { get; set; }
    public DateTime? ToDueDate { get; set; }
}
