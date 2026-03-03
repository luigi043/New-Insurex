using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Domain.Interfaces;

public interface IInvoiceRepository : IRepository<Invoice>
{
    Task<Invoice?> GetByInvoiceNumberAsync(string invoiceNumber);
    Task<IEnumerable<Invoice>> GetByStatusAsync(InvoiceStatus status);
    Task<IEnumerable<Invoice>> GetByStatusAndTenantAsync(InvoiceStatus status, int tenantId);
    Task<IEnumerable<Invoice>> GetByPolicyIdAsync(int policyId);
    Task<IEnumerable<Invoice>> GetByPartnerIdAsync(int partnerId);
    Task<IEnumerable<Invoice>> GetOverdueInvoicesAsync(int tenantId);
    Task<IEnumerable<Invoice>> GetDueInvoicesAsync(DateTime beforeDate);
    Task<decimal> GetTotalOutstandingAsync(int tenantId);
    Task<decimal> GetTotalPaidAsync(int tenantId);
}
