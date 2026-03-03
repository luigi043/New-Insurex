using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InsureX.Application.DTOs;
using InsureX.Application.DTOs.Policy;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PolicyController : ControllerBase
{
    private readonly IPolicyService _policyService;
    private readonly ILogger<PolicyController> _logger;

    public PolicyController(IPolicyService policyService, ILogger<PolicyController> logger)
    {
        _policyService = policyService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult> GetAll([FromQuery] PaginationRequest? request)
    {
        try { return Ok(await _policyService.GetAllAsync(request ?? new PaginationRequest())); }
        catch (Exception ex) { _logger.LogError(ex, "Error getting policies"); return StatusCode(500, new { message = "Error retrieving policies" }); }
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult> GetById(int id)
    {
        try
        {
            var policy = await _policyService.GetByIdAsync(id);
            return policy == null ? NotFound(new { message = $"Policy {id} not found" }) : Ok(policy);
        }
        catch (Exception ex) { _logger.LogError(ex, "Error getting policy {id}", id); return StatusCode(500, new { message = "Error retrieving policy" }); }
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreatePolicyDto createDto)
    {
        try
        {
            if (!Enum.TryParse<PolicyType>(createDto.PolicyType, true, out var policyType))
                return BadRequest(new { message = $"Invalid policy type: {createDto.PolicyType}" });

            var policy = new Policy
            {
                PolicyNumber    = createDto.PolicyNumber,
                TenantId        = createDto.TenantId,
                Type            = policyType,
                PremiumAmount   = createDto.Premium,
                StartDate       = createDto.StartDate,
                EndDate         = createDto.EndDate,
                InsuredId       = createDto.PartnerId,
                Status          = PolicyStatus.Draft
            };

            var created = await _policyService.CreateAsync(policy);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex) { _logger.LogError(ex, "Error creating policy"); return StatusCode(500, new { message = "Error creating policy" }); }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdatePolicyDto updateDto)
    {
        if (id != updateDto.Id) return BadRequest(new { message = "ID mismatch" });
        try
        {
            var existing = await _policyService.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = $"Policy {id} not found" });

            if (!Enum.TryParse<PolicyType>(updateDto.PolicyType, true, out var policyType))
                return BadRequest(new { message = $"Invalid policy type: {updateDto.PolicyType}" });

            existing.PolicyNumber  = updateDto.PolicyNumber;
            existing.Type          = policyType;
            existing.PremiumAmount = updateDto.Premium;
            existing.StartDate     = updateDto.StartDate;
            existing.EndDate       = updateDto.EndDate;

            return Ok(await _policyService.UpdateAsync(existing));
        }
        catch (Exception ex) { _logger.LogError(ex, "Error updating policy {id}", id); return StatusCode(500, new { message = "Error updating policy" }); }
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var existing = await _policyService.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = $"Policy {id} not found" });
            await _policyService.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex) { _logger.LogError(ex, "Error deleting policy {id}", id); return StatusCode(500, new { message = "Error deleting policy" }); }
    }

    [HttpPatch("{id:int}/activate")]
    public async Task<ActionResult> Activate(int id)
    {
        try { return Ok(await _policyService.ActivateAsync(id)); }
        catch (KeyNotFoundException) { return NotFound(new { message = $"Policy {id} not found" }); }
        catch (Exception ex) { _logger.LogError(ex, "Error activating policy {id}", id); return StatusCode(500, new { message = "Error activating policy" }); }
    }

    [HttpPatch("{id:int}/cancel")]
    public async Task<ActionResult> Cancel(int id, [FromBody] CancelPolicyRequest request)
    {
        try { return Ok(await _policyService.CancelAsync(id, request.Reason)); }
        catch (KeyNotFoundException) { return NotFound(new { message = $"Policy {id} not found" }); }
        catch (Exception ex) { _logger.LogError(ex, "Error cancelling policy {id}", id); return StatusCode(500, new { message = "Error cancelling policy" }); }
    }

    [HttpGet("expiring")]
    public async Task<ActionResult> GetExpiring([FromQuery] int days = 30)
    {
        try
        {
            var from = DateTime.UtcNow;
            var to   = DateTime.UtcNow.AddDays(days);
            return Ok(await _policyService.GetExpiringPoliciesAsync(from, to, new PaginationRequest()));
        }
        catch (Exception ex) { _logger.LogError(ex, "Error getting expiring policies"); return StatusCode(500, new { message = "Error retrieving expiring policies" }); }
    }
}

public class CancelPolicyRequest
{
    public string Reason { get; set; } = string.Empty;
}
