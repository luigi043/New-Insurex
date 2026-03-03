using InsureX.Domain.Entities;

namespace InsureX.Application.Interfaces;

public interface ITenantService
{
    Task<Tenant?> GetByIdAsync(int id);
    Task<IEnumerable<Tenant>> GetAllAsync();
    Task<Tenant> OnboardAsync(TenantOnboardingRequest request);
    Task<Tenant> UpdateAsync(Tenant tenant);
    Task<Tenant> ActivateAsync(int tenantId);
    Task<Tenant> DeactivateAsync(int tenantId);
    Task DeleteAsync(int tenantId);

    // Settings management
    Task<IEnumerable<TenantSettings>> GetSettingsAsync(int tenantId);
    Task<TenantSettings?> GetSettingAsync(int tenantId, string key);
    Task<TenantSettings> SetSettingAsync(int tenantId, string key, string value, string? description = null, string category = "General");
    Task DeleteSettingAsync(int tenantId, string key);
    Task<Dictionary<string, string>> GetSettingsByCategoryAsync(int tenantId, string category);
}
