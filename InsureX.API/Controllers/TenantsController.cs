using InsureX.Application.DTOs;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "AdminOnly")]
[Produces("application/json")]
public class TenantsController : ControllerBase
{
    private readonly ITenantService _tenantService;
    private readonly ILogger<TenantsController> _logger;

    public TenantsController(ITenantService tenantService, ILogger<TenantsController> logger)
    {
        _tenantService = tenantService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Tenant>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var tenants = await _tenantService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<Tenant>>.SuccessResponse(tenants));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<Tenant>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var tenant = await _tenantService.GetByIdAsync(id);
        if (tenant == null)
            return NotFound(ApiResponse.ErrorResponse("Tenant not found"));

        return Ok(ApiResponse<Tenant>.SuccessResponse(tenant));
    }

    [HttpPost("onboard")]
    [ProducesResponseType(typeof(ApiResponse<Tenant>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Onboard([FromBody] TenantOnboardingRequest request)
    {
        var tenant = await _tenantService.OnboardAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = tenant.Id },
            ApiResponse<Tenant>.SuccessResponse(tenant, "Tenant onboarded successfully"));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<Tenant>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] Tenant tenant)
    {
        tenant.Id = id;
        var updated = await _tenantService.UpdateAsync(tenant);
        return Ok(ApiResponse<Tenant>.SuccessResponse(updated, "Tenant updated successfully"));
    }

    [HttpPost("{id:int}/activate")]
    [ProducesResponseType(typeof(ApiResponse<Tenant>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Activate(int id)
    {
        var tenant = await _tenantService.ActivateAsync(id);
        return Ok(ApiResponse<Tenant>.SuccessResponse(tenant, "Tenant activated successfully"));
    }

    [HttpPost("{id:int}/deactivate")]
    [ProducesResponseType(typeof(ApiResponse<Tenant>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deactivate(int id)
    {
        var tenant = await _tenantService.DeactivateAsync(id);
        return Ok(ApiResponse<Tenant>.SuccessResponse(tenant, "Tenant deactivated successfully"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        await _tenantService.DeleteAsync(id);
        return Ok(ApiResponse.SuccessResponse("Tenant deleted successfully"));
    }

    // Settings endpoints
    [HttpGet("{id:int}/settings")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<TenantSettings>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSettings(int id)
    {
        var settings = await _tenantService.GetSettingsAsync(id);
        return Ok(ApiResponse<IEnumerable<TenantSettings>>.SuccessResponse(settings));
    }

    [HttpGet("{id:int}/settings/{key}")]
    [ProducesResponseType(typeof(ApiResponse<TenantSettings>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSetting(int id, string key)
    {
        var setting = await _tenantService.GetSettingAsync(id, key);
        if (setting == null)
            return NotFound(ApiResponse.ErrorResponse($"Setting '{key}' not found"));

        return Ok(ApiResponse<TenantSettings>.SuccessResponse(setting));
    }

    [HttpPut("{id:int}/settings/{key}")]
    [ProducesResponseType(typeof(ApiResponse<TenantSettings>), StatusCodes.Status200OK)]
    public async Task<IActionResult> SetSetting(int id, string key, [FromBody] SetSettingRequest request)
    {
        var setting = await _tenantService.SetSettingAsync(id, key, request.Value, request.Description, request.Category ?? "General");
        return Ok(ApiResponse<TenantSettings>.SuccessResponse(setting, "Setting updated successfully"));
    }

    [HttpDelete("{id:int}/settings/{key}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteSetting(int id, string key)
    {
        await _tenantService.DeleteSettingAsync(id, key);
        return Ok(ApiResponse.SuccessResponse("Setting deleted successfully"));
    }

    [HttpGet("{id:int}/settings/category/{category}")]
    [ProducesResponseType(typeof(ApiResponse<Dictionary<string, string>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSettingsByCategory(int id, string category)
    {
        var settings = await _tenantService.GetSettingsByCategoryAsync(id, category);
        return Ok(ApiResponse<Dictionary<string, string>>.SuccessResponse(settings));
    }
}

public class SetSettingRequest
{
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
}
