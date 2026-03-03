using InsureX.Application.Exceptions;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace InsureX.Application.Services;

public class AssetService : IAssetService
{
    private readonly IAssetRepository _assetRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AssetService> _logger;

    public AssetService(
        IAssetRepository assetRepository,
        ITenantContext tenantContext,
        IUnitOfWork unitOfWork,
        ILogger<AssetService> logger)
    {
        _assetRepository = assetRepository;
        _tenantContext = tenantContext;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<IEnumerable<Asset>> GetAllAsync()
    {
        return await _assetRepository.GetAllByTenantAsync(_tenantContext.TenantId);
    }

    public async Task<Asset?> GetByIdAsync(int id)
    {
        var asset = await _assetRepository.GetByIdAsync(id);
        if (asset == null || asset.TenantId != _tenantContext.TenantId)
            return null;
        return asset;
    }

    public async Task<IEnumerable<Asset>> GetByTypeAsync(AssetType type)
    {
        return await _assetRepository.GetByTypeAndTenantAsync(type, _tenantContext.TenantId);
    }

    public async Task<IEnumerable<Asset>> GetByStatusAsync(AssetStatus status)
    {
        return await _assetRepository.GetByStatusAsync(status);
    }

    public async Task<Asset> CreateAsync(Asset asset)
    {
        // Validation
        if (string.IsNullOrWhiteSpace(asset.Name))
            throw new ValidationException("Asset name is required");

        if (asset.Value < 0)
            throw new ValidationException("Asset value cannot be negative");

        // Check for duplicate serial number
        if (!string.IsNullOrWhiteSpace(asset.SerialNumber))
        {
            var existing = await _assetRepository.GetBySerialNumberAsync(asset.SerialNumber);
            if (existing != null)
                throw new ValidationException("Asset with this serial number already exists");
        }

        asset.TenantId = _tenantContext.TenantId;
        asset.Status = AssetStatus.Active;
        asset.SetCreated("system");

        await _assetRepository.AddAsync(asset);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Asset {AssetName} created with ID {AssetId}", asset.Name, asset.Id);

        return asset;
    }

    public async Task<Asset> UpdateAsync(Asset asset)
    {
        var existingAsset = await GetByIdAsync(asset.Id);
        if (existingAsset == null)
            throw new NotFoundException("Asset not found");

        // Validation
        if (string.IsNullOrWhiteSpace(asset.Name))
            throw new ValidationException("Asset name is required");

        if (asset.Value < 0)
            throw new ValidationException("Asset value cannot be negative");

        // Check for duplicate serial number
        if (!string.IsNullOrWhiteSpace(asset.SerialNumber) && 
            asset.SerialNumber != existingAsset.SerialNumber)
        {
            var existing = await _assetRepository.GetBySerialNumberAsync(asset.SerialNumber);
            if (existing != null && existing.Id != asset.Id)
                throw new ValidationException("Asset with this serial number already exists");
        }

        existingAsset.Name = asset.Name;
        existingAsset.Description = asset.Description;
        existingAsset.Type = asset.Type;
        existingAsset.Value = asset.Value;
        existingAsset.Location = asset.Location;
        existingAsset.PurchaseDate = asset.PurchaseDate;
        existingAsset.SerialNumber = asset.SerialNumber;
        existingAsset.Status = asset.Status;
        existingAsset.Manufacturer = asset.Manufacturer;
        existingAsset.Model = asset.Model;
        existingAsset.Year = asset.Year;
        existingAsset.RegistrationNumber = asset.RegistrationNumber;
        existingAsset.VIN = asset.VIN;
        existingAsset.IMEI = asset.IMEI;
        existingAsset.DepreciationRate = asset.DepreciationRate;
        existingAsset.WarrantyExpiryDate = asset.WarrantyExpiryDate;
        existingAsset.InsuranceReference = asset.InsuranceReference;
        existingAsset.Notes = asset.Notes;
        existingAsset.SetUpdated("system");

        await _assetRepository.UpdateAsync(existingAsset);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Asset {AssetName} updated", existingAsset.Name);

        return existingAsset;
    }

    public async Task DeleteAsync(int id)
    {
        var asset = await GetByIdAsync(id);
        if (asset == null)
            throw new NotFoundException("Asset not found");

        await _assetRepository.DeleteAsync(asset);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Asset {AssetName} deleted", asset.Name);
    }

    public async Task<decimal> GetTotalValueAsync()
    {
        return await _assetRepository.GetTotalValueByTenantAsync(_tenantContext.TenantId);
    }

    public async Task<IEnumerable<Asset>> GetExpiringWarrantyAsync(DateTime beforeDate)
    {
        return await _assetRepository.GetExpiringWarrantyAsync(beforeDate);
    }
}
