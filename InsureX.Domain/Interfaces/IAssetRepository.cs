using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Domain.Interfaces;

public interface IAssetRepository : IRepository<Asset>
{
    Task<IEnumerable<Asset>> GetByTypeAsync(AssetType type);
    Task<IEnumerable<Asset>> GetByTypeAndTenantAsync(AssetType type, int tenantId);
    Task<IEnumerable<Asset>> GetByStatusAsync(AssetStatus status);
    Task<IEnumerable<Asset>> GetByPolicyIdAsync(int policyId);
    Task<Asset?> GetBySerialNumberAsync(string serialNumber);
    Task<decimal> GetTotalValueByTenantAsync(int tenantId);
    Task<IEnumerable<Asset>> GetExpiringWarrantyAsync(DateTime beforeDate);
}
