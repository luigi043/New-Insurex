using InsureX.Application.DTOs;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Application.Interfaces;

public interface IInvoiceService
{
    Task<PagedResult<Invoice>> GetAllAsync(PaginationRequest request);
    Task<Invoice?> GetByIdAsync(int id);
    Task<Invoice?> GetByInvoiceNumberAsync(string invoiceNumber);
    Task<IEnumerable<Invoice>> GetByStatusAsync(InvoiceStatus status);
    Task<PagedResult<Invoice>> GetByPolicyIdAsync(int policyId, PaginationRequest request);
    Task<PagedResult<Invoice>> GetOverdueInvoicesAsync(PaginationRequest request);
    Task<PagedResult<Invoice>> FilterAsync(InvoiceFilterRequest request);
    Task<Invoice> CreateAsync(Invoice invoice);
    Task<Invoice> UpdateAsync(Invoice invoice);
    Task DeleteAsync(int id);
    Task<Invoice> MarkAsSentAsync(int invoiceId, string sentToEmail);
    Task<Invoice> RecordPaymentAsync(int invoiceId, decimal amount, PaymentMethod method, string? reference = null);
    Task<Invoice> CancelAsync(int invoiceId, string reason);
    Task<decimal> GetTotalOutstandingAsync();
    Task<decimal> GetTotalPaidAsync();
}
