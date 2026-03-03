using InsureX.Domain.Entities;

namespace InsureX.Domain.Interfaces;

public interface ITenantSettingsRepository : IRepository<TenantSettings>
{
    Task<IEnumerable<TenantSettings>> GetByTenantIdAsync(int tenantId);
    Task<TenantSettings?> GetSettingAsync(int tenantId, string settingKey);
    Task<IEnumerable<TenantSettings>> GetByCategoryAsync(int tenantId, string category);
    Task<bool> UpdateSettingAsync(int tenantId, string settingKey, string settingValue);
}

public interface ITenantOnboardingRepository : IRepository<TenantOnboarding>
{
    Task<TenantOnboarding?> GetByTenantIdAsync(int tenantId);
    Task<IEnumerable<TenantOnboarding>> GetByStatusAsync(string status);
    Task<bool> UpdateStatusAsync(int tenantId, string status);
}
