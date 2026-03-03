using InsureX.Application.DTOs;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class PoliciesController : ControllerBase
{
    private readonly IPolicyService _policyService;
    private readonly ILogger<PoliciesController> _logger;

    public PoliciesController(IPolicyService policyService, ILogger<PoliciesController> logger)
    {
        _policyService = policyService;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<Policy>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] PaginationRequest request)
    {
        var policies = await _policyService.GetAllAsync(request);
        return Ok(ApiResponse<PagedResult<Policy>>.SuccessResponse(policies));
    }

    [HttpGet("filter")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<Policy>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Filter([FromQuery] PolicyFilterRequest request)
    {
        var policies = await _policyService.FilterAsync(request);
        return Ok(ApiResponse<PagedResult<Policy>>.SuccessResponse(policies));
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<Policy>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var policy = await _policyService.GetByIdAsync(id);
        if (policy == null)
            return NotFound(ApiResponse.ErrorResponse("Policy not found"));
        
        return Ok(ApiResponse<Policy>.SuccessResponse(policy));
    }

    [HttpGet("number/{policyNumber}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<Policy>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByPolicyNumber(string policyNumber)
    {
        var policy = await _policyService.GetByPolicyNumberAsync(policyNumber);
        if (policy == null)
            return NotFound(ApiResponse.ErrorResponse("Policy not found"));
        
        return Ok(ApiResponse<Policy>.SuccessResponse(policy));
    }

    [HttpGet("status/{status}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Policy>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByStatus(PolicyStatus status)
    {
        var policies = await _policyService.GetByStatusAsync(status);
        return Ok(ApiResponse<IEnumerable<Policy>>.SuccessResponse(policies));
    }

    [HttpGet("type/{type}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Policy>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByType(PolicyType type)
    {
        var policies = await _policyService.GetByTypeAsync(type);
        return Ok(ApiResponse<IEnumerable<Policy>>.SuccessResponse(policies));
    }

    [HttpGet("expiring")]
    [Authorize(Roles = "Admin,Insurer,Broker")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<Policy>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetExpiring([FromQuery] int days = 30, [FromQuery] PaginationRequest? request = null)
    {
        var from = DateTime.UtcNow;
        var to = from.AddDays(days);
        request ??= new PaginationRequest();
        var policies = await _policyService.GetExpiringPoliciesAsync(from, to, request);
        return Ok(ApiResponse<PagedResult<Policy>>.SuccessResponse(policies));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Insurer,Broker")]
    [ProducesResponseType(typeof(ApiResponse<Policy>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] Policy policy)
    {
        var created = await _policyService.CreateAsync(policy);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, 
            ApiResponse<Policy>.SuccessResponse(created, "Policy created successfully"));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Insurer,Broker")]
    [ProducesResponseType(typeof(ApiResponse<Policy>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] Policy policy)
    {
        policy.Id = id;
        var updated = await _policyService.UpdateAsync(policy);
        return Ok(ApiResponse<Policy>.SuccessResponse(updated, "Policy updated successfully"));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        await _policyService.DeleteAsync(id);
        return Ok(ApiResponse.SuccessResponse("Policy deleted successfully"));
    }

    [HttpPost("{id:int}/activate")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<Policy>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Activate(int id)
    {
        var policy = await _policyService.ActivateAsync(id);
        return Ok(ApiResponse<Policy>.SuccessResponse(policy, "Policy activated successfully"));
    }

    [HttpPost("{id:int}/cancel")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<Policy>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Cancel(int id, [FromBody] CancelPolicyRequest request)
    {
        var policy = await _policyService.CancelAsync(id, request.Reason);
        return Ok(ApiResponse<Policy>.SuccessResponse(policy, "Policy cancelled successfully"));
    }

    [HttpPost("{id:int}/renew")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<Policy>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Renew(int id, [FromBody] RenewPolicyRequest request)
    {
        var policy = await _policyService.RenewAsync(id, request.NewEndDate);
        return Ok(ApiResponse<Policy>.SuccessResponse(policy, "Policy renewed successfully"));
    }

    [HttpGet("summary/totals")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<PolicyTotalsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTotals()
    {
        var totalPremium = await _policyService.GetTotalPremiumAsync();
        var totalCoverage = await _policyService.GetTotalCoverageAsync();
        var activeCount = await _policyService.GetActivePolicyCountAsync();
        
        return Ok(ApiResponse<PolicyTotalsDto>.SuccessResponse(new PolicyTotalsDto
        {
            TotalPremium = totalPremium,
            TotalCoverage = totalCoverage,
            ActivePolicyCount = activeCount
        }));
    }
}

public class CancelPolicyRequest
{
    public string Reason { get; set; } = string.Empty;
}

public class RenewPolicyRequest
{
    public DateTime NewEndDate { get; set; }
}

public class PolicyTotalsDto
{
    public decimal TotalPremium { get; set; }
    public decimal TotalCoverage { get; set; }
    public int ActivePolicyCount { get; set; }
}
