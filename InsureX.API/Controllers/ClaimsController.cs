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
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<Claim>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] PaginationRequest request)
    {
        var claims = await _claimService.GetAllAsync(request);
        return Ok(ApiResponse<PagedResult<Claim>>.SuccessResponse(claims));
    }

    [HttpGet("filter")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<Claim>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Filter([FromQuery] ClaimFilterRequest request)
    {
        var claims = await _claimService.FilterAsync(request);
        return Ok(ApiResponse<PagedResult<Claim>>.SuccessResponse(claims));
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<Claim>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var claim = await _claimService.GetByIdAsync(id);
        if (claim == null)
            return NotFound(ApiResponse.ErrorResponse("Claim not found"));
        
        return Ok(ApiResponse<Claim>.SuccessResponse(claim));
    }

    [HttpGet("number/{claimNumber}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<Claim>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByClaimNumber(string claimNumber)
    {
        var claim = await _claimService.GetByClaimNumberAsync(claimNumber);
        if (claim == null)
            return NotFound(ApiResponse.ErrorResponse("Claim not found"));
        
        return Ok(ApiResponse<Claim>.SuccessResponse(claim));
    }

    [HttpGet("policy/{policyId:int}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<Claim>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByPolicy(int policyId, [FromQuery] PaginationRequest request)
    {
        var claims = await _claimService.GetByPolicyIdAsync(policyId, request);
        return Ok(ApiResponse<PagedResult<Claim>>.SuccessResponse(claims));
    }

    [HttpGet("status/{status}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Claim>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByStatus(ClaimStatus status)
    {
        var claims = await _claimService.GetByStatusAsync(status);
        return Ok(ApiResponse<IEnumerable<Claim>>.SuccessResponse(claims));
    }

    [HttpGet("pending")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Claim>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPending()
    {
        var claims = await _claimService.GetPendingClaimsAsync();
        return Ok(ApiResponse<IEnumerable<Claim>>.SuccessResponse(claims));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Insurer,Broker,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<Claim>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] Claim claim)
    {
        var created = await _claimService.CreateAsync(claim);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, 
            ApiResponse<Claim>.SuccessResponse(created, "Claim created successfully"));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<Claim>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] Claim claim)
    {
        claim.Id = id;
        var updated = await _claimService.UpdateAsync(claim);
        return Ok(ApiResponse<Claim>.SuccessResponse(updated, "Claim updated successfully"));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        await _claimService.DeleteAsync(id);
        return Ok(ApiResponse.SuccessResponse("Claim deleted successfully"));
    }

    [HttpPost("{id:int}/submit")]
    [Authorize(Roles = "Admin,Insurer,Broker,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<Claim>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Submit(int id)
    {
        var claim = await _claimService.SubmitAsync(id);
        return Ok(ApiResponse<Claim>.SuccessResponse(claim, "Claim submitted successfully"));
    }

    [HttpPost("{id:int}/approve")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<Claim>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Approve(int id, [FromBody] ApproveClaimRequest request)
    {
        var claim = await _claimService.ApproveAsync(id, request.ApprovedAmount, request.Notes);
        return Ok(ApiResponse<Claim>.SuccessResponse(claim, "Claim approved successfully"));
    }

    [HttpPost("{id:int}/reject")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<Claim>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Reject(int id, [FromBody] RejectClaimRequest request)
    {
        var claim = await _claimService.RejectAsync(id, request.Reason);
        return Ok(ApiResponse<Claim>.SuccessResponse(claim, "Claim rejected successfully"));
    }

    [HttpPost("{id:int}/pay")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<Claim>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> MarkAsPaid(int id, [FromBody] PayClaimRequest request)
    {
        var claim = await _claimService.MarkAsPaidAsync(id, request.PaymentReference);
        return Ok(ApiResponse<Claim>.SuccessResponse(claim, "Claim marked as paid successfully"));
    }

    [HttpPost("{id:int}/close")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<Claim>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Close(int id, [FromBody] CloseClaimRequest? request)
    {
        var claim = await _claimService.CloseAsync(id, request?.Notes);
        return Ok(ApiResponse<Claim>.SuccessResponse(claim, "Claim closed successfully"));
    }

    [HttpPost("{id:int}/investigation-notes")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<ClaimInvestigationNote>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddInvestigationNote(int id, [FromBody] AddInvestigationNoteRequest request)
    {
        var note = await _claimService.AddInvestigationNoteAsync(id, request.Note, request.IsInternal);
        return Ok(ApiResponse<ClaimInvestigationNote>.SuccessResponse(note, "Investigation note added"));
    }

    [HttpGet("summary/totals")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<ClaimTotalsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTotals()
    {
        var totalClaimed = await _claimService.GetTotalClaimedAmountAsync();
        var totalPaid = await _claimService.GetTotalPaidAmountAsync();
        
        return Ok(ApiResponse<ClaimTotalsDto>.SuccessResponse(new ClaimTotalsDto
        {
            TotalClaimed = totalClaimed,
            TotalPaid = totalPaid
        }));
    }
}

public class ApproveClaimRequest
{
    public decimal ApprovedAmount { get; set; }
    public string? Notes { get; set; }
}

public class RejectClaimRequest
{
    public string Reason { get; set; } = string.Empty;
}

public class PayClaimRequest
{
    public string PaymentReference { get; set; } = string.Empty;
}

public class CloseClaimRequest
{
    public string? Notes { get; set; }
}

public class AddInvestigationNoteRequest
{
    public string Note { get; set; } = string.Empty;
    public bool IsInternal { get; set; } = true;
}

public class ClaimTotalsDto
{
    public decimal TotalClaimed { get; set; }
    public decimal TotalPaid { get; set; }
}
