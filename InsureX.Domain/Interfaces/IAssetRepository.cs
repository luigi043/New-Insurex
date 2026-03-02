using InsureX.Domain.Entities;

namespace InsureX.Domain.Interfaces
{
    public interface IAssetRepository
    {
        Task<Asset?> GetByIdAsync(Guid id);
        Task<IEnumerable<Asset>> GetAllAsync();
        Task<IEnumerable<Asset>> GetByPolicyIdAsync(Guid policyId);
        Task<IEnumerable<Asset>> GetByTypeAsync(AssetType type);
        Task<IEnumerable<Asset>> GetByStatusAsync(AssetStatus status);
        Task<Asset> AddAsync(Asset asset);
        Task UpdateAsync(Asset asset);
        Task DeleteAsync(Guid id);
        Task<int> CountAsync();
        Task<decimal> GetTotalValueAsync();
        Task<IEnumerable<Asset>> GetByAcquisitionDateRangeAsync(DateTime from, DateTime to);
        Task<IEnumerable<Asset>> GetByInspectionDueDateAsync(DateTime beforeDate);
        Task<IEnumerable<Asset>> GetRecentlyUpdatedAsync(DateTime since);
        Task<Dictionary<AssetType, int>> GetCountByTypeAsync();
    }
}