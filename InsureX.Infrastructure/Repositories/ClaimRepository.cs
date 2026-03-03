using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class ClaimRepository : Repository<Claim>, IClaimRepository
{
    public ClaimRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Claim?> GetByClaimNumberAsync(string claimNumber)
    {
        return await _dbSet
            .Include(c => c.Policy)
            .Include(c => c.Asset)
            .Include(c => c.StatusHistory)
            .FirstOrDefaultAsync(c => c.ClaimNumber == claimNumber);
    }

    public async Task<IEnumerable<Claim>> GetByPolicyIdAsync(int policyId)
    {
        return await _dbSet
            .Include(c => c.Policy)
            .Include(c => c.Asset)
            .Where(c => c.PolicyId == policyId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Claim>> GetByStatusAsync(ClaimStatus status)
    {
        return await _dbSet
            .Include(c => c.Policy)
            .Where(c => c.Status == status)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Claim>> GetByStatusAndTenantAsync(ClaimStatus status, int tenantId)
    {
        return await _dbSet
            .Include(c => c.Policy)
            .Include(c => c.Asset)
            .Where(c => c.Status == status && c.TenantId == tenantId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Claim>> GetByDateRangeAsync(DateTime from, DateTime to)
    {
        return await _dbSet
            .Include(c => c.Policy)
            .Where(c => c.IncidentDate >= from && c.IncidentDate <= to)
            .OrderByDescending(c => c.IncidentDate)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalClaimedAmountAsync(int tenantId)
    {
        return await _dbSet
            .Where(c => c.TenantId == tenantId && !c.IsDeleted)
            .SumAsync(c => c.ClaimedAmount);
    }

    public async Task<decimal> GetTotalPaidAmountAsync(int tenantId)
    {
        return await _dbSet
            .Where(c => c.TenantId == tenantId && c.Status == ClaimStatus.Paid && !c.IsDeleted)
            .SumAsync(c => c.ApprovedAmount ?? 0);
    }

    public async Task<IEnumerable<Claim>> GetPendingClaimsAsync(int tenantId)
    {
        return await _dbSet
            .Include(c => c.Policy)
            .Include(c => c.Asset)
            .Where(c => c.TenantId == tenantId && 
                       (c.Status == ClaimStatus.Submitted || c.Status == ClaimStatus.UnderReview))
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Claim>> GetClaimsByAssetIdAsync(int assetId)
    {
        return await _dbSet
            .Include(c => c.Policy)
            .Where(c => c.AssetId == assetId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public override async Task<Claim?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(c => c.Policy)
            .Include(c => c.Asset)
            .Include(c => c.StatusHistory)
            .FirstOrDefaultAsync(c => c.Id == id);
    }
}
