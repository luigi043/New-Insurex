using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories
{
    public class AssetRepository : IAssetRepository
    {
        private readonly ApplicationDbContext _context;

        public AssetRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Asset?> GetByIdAsync(Guid id)
            => await _context.Assets.FindAsync(id);

        public async Task<IEnumerable<Asset>> GetAllAsync()
            => await _context.Assets.ToListAsync();

        public async Task<IEnumerable<Asset>> GetByPolicyIdAsync(Guid policyId)
            => await _context.Assets.Where(a => a.PolicyId == policyId).ToListAsync();

        public async Task<IEnumerable<Asset>> GetByTypeAsync(AssetType type)
            => await _context.Assets.Where(a => a.Type == type).ToListAsync();

        public async Task<IEnumerable<Asset>> GetByStatusAsync(AssetStatus status)
            => await _context.Assets.Where(a => a.Status == status).ToListAsync();

        public async Task<decimal> GetTotalValueAsync()
            => await _context.Assets.SumAsync(a => a.Value);

        public async Task<Dictionary<AssetType, int>> GetCountByTypeAsync()
            => await _context.Assets
                .GroupBy(a => a.Type)
                .ToDictionaryAsync(g => g.Key, g => g.Count());

        public async Task<Asset> AddAsync(Asset asset)
        {
            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
            return asset;
        }

        public async Task UpdateAsync(Asset asset)
        {
            _context.Assets.Update(asset);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var asset = await GetByIdAsync(id);
            if (asset != null)
            {
                _context.Assets.Remove(asset);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> CountAsync()
            => await _context.Assets.CountAsync();
            public async Task<IEnumerable<Asset>> GetByAcquisitionDateRangeAsync(DateTime from, DateTime to)
        {
            return await _context.Assets
                .Where(a => a.AcquisitionDate >= from && a.AcquisitionDate <= to)
                .ToListAsync();
        }

        public async Task<IEnumerable<Asset>> GetByInspectionDueDateAsync(DateTime beforeDate)
        {
            // This handles the different asset types that have inspection dates
            var vehicles = await _context.Assets
                .OfType<VehicleAsset>()
                .Where(v => v.NextInspectionDue <= beforeDate)
                .ToListAsync();
                
            var aviation = await _context.Assets
                .OfType<AviationAsset>()
                .Where(a => a.NextInspectionDue <= beforeDate)
                .ToListAsync();
            
            return vehicles.Cast<Asset>().Concat(aviation.Cast<Asset>());
        }
    }
    
}
