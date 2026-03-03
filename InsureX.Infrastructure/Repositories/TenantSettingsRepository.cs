using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class TenantSettingsRepository : Repository<TenantSettings>, ITenantSettingsRepository
{
    public TenantSettingsRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<TenantSettings>> GetByTenantIdAsync(int tenantId)
    {
        return await _dbSet
            .Where(s => s.TenantId == tenantId)
            .OrderBy(s => s.Category)
            .ThenBy(s => s.SettingKey)
            .ToListAsync();
    }

    public async Task<TenantSettings?> GetSettingAsync(int tenantId, string settingKey)
    {
        return await _dbSet
            .FirstOrDefaultAsync(s => s.TenantId == tenantId && s.SettingKey == settingKey);
    }

    public async Task<IEnumerable<TenantSettings>> GetByCategoryAsync(int tenantId, string category)
    {
        return await _dbSet
            .Where(s => s.TenantId == tenantId && s.Category == category)
            .OrderBy(s => s.SettingKey)
            .ToListAsync();
    }

    public async Task<bool> UpdateSettingAsync(int tenantId, string settingKey, string settingValue)
    {
        var setting = await GetSettingAsync(tenantId, settingKey);
        if (setting == null)
            return false;

        setting.SettingValue = settingValue;
        setting.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }
}

public class TenantOnboardingRepository : Repository<TenantOnboarding>, ITenantOnboardingRepository
{
    public TenantOnboardingRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<TenantOnboarding?> GetByTenantIdAsync(int tenantId)
    {
        return await _dbSet
            .Include(o => o.Tenant)
            .FirstOrDefaultAsync(o => o.TenantId == tenantId);
    }

    public async Task<IEnumerable<TenantOnboarding>> GetByStatusAsync(string status)
    {
        return await _dbSet
            .Include(o => o.Tenant)
            .Where(o => o.OnboardingStatus == status)
            .OrderBy(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> UpdateStatusAsync(int tenantId, string status)
    {
        var onboarding = await GetByTenantIdAsync(tenantId);
        if (onboarding == null)
            return false;

        onboarding.OnboardingStatus = status;
        if (status == "Completed")
            onboarding.CompletedAt = DateTime.UtcNow;

        onboarding.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }
}
