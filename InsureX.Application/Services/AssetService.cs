using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;

// InsureX.Application/Services/AssetService.cs
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Application.Exceptions;

namespace InsureX.Application.Services;

public class AssetService : IAssetService
{
    private readonly IAssetRepository _assetRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IUnitOfWork _unitOfWork;

    public AssetService(
        IAssetRepository assetRepository,
        ITenantContext tenantContext,
        IUnitOfWork unitOfWork)
    {
        _assetRepository = assetRepository;
        _tenantContext = tenantContext;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<Asset>> GetAllAsync()
    {
        return await _assetRepository.GetAllByTenantAsync(_tenantContext.TenantId);
    }

    public async Task<Asset?> GetByIdAsync(int id)
    {
        var asset = await _assetRepository.GetByIdAsync(id);
        return asset?.TenantId == _tenantContext.TenantId ? asset : null;
    }

    public async Task<IEnumerable<Asset>> GetByTypeAsync(AssetType type)
    {
        return await _assetRepository.GetByTypeAndTenantAsync(type, _tenantContext.TenantId);
    }

    public async Task<Asset> CreateAsync(Asset asset)
    {
        asset.TenantId = _tenantContext.TenantId;
        asset.CreatedAt = DateTime.UtcNow;
        asset.Status = AssetStatus.ACTIVE;

        // Validation
        if (string.IsNullOrWhiteSpace(asset.Name))
            throw new ValidationException("Asset name is required");
        
        if (asset.Value < 0)
            throw new ValidationException("Asset value cannot be negative");

        await _assetRepository.AddAsync(asset);
        await _unitOfWork.SaveChangesAsync();
        
        return asset;
    }

    public async Task<Asset> UpdateAsync(Asset asset)
    {
        var existing = await GetByIdAsync(asset.Id);
        if (existing == null)
            throw new NotFoundException($"Asset {asset.Id} not found");

        existing.Name = asset.Name;
        existing.Description = asset.Description;
        existing.Type = asset.Type;
        existing.Value = asset.Value;
        existing.Location = asset.Location;
        existing.PurchaseDate = asset.PurchaseDate;
        existing.SerialNumber = asset.SerialNumber;
        existing.Status = asset.Status;
        existing.UpdatedAt = DateTime.UtcNow;

        await _assetRepository.UpdateAsync(existing);
        await _unitOfWork.SaveChangesAsync();
        
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var asset = await GetByIdAsync(id);
        if (asset == null)
            throw new NotFoundException($"Asset {asset.Id} not found");

        await _assetRepository.DeleteAsync(asset);
        await _unitOfWork.SaveChangesAsync();
        
        return true;
    }
}
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
