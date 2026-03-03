using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Application.Interfaces;

public interface IAssetService
{
    Task<IEnumerable<Asset>> GetAllAsync();
    Task<Asset?> GetByIdAsync(int id);
    Task<IEnumerable<Asset>> GetByTypeAsync(AssetType type);
    Task<IEnumerable<Asset>> GetByStatusAsync(AssetStatus status);
    Task<Asset> CreateAsync(Asset asset);
    Task<Asset> UpdateAsync(Asset asset);
    Task DeleteAsync(int id);
    Task<decimal> GetTotalValueAsync();
    Task<IEnumerable<Asset>> GetExpiringWarrantyAsync(DateTime beforeDate);
}
