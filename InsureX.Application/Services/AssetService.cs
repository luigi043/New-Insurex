using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;

namespace InsureX.Application.Services;

public class AssetService : IAssetService
{
    private readonly IAssetRepository _assetRepository;
    private readonly ITenantContext _tenantContext;

    public AssetService(IAssetRepository assetRepository, ITenantContext tenantContext)
    {
        _assetRepository = assetRepository;
        _tenantContext = tenantContext;
    }

    public async Task<Asset?> GetByIdAsync(int id)
    {
        return await _assetRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Asset>> GetAllAsync()
    {
        return await _assetRepository.GetAllAsync();
    }

    public async Task<IEnumerable<Asset>> GetByTenantIdAsync(int tenantId)
    {
        return await _assetRepository.GetByTenantIdAsync(tenantId);
    }

    public async Task<IEnumerable<Asset>> GetByTypeAsync(string assetType)
    {
        return await _assetRepository.GetByTypeAsync(assetType);
    }

    public async Task<Asset> CreateAsync(Asset asset)
    {
        asset.TenantId = _tenantContext.CurrentTenantId;
        asset.CreatedAt = DateTime.UtcNow;
        return await _assetRepository.AddAsync(asset);
    }

    public async Task<Asset> UpdateAsync(Asset asset)
    {
        asset.UpdatedAt = DateTime.UtcNow;
        return await _assetRepository.UpdateAsync(asset);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _assetRepository.DeleteAsync(id);
    }

    public async Task<decimal> GetTotalValueAsync(int tenantId)
    {
        return await _assetRepository.GetTotalValueByTenantAsync(tenantId);
    }

    // Additional method needed for the controller
    public async Task<PagedResult<Asset>> GetPagedAsync(int? policyId, AssetType? type, string? search, int page, int pageSize)
    {
        return await _assetRepository.GetPagedAsync(policyId, type, search, page, pageSize);
    }
}

// PagedResult class if not exists
public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
