using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InsureX.Application.Interfaces;
using InsureX.Application.DTOs.Policy;
using System.Security.Claims;

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
    public async Task<ActionResult<List<PolicyDto>>> GetAll([FromQuery] PolicySearchDto search)
    {
        try { return Ok(await _policyService.GetAllPoliciesAsync(search)); }
        catch (Exception ex) { _logger.LogError(ex, "Error getting policies"); return StatusCode(500, new { message = "Error retrieving policies" }); }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PolicyDto>> GetById(Guid id)
    {
        try { return Ok(await _policyService.GetPolicyByIdAsync(id)); }
        catch (KeyNotFoundException) { return NotFound(new { message = $"Policy {id} not found" }); }
        catch (Exception ex) { _logger.LogError(ex, "Error getting policy {id}", id); return StatusCode(500, new { message = "Error retrieving policy" }); }
    }

    [HttpPost]
    public async Task<ActionResult<PolicyDto>> Create(CreatePolicyDto createDto)
    {
        try
        {
            var userId = Guid.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) ? id : Guid.Empty;
            var policy = await _policyService.CreatePolicyAsync(createDto, userId);
            return CreatedAtAction(nameof(GetById), new { id = policy.Id }, policy);
        }
        catch (Exception ex) { _logger.LogError(ex, "Error creating policy"); return StatusCode(500, new { message = "Error creating policy" }); }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PolicyDto>> Update(Guid id, UpdatePolicyDto updateDto)
    {
        if (id != updateDto.Id) return BadRequest(new { message = "ID mismatch" });
        try { return Ok(await _policyService.UpdatePolicyAsync(updateDto)); }
        catch (KeyNotFoundException) { return NotFound(new { message = $"Policy {id} not found" }); }
        catch (Exception ex) { _logger.LogError(ex, "Error updating policy {id}", id); return StatusCode(500, new { message = "Error updating policy" }); }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            if (!await _policyService.DeletePolicyAsync(id)) return NotFound(new { message = $"Policy {id} not found" });
            return NoContent();
        }
        catch (Exception ex) { _logger.LogError(ex, "Error deleting policy {id}", id); return StatusCode(500, new { message = "Error deleting policy" }); }
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] string status)
    {
        try
        {
            if (!await _policyService.UpdatePolicyStatusAsync(id, status)) return NotFound(new { message = $"Policy {id} not found" });
            return Ok(new { message = "Status updated successfully" });
        }
        catch (Exception ex) { _logger.LogError(ex, "Error updating policy status {id}", id); return StatusCode(500, new { message = "Error updating status" }); }
    }

    [HttpGet("expiring")]
    public async Task<ActionResult<List<PolicyDto>>> GetExpiring([FromQuery] int days = 30)
    {
        try { return Ok(await _policyService.GetPoliciesExpiringAsync(days)); }
        catch (Exception ex) { _logger.LogError(ex, "Error getting expiring policies"); return StatusCode(500, new { message = "Error retrieving expiring policies" }); }
    }
}
