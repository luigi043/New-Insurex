using InsureX.Application.DTOs;

namespace InsureX.Application.DTOs.Filters;

public class InvoiceFilterRequest : PaginationRequest
{
    public string? Status { get; set; }
    public int? PolicyId { get; set; }
    public int? PartnerId { get; set; }
    public bool? IsOverdue { get; set; }
    public DateTime? FromDueDate { get; set; }
    public DateTime? ToDueDate { get; set; }
}
