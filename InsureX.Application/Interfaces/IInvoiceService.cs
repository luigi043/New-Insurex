using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Application.Interfaces;

public interface IInvoiceService
{
    Task<IEnumerable<Invoice>> GetAllAsync();
    Task<Invoice?> GetByIdAsync(int id);
    Task<Invoice?> GetByInvoiceNumberAsync(string invoiceNumber);
    Task<IEnumerable<Invoice>> GetByStatusAsync(InvoiceStatus status);
    Task<IEnumerable<Invoice>> GetByPolicyIdAsync(int policyId);
    Task<IEnumerable<Invoice>> GetOverdueInvoicesAsync();
    Task<Invoice> CreateAsync(Invoice invoice);
    Task<Invoice> UpdateAsync(Invoice invoice);
    Task DeleteAsync(int id);
    Task<Invoice> MarkAsSentAsync(int invoiceId, string sentToEmail);
    Task<Invoice> RecordPaymentAsync(int invoiceId, decimal amount, PaymentMethod method, string? reference = null);
    Task<Invoice> CancelAsync(int invoiceId, string reason);
    Task<decimal> GetTotalOutstandingAsync();
    Task<decimal> GetTotalPaidAsync();
}
