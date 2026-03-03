using InsureX.Application.DTOs;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/claims/{claimId:int}/investigation-notes")]
[Authorize]
[Produces("application/json")]
public class ClaimInvestigationNotesController : ControllerBase
{
    private readonly IClaimInvestigationNoteService _noteService;
    private readonly ILogger<ClaimInvestigationNotesController> _logger;

    public ClaimInvestigationNotesController(
        IClaimInvestigationNoteService noteService,
        ILogger<ClaimInvestigationNotesController> logger)
    {
        _noteService = noteService;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ClaimInvestigationNote>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByClaimId(int claimId)
    {
        var notes = await _noteService.GetByClaimIdAsync(claimId);
        return Ok(ApiResponse<IEnumerable<ClaimInvestigationNote>>.SuccessResponse(notes));
    }

    [HttpGet("{noteId:int}")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<ClaimInvestigationNote>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int claimId, int noteId)
    {
        var note = await _noteService.GetByIdAsync(noteId);
        if (note == null || note.ClaimId != claimId)
            return NotFound(ApiResponse.ErrorResponse("Investigation note not found"));

        return Ok(ApiResponse<ClaimInvestigationNote>.SuccessResponse(note));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<ClaimInvestigationNote>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(int claimId, [FromBody] ClaimInvestigationNote note)
    {
        var created = await _noteService.CreateAsync(claimId, note);
        return CreatedAtAction(nameof(GetById), new { claimId, noteId = created.Id },
            ApiResponse<ClaimInvestigationNote>.SuccessResponse(created, "Investigation note created successfully"));
    }

    [HttpPut("{noteId:int}")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<ClaimInvestigationNote>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int claimId, int noteId, [FromBody] ClaimInvestigationNote note)
    {
        note.Id = noteId;
        note.ClaimId = claimId;
        var updated = await _noteService.UpdateAsync(note);
        return Ok(ApiResponse<ClaimInvestigationNote>.SuccessResponse(updated, "Investigation note updated successfully"));
    }

    [HttpDelete("{noteId:int}")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int claimId, int noteId)
    {
        await _noteService.DeleteAsync(noteId);
        return Ok(ApiResponse.SuccessResponse("Investigation note deleted successfully"));
    }

    [HttpPost("{noteId:int}/resolve")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<ClaimInvestigationNote>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Resolve(int claimId, int noteId, [FromBody] ResolveNoteRequest? request)
    {
        var resolved = await _noteService.ResolveAsync(noteId, request?.Notes);
        return Ok(ApiResponse<ClaimInvestigationNote>.SuccessResponse(resolved, "Investigation note resolved"));
    }

    [HttpGet("/api/investigation-notes/unresolved")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ClaimInvestigationNote>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUnresolved()
    {
        var notes = await _noteService.GetUnresolvedAsync();
        return Ok(ApiResponse<IEnumerable<ClaimInvestigationNote>>.SuccessResponse(notes));
    }

    [HttpGet("/api/investigation-notes/priority/{priority}")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ClaimInvestigationNote>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByPriority(InvestigationPriority priority)
    {
        var notes = await _noteService.GetByPriorityAsync(priority);
        return Ok(ApiResponse<IEnumerable<ClaimInvestigationNote>>.SuccessResponse(notes));
    }

    [HttpGet("/api/investigation-notes/follow-ups")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ClaimInvestigationNote>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFollowUpsDue([FromQuery] DateTime? beforeDate)
    {
        var notes = await _noteService.GetFollowUpsDueAsync(beforeDate);
        return Ok(ApiResponse<IEnumerable<ClaimInvestigationNote>>.SuccessResponse(notes));
    }
}

public class ResolveNoteRequest
{
    public string? Notes { get; set; }
}
