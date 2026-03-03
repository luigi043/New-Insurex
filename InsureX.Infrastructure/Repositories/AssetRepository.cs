using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class AssetRepository : Repository<Asset>, IAssetRepository
{
    public AssetRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Asset>> GetByTypeAsync(AssetType type)
    {
        return await _dbSet
            .Where(a => a.Type == type)
            .OrderBy(a => a.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Asset>> GetByTypeAndTenantAsync(AssetType type, int tenantId)
    {
        return await _dbSet
            .Where(a => a.Type == type && a.TenantId == tenantId)
            .OrderBy(a => a.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Asset>> GetByStatusAsync(AssetStatus status)
    {
        return await _dbSet
            .Where(a => a.Status == status)
            .OrderBy(a => a.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Asset>> GetByPolicyIdAsync(int policyId)
    {
        return await _dbSet
            .Include(a => a.PolicyAssets)
            .Where(a => a.PolicyAssets.Any(pa => pa.PolicyId == policyId))
            .OrderBy(a => a.Name)
            .ToListAsync();
    }

    public async Task<Asset?> GetBySerialNumberAsync(string serialNumber)
    {
        return await _dbSet
            .FirstOrDefaultAsync(a => a.SerialNumber == serialNumber);
    }

    public async Task<decimal> GetTotalValueByTenantAsync(int tenantId)
    {
        return await _dbSet
            .Where(a => a.TenantId == tenantId && a.Status == AssetStatus.Active && !a.IsDeleted)
            .SumAsync(a => a.Value);
    }

    public async Task<IEnumerable<Asset>> GetExpiringWarrantyAsync(DateTime beforeDate)
    {
        return await _dbSet
            .Where(a => a.WarrantyExpiryDate.HasValue && 
                       a.WarrantyExpiryDate <= beforeDate &&
                       a.WarrantyExpiryDate >= DateTime.UtcNow)
            .OrderBy(a => a.WarrantyExpiryDate)
            .ToListAsync();
    }

    public override async Task<Asset?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(a => a.PolicyAssets)
            .ThenInclude(pa => pa.Policy)
            .Include(a => a.Claims)
            .FirstOrDefaultAsync(a => a.Id == id);
    }
}
