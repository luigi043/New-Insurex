using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class PolicyRepository : Repository<Policy>, IPolicyRepository
{
    public PolicyRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Policy?> GetByPolicyNumberAsync(string policyNumber)
    {
        return await _dbSet
            .Include(p => p.Insured)
            .Include(p => p.Broker)
            .Include(p => p.Underwriter)
            .Include(p => p.PolicyAssets)
            .ThenInclude(pa => pa.Asset)
            .FirstOrDefaultAsync(p => p.PolicyNumber == policyNumber);
    }

    public async Task<IEnumerable<Policy>> GetByStatusAsync(PolicyStatus status)
    {
        return await _dbSet
            .Include(p => p.Insured)
            .Where(p => p.Status == status)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Policy>> GetByStatusAndTenantAsync(PolicyStatus status, int tenantId)
    {
        return await _dbSet
            .Include(p => p.Insured)
            .Include(p => p.Broker)
            .Where(p => p.Status == status && p.TenantId == tenantId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Policy>> GetByTypeAsync(PolicyType type)
    {
        return await _dbSet
            .Include(p => p.Insured)
            .Where(p => p.Type == type)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Policy>> GetExpiringPoliciesAsync(DateTime from, DateTime to)
    {
        return await _dbSet
            .Include(p => p.Insured)
            .Where(p => p.EndDate >= from && p.EndDate <= to && p.Status == PolicyStatus.Active)
            .OrderBy(p => p.EndDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Policy>> GetByInsuredIdAsync(int insuredId)
    {
        return await _dbSet
            .Include(p => p.Insured)
            .Where(p => p.InsuredId == insuredId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Policy>> GetByBrokerIdAsync(int brokerId)
    {
        return await _dbSet
            .Include(p => p.Broker)
            .Where(p => p.BrokerId == brokerId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalPremiumAsync(int tenantId)
    {
        return await _dbSet
            .Where(p => p.TenantId == tenantId && p.Status == PolicyStatus.Active && !p.IsDeleted)
            .SumAsync(p => p.PremiumAmount);
    }

    public async Task<decimal> GetTotalCoverageAsync(int tenantId)
    {
        return await _dbSet
            .Where(p => p.TenantId == tenantId && p.Status == PolicyStatus.Active && !p.IsDeleted)
            .SumAsync(p => p.CoverageAmount);
    }

    public async Task<int> GetActivePolicyCountAsync(int tenantId)
    {
        return await _dbSet
            .CountAsync(p => p.TenantId == tenantId && p.Status == PolicyStatus.Active && !p.IsDeleted);
    }

    public override async Task<Policy?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Insured)
            .Include(p => p.Broker)
            .Include(p => p.Underwriter)
            .Include(p => p.ApprovedBy)
            .Include(p => p.PolicyAssets)
            .ThenInclude(pa => pa.Asset)
            .Include(p => p.Claims)
            .Include(p => p.Invoices)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
}
