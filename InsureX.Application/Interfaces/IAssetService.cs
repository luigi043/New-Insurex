using InsureX.Domain.Entities;
namespace InsureX.Application.Interfaces;
public interface IAssetService {
    Task<Asset?> GetByIdAsync(int id); Task<IEnumerable<Asset>> GetAllAsync();
    Task<IEnumerable<Asset>> GetByTenantIdAsync(int tenantId); Task<IEnumerable<Asset>> GetByTypeAsync(string assetType);
    Task<Asset> CreateAsync(Asset asset); Task<Asset> UpdateAsync(Asset asset); Task<bool> DeleteAsync(int id);
    Task<decimal> GetTotalValueAsync(int tenantId);
}
