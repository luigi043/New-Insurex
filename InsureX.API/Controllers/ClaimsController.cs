// InsureX.API/Controllers/ClaimsController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Application.Exceptions;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClaimsController : ControllerBase
{
    private readonly IClaimService _claimService;
    private readonly ILogger<ClaimsController> _logger;

    public ClaimsController(IClaimService claimService, ILogger<ClaimsController> logger)
    {
        _claimService = claimService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Claim>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var claims = await _claimService.GetAllAsync();
            return Ok(claims);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving claims");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(Claim), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var claim = await _claimService.GetByIdAsync(id);
            return claim == null ? NotFound() : Ok(claim);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("policy/{policyId:int}")]
    [ProducesResponseType(typeof(IEnumerable<Claim>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByPolicy(int policyId)
    {
        try
        {
            var claims = await _claimService.GetByPolicyIdAsync(policyId);
            return Ok(claims);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("status/{status}")]
    [ProducesResponseType(typeof(IEnumerable<Claim>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByStatus(ClaimStatus status)
    {
        var claims = await _claimService.GetByStatusAsync(status);
        return Ok(claims);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Claim), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] Claim claim)
    {
        try
        {
            var created = await _claimService.CreateAsync(claim);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Claim), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] Claim claim)
    {
        try
        {
            claim.Id = id;
            var updated = await _claimService.UpdateAsync(claim);
            return Ok(updated);
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _claimService.DeleteAsync(id);
            return NoContent();
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id:int}/approve")]
    [Authorize(Roles = "Admin,ClaimsManager")]
    [ProducesResponseType(typeof(Claim), StatusCodes.Status200OK)]
    public async Task<IActionResult> Approve(int id, [FromQuery] string? notes)
    {
        try
        {
            var claim = await _claimService.ApproveAsync(id, notes);
            return Ok(claim);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id:int}/reject")]
    [Authorize(Roles = "Admin,ClaimsManager")]
    [ProducesResponseType(typeof(Claim), StatusCodes.Status200OK)]
    public async Task<IActionResult> Reject(int id, [FromQuery] string reason)
    {
        try
        {
            var claim = await _claimService.RejectAsync(id, reason);
            return Ok(claim);
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("submit")]
    [ProducesResponseType(typeof(Claim), StatusCodes.Status201Created)]
    public async Task<IActionResult> Submit([FromBody] SubmitClaimRequest request)
    {
        try
        {
            var claim = await _claimService.SubmitAsync(
                request.PolicyId, 
                request.Amount, 
                request.Description, 
                request.DateOfLoss
            );
            return CreatedAtAction(nameof(GetById), new { id = claim.Id }, claim);
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

public record SubmitClaimRequest(int PolicyId, decimal Amount, string Description, DateTime DateOfLoss);