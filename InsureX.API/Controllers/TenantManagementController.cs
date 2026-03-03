using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/tenant-management")]
[Authorize(Roles = "SuperAdmin,TenantAdmin")]
public class TenantManagementController : ControllerBase
{
    private readonly ITenantSettingsRepository _settingsRepository;
    private readonly ITenantOnboardingRepository _onboardingRepository;
    private readonly IRepository<Tenant> _tenantRepository;
    private readonly ILogger<TenantManagementController> _logger;

    public TenantManagementController(
        ITenantSettingsRepository settingsRepository,
        ITenantOnboardingRepository onboardingRepository,
        IRepository<Tenant> tenantRepository,
        ILogger<TenantManagementController> logger)
    {
        _settingsRepository = settingsRepository;
        _onboardingRepository = onboardingRepository;
        _tenantRepository = tenantRepository;
        _logger = logger;
    }

    [HttpPost("onboarding")]
    public async Task<IActionResult> InitiateOnboarding([FromBody] TenantOnboardingRequest request)
    {
        var tenant = new Tenant
        {
            Name = request.CompanyName,
            ContactEmail = request.ContactEmail,
            ContactPhone = request.ContactPhone,
            Address = request.Address,
            TaxId = request.TaxId,
            RegistrationNumber = request.RegistrationNumber,
            IsActive = false,
            CreatedBy = "system"
        };

        await _tenantRepository.AddAsync(tenant);

        var onboarding = new TenantOnboarding
        {
            TenantId = tenant.Id,
            CompanyName = request.CompanyName,
            ContactPersonName = request.ContactPersonName,
            ContactEmail = request.ContactEmail,
            ContactPhone = request.ContactPhone,
            Address = request.Address,
            City = request.City,
            State = request.State,
            Country = request.Country,
            PostalCode = request.PostalCode,
            TaxId = request.TaxId,
            RegistrationNumber = request.RegistrationNumber,
            Industry = request.Industry,
            EmployeeCount = request.EmployeeCount,
            SubscriptionPlan = request.SubscriptionPlan,
            TrialExpiryDate = DateTime.UtcNow.AddDays(30),
            OnboardingStatus = "InProgress",
            CreatedBy = "system"
        };

        await _onboardingRepository.AddAsync(onboarding);

        await InitializeDefaultSettings(tenant.Id);

        _logger.LogInformation("Tenant onboarding initiated for {TenantName}", tenant.Name);

        return Ok(new
        {
            tenantId = tenant.Id,
            status = "InProgress",
            message = "Tenant onboarding initiated successfully"
        });
    }

    [HttpPut("onboarding/{tenantId}/complete")]
    public async Task<IActionResult> CompleteOnboarding(int tenantId)
    {
        var tenant = await _tenantRepository.GetByIdAsync(tenantId);
        if (tenant == null)
            return NotFound(new { message = "Tenant not found" });

        var onboarding = await _onboardingRepository.GetByTenantIdAsync(tenantId);
        if (onboarding == null)
            return NotFound(new { message = "Onboarding record not found" });

        tenant.IsActive = true;
        await _tenantRepository.UpdateAsync(tenant);

        await _onboardingRepository.UpdateStatusAsync(tenantId, "Completed");

        _logger.LogInformation("Tenant onboarding completed for tenant {TenantId}", tenantId);

        return Ok(new { message = "Tenant activated successfully" });
    }

    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings([FromQuery] int tenantId, [FromQuery] string? category = null)
    {
        IEnumerable<TenantSettings> settings;

        if (!string.IsNullOrEmpty(category))
        {
            settings = await _settingsRepository.GetByCategoryAsync(tenantId, category);
        }
        else
        {
            settings = await _settingsRepository.GetByTenantIdAsync(tenantId);
        }

        return Ok(settings);
    }

    [HttpPut("settings")]
    public async Task<IActionResult> UpdateSetting([FromBody] UpdateSettingRequest request)
    {
        var success = await _settingsRepository.UpdateSettingAsync(
            request.TenantId,
            request.SettingKey,
            request.SettingValue);

        if (!success)
            return NotFound(new { message = "Setting not found" });

        _logger.LogInformation(
            "Tenant setting updated: {SettingKey} for tenant {TenantId}",
            request.SettingKey,
            request.TenantId);

        return Ok(new { message = "Setting updated successfully" });
    }

    [HttpPost("settings")]
    public async Task<IActionResult> CreateSetting([FromBody] CreateSettingRequest request)
    {
        var setting = new TenantSettings
        {
            TenantId = request.TenantId,
            SettingKey = request.SettingKey,
            SettingValue = request.SettingValue,
            SettingType = request.SettingType,
            Category = request.Category,
            Description = request.Description,
            IsEncrypted = request.IsEncrypted,
            CreatedBy = "system"
        };

        await _settingsRepository.AddAsync(setting);

        return Ok(new { message = "Setting created successfully" });
    }

    private async Task InitializeDefaultSettings(int tenantId)
    {
        var defaultSettings = new List<TenantSettings>
        {
            new() { TenantId = tenantId, SettingKey = "DefaultCurrency", SettingValue = "USD", Category = "General", SettingType = "String" },
            new() { TenantId = tenantId, SettingKey = "DateFormat", SettingValue = "MM/dd/yyyy", Category = "General", SettingType = "String" },
            new() { TenantId = tenantId, SettingKey = "TimeZone", SettingValue = "UTC", Category = "General", SettingType = "String" },
            new() { TenantId = tenantId, SettingKey = "EmailNotifications", SettingValue = "true", Category = "Notifications", SettingType = "Boolean" },
            new() { TenantId = tenantId, SettingKey = "ClaimAutoApprovalThreshold", SettingValue = "1000", Category = "Claims", SettingType = "Number" },
            new() { TenantId = tenantId, SettingKey = "PolicyRenewalReminderDays", SettingValue = "30", Category = "Policies", SettingType = "Number" }
        };

        foreach (var setting in defaultSettings)
        {
            setting.CreatedBy = "system";
            await _settingsRepository.AddAsync(setting);
        }
    }
}

public class TenantOnboardingRequest
{
    public string CompanyName { get; set; } = string.Empty;
    public string ContactPersonName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public string? TaxId { get; set; }
    public string? RegistrationNumber { get; set; }
    public string? Industry { get; set; }
    public int? EmployeeCount { get; set; }
    public string? SubscriptionPlan { get; set; }
}

public class UpdateSettingRequest
{
    public int TenantId { get; set; }
    public string SettingKey { get; set; } = string.Empty;
    public string SettingValue { get; set; } = string.Empty;
}

public class CreateSettingRequest
{
    public int TenantId { get; set; }
    public string SettingKey { get; set; } = string.Empty;
    public string SettingValue { get; set; } = string.Empty;
    public string? SettingType { get; set; }
    public string? Category { get; set; }
    public string? Description { get; set; }
    public bool IsEncrypted { get; set; }
}
