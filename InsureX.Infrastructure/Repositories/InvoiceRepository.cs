using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class InvoiceRepository : Repository<Invoice>, IInvoiceRepository
{
    public InvoiceRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Invoice?> GetByInvoiceNumberAsync(string invoiceNumber)
    {
        return await _dbSet
            .Include(i => i.Policy)
            .Include(i => i.Partner)
            .Include(i => i.LineItems)
            .Include(i => i.Payments)
            .FirstOrDefaultAsync(i => i.InvoiceNumber == invoiceNumber);
    }

    public async Task<IEnumerable<Invoice>> GetByStatusAsync(InvoiceStatus status)
    {
        return await _dbSet
            .Include(i => i.Policy)
            .Include(i => i.Partner)
            .Where(i => i.Status == status)
            .OrderByDescending(i => i.IssueDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Invoice>> GetByStatusAndTenantAsync(InvoiceStatus status, int tenantId)
    {
        return await _dbSet
            .Include(i => i.Policy)
            .Include(i => i.Partner)
            .Where(i => i.Status == status && i.TenantId == tenantId)
            .OrderByDescending(i => i.IssueDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Invoice>> GetByPolicyIdAsync(int policyId)
    {
        return await _dbSet
            .Include(i => i.Partner)
            .Include(i => i.LineItems)
            .Where(i => i.PolicyId == policyId)
            .OrderByDescending(i => i.IssueDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Invoice>> GetByPartnerIdAsync(int partnerId)
    {
        return await _dbSet
            .Include(i => i.Policy)
            .Include(i => i.LineItems)
            .Where(i => i.PartnerId == partnerId)
            .OrderByDescending(i => i.IssueDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Invoice>> GetOverdueInvoicesAsync(int tenantId)
    {
        var now = DateTime.UtcNow;
        return await _dbSet
            .Include(i => i.Policy)
            .Include(i => i.Partner)
            .Where(i => i.TenantId == tenantId && 
                       i.Status != InvoiceStatus.Paid && 
                       i.Status != InvoiceStatus.Cancelled &&
                       i.DueDate < now)
            .OrderBy(i => i.DueDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Invoice>> GetDueInvoicesAsync(DateTime beforeDate)
    {
        return await _dbSet
            .Include(i => i.Policy)
            .Include(i => i.Partner)
            .Where(i => i.Status != InvoiceStatus.Paid && 
                       i.Status != InvoiceStatus.Cancelled &&
                       i.DueDate <= beforeDate)
            .OrderBy(i => i.DueDate)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalOutstandingAsync(int tenantId)
    {
        return await _dbSet
            .Where(i => i.TenantId == tenantId && 
                       i.Status != InvoiceStatus.Paid && 
                       i.Status != InvoiceStatus.Cancelled &&
                       !i.IsDeleted)
            .SumAsync(i => i.Amount + i.TaxAmount - i.PaidAmount);
    }

    public async Task<decimal> GetTotalPaidAsync(int tenantId)
    {
        return await _dbSet
            .Where(i => i.TenantId == tenantId && i.Status == InvoiceStatus.Paid && !i.IsDeleted)
            .SumAsync(i => i.PaidAmount);
    }

    public override async Task<Invoice?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(i => i.Policy)
            .Include(i => i.Partner)
            .Include(i => i.LineItems)
            .Include(i => i.Payments)
            .Include(i => i.CreatedBy)
            .FirstOrDefaultAsync(i => i.Id == id);
    }
}
