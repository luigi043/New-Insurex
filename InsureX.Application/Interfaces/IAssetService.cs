using InsureX.Domain.Entities;

namespace InsureX.Application.Interfaces;

public interface IAssetService
{
    Task<object> GetPagedAsync(int? policyId, AssetType? type, string? search, int page, int pageSize);
    Task<object?> GetByIdAsync(int id);
    Task<dynamic> CreateAsync<T>(object dto, AssetType assetType);
    Task<object?> UpdateAsync(int id, object dto);
    Task<bool> DeleteAsync(int id);
}
