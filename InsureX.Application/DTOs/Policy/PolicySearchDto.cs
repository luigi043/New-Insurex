namespace InsureX.Application.DTOs.Policy;

public class PolicySearchDto
{
    public string? SearchTerm { get; set; }
    public string? Status { get; set; }
    public DateTime? StartDateFrom { get; set; }
    public DateTime? StartDateTo { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
