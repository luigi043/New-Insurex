using System;

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
