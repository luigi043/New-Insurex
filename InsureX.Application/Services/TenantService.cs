using InsureX.Application.Exceptions;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace InsureX.Application.Services;

public class TenantService : ITenantService
{
    private readonly ITenantRepository _tenantRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<TenantService> _logger;

    public TenantService(
        ITenantRepository tenantRepository,
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork,
        ILogger<TenantService> logger)
    {
        _tenantRepository = tenantRepository;
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Tenant?> GetByIdAsync(int id)
    {
        return await _tenantRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Tenant>> GetAllAsync()
    {
        return await _tenantRepository.GetAllAsync();
    }

    public async Task<Tenant> OnboardAsync(TenantOnboardingRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.TenantName))
            throw new ValidationException("Tenant name is required");

        if (string.IsNullOrWhiteSpace(request.AdminEmail))
            throw new ValidationException("Admin email is required");

        if (string.IsNullOrWhiteSpace(request.AdminPassword))
            throw new ValidationException("Admin password is required");

        // Check for duplicate tenant name
        if (await _tenantRepository.ExistsAsync(request.TenantName))
            throw new ConflictException($"Tenant with name '{request.TenantName}' already exists");

        // Check for duplicate admin email
        if (await _userRepository.EmailExistsAsync(request.AdminEmail))
            throw new ConflictException($"User with email '{request.AdminEmail}' already exists");

        // Create tenant
        var tenant = new Tenant
        {
            Name = request.TenantName,
            Description = request.Description,
            ContactEmail = request.ContactEmail,
            ContactPhone = request.ContactPhone,
            Address = request.Address,
            TaxId = request.TaxId,
            RegistrationNumber = request.RegistrationNumber,
            IsActive = true,
            SubscriptionExpiryDate = DateTime.UtcNow.AddYears(1)
        };
        tenant.SetCreated("system");

        await _tenantRepository.AddAsync(tenant);
        await _unitOfWork.SaveChangesAsync();

        // Create admin user for the tenant
        var adminUser = new User
        {
            Email = request.AdminEmail,
            FirstName = request.AdminFirstName,
            LastName = request.AdminLastName,
            PasswordHash = _passwordHasher.HashPassword(request.AdminPassword),
            Role = UserRole.Admin,
            Status = UserStatus.Active,
            TenantId = tenant.Id,
            EmailVerified = true
        };
        adminUser.SetCreated("system");

        await _userRepository.AddAsync(adminUser);

        // Create default settings
        var defaultSettings = GetDefaultSettings(tenant.Id);
        foreach (var setting in defaultSettings)
        {
            tenant.Settings.Add(setting);
        }

        // Apply initial custom settings if provided
        if (request.InitialSettings != null)
        {
            foreach (var kvp in request.InitialSettings)
            {
                var existing = tenant.Settings.FirstOrDefault(s => s.SettingKey == kvp.Key);
                if (existing != null)
                    existing.SettingValue = kvp.Value;
                else
                    tenant.Settings.Add(new TenantSettings
                    {
                        TenantId = tenant.Id,
                        SettingKey = kvp.Key,
                        SettingValue = kvp.Value,
                        Category = "Custom"
                    });
            }
        }

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation(
            "Tenant '{TenantName}' onboarded with admin user {AdminEmail}",
            tenant.Name, request.AdminEmail);

        return tenant;
    }

    public async Task<Tenant> UpdateAsync(Tenant tenant)
    {
        var existing = await _tenantRepository.GetByIdAsync(tenant.Id);
        if (existing == null)
            throw new NotFoundException("Tenant not found");

        existing.Name = tenant.Name;
        existing.Description = tenant.Description;
        existing.ContactEmail = tenant.ContactEmail;
        existing.ContactPhone = tenant.ContactPhone;
        existing.Address = tenant.Address;
        existing.TaxId = tenant.TaxId;
        existing.RegistrationNumber = tenant.RegistrationNumber;
        existing.LogoUrl = tenant.LogoUrl;
        existing.PrimaryColor = tenant.PrimaryColor;
        existing.SecondaryColor = tenant.SecondaryColor;
        existing.SetUpdated("system");

        await _tenantRepository.UpdateAsync(existing);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Tenant '{TenantName}' updated", existing.Name);

        return existing;
    }

    public async Task<Tenant> ActivateAsync(int tenantId)
    {
        var tenant = await _tenantRepository.GetByIdAsync(tenantId);
        if (tenant == null)
            throw new NotFoundException("Tenant not found");

        tenant.IsActive = true;
        tenant.SetUpdated("system");

        await _tenantRepository.UpdateAsync(tenant);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Tenant '{TenantName}' activated", tenant.Name);

        return tenant;
    }

    public async Task<Tenant> DeactivateAsync(int tenantId)
    {
        var tenant = await _tenantRepository.GetByIdAsync(tenantId);
        if (tenant == null)
            throw new NotFoundException("Tenant not found");

        tenant.IsActive = false;
        tenant.SetUpdated("system");

        await _tenantRepository.UpdateAsync(tenant);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Tenant '{TenantName}' deactivated", tenant.Name);

        return tenant;
    }

    public async Task DeleteAsync(int tenantId)
    {
        var tenant = await _tenantRepository.GetByIdAsync(tenantId);
        if (tenant == null)
            throw new NotFoundException("Tenant not found");

        await _tenantRepository.DeleteAsync(tenantId);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Tenant '{TenantName}' deleted", tenant.Name);
    }

    // Settings management
    public async Task<IEnumerable<TenantSettings>> GetSettingsAsync(int tenantId)
    {
        var tenant = await _tenantRepository.GetByIdAsync(tenantId);
        if (tenant == null)
            throw new NotFoundException("Tenant not found");

        return tenant.Settings;
    }

    public async Task<TenantSettings?> GetSettingAsync(int tenantId, string key)
    {
        var tenant = await _tenantRepository.GetByIdAsync(tenantId);
        if (tenant == null)
            throw new NotFoundException("Tenant not found");

        return tenant.Settings.FirstOrDefault(s => s.SettingKey == key);
    }

    public async Task<TenantSettings> SetSettingAsync(int tenantId, string key, string value, string? description = null, string category = "General")
    {
        var tenant = await _tenantRepository.GetByIdAsync(tenantId);
        if (tenant == null)
            throw new NotFoundException("Tenant not found");

        var setting = tenant.Settings.FirstOrDefault(s => s.SettingKey == key);
        if (setting != null)
        {
            setting.SettingValue = value;
            if (description != null) setting.Description = description;
            setting.Category = category;
            setting.SetUpdated("system");
        }
        else
        {
            setting = new TenantSettings
            {
                TenantId = tenantId,
                SettingKey = key,
                SettingValue = value,
                Description = description,
                Category = category
            };
            setting.SetCreated("system");
            tenant.Settings.Add(setting);
        }

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Setting '{Key}' updated for tenant {TenantId}", key, tenantId);

        return setting;
    }

    public async Task DeleteSettingAsync(int tenantId, string key)
    {
        var tenant = await _tenantRepository.GetByIdAsync(tenantId);
        if (tenant == null)
            throw new NotFoundException("Tenant not found");

        var setting = tenant.Settings.FirstOrDefault(s => s.SettingKey == key);
        if (setting == null)
            throw new NotFoundException($"Setting '{key}' not found");

        tenant.Settings.Remove(setting);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Setting '{Key}' deleted for tenant {TenantId}", key, tenantId);
    }

    public async Task<Dictionary<string, string>> GetSettingsByCategoryAsync(int tenantId, string category)
    {
        var tenant = await _tenantRepository.GetByIdAsync(tenantId);
        if (tenant == null)
            throw new NotFoundException("Tenant not found");

        return tenant.Settings
            .Where(s => s.Category == category)
            .ToDictionary(s => s.SettingKey, s => s.SettingValue);
    }

    private static List<TenantSettings> GetDefaultSettings(int tenantId)
    {
        return new List<TenantSettings>
        {
            new() { TenantId = tenantId, SettingKey = "currency", SettingValue = "USD", Category = "Financial", Description = "Default currency" },
            new() { TenantId = tenantId, SettingKey = "timezone", SettingValue = "UTC", Category = "General", Description = "Default timezone" },
            new() { TenantId = tenantId, SettingKey = "date_format", SettingValue = "yyyy-MM-dd", Category = "General", Description = "Date display format" },
            new() { TenantId = tenantId, SettingKey = "auto_approve_claims_under", SettingValue = "0", Category = "Claims", Description = "Auto-approve claims under this amount (0 = disabled)" },
            new() { TenantId = tenantId, SettingKey = "policy_renewal_reminder_days", SettingValue = "30", Category = "Policies", Description = "Days before expiry to send renewal reminder" },
            new() { TenantId = tenantId, SettingKey = "invoice_payment_terms_days", SettingValue = "30", Category = "Billing", Description = "Default payment terms in days" },
            new() { TenantId = tenantId, SettingKey = "enable_email_notifications", SettingValue = "true", Category = "Notifications", Description = "Enable email notifications" },
            new() { TenantId = tenantId, SettingKey = "max_claim_attachments", SettingValue = "10", Category = "Claims", Description = "Maximum attachments per claim" },
        };
    }
}
