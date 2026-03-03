using InsureX.Application.DTOs;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/claims/{claimId}/investigation-notes")]
[Authorize]
public class ClaimInvestigationNotesController : ControllerBase
{
    private readonly IClaimInvestigationNoteRepository _noteRepository;
    private readonly IClaimRepository _claimRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<ClaimInvestigationNotesController> _logger;

    public ClaimInvestigationNotesController(
        IClaimInvestigationNoteRepository noteRepository,
        IClaimRepository claimRepository,
        ICurrentUserService currentUserService,
        ILogger<ClaimInvestigationNotesController> logger)
    {
        _noteRepository = noteRepository;
        _claimRepository = claimRepository;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClaimInvestigationNoteResponseDto>>> GetNotes(
        int claimId,
        [FromQuery] string? noteType = null,
        [FromQuery] bool? internalOnly = null)
    {
        var claim = await _claimRepository.GetByIdAsync(claimId);
        if (claim == null)
            return NotFound(new { message = "Claim not found" });

        IEnumerable<ClaimInvestigationNote> notes;

        if (!string.IsNullOrEmpty(noteType))
        {
            notes = await _noteRepository.GetByClaimIdAndTypeAsync(claimId, noteType);
        }
        else if (internalOnly.HasValue && internalOnly.Value)
        {
            notes = await _noteRepository.GetInternalNotesAsync(claimId);
        }
        else if (internalOnly.HasValue && !internalOnly.Value)
        {
            notes = await _noteRepository.GetCustomerFacingNotesAsync(claimId);
        }
        else
        {
            notes = await _noteRepository.GetByClaimIdAsync(claimId);
        }

        var response = notes.Select(n => new ClaimInvestigationNoteResponseDto
        {
            Id = n.Id,
            ClaimId = n.ClaimId,
            NoteType = n.NoteType,
            Subject = n.Subject,
            Content = n.Content,
            AttachmentUrls = string.IsNullOrEmpty(n.AttachmentUrls)
                ? null
                : JsonSerializer.Deserialize<List<string>>(n.AttachmentUrls),
            IsInternal = n.IsInternal,
            Tags = string.IsNullOrEmpty(n.Tags)
                ? null
                : JsonSerializer.Deserialize<List<string>>(n.Tags),
            NoteDate = n.NoteDate,
            CreatedBy = n.CreatedByUser?.Email ?? "Unknown",
            CreatedAt = n.CreatedAt
        });

        return Ok(response);
    }

    [HttpGet("{noteId}")]
    public async Task<ActionResult<ClaimInvestigationNoteResponseDto>> GetNote(int claimId, int noteId)
    {
        var note = await _noteRepository.GetByIdAsync(noteId);
        if (note == null || note.ClaimId != claimId)
            return NotFound(new { message = "Investigation note not found" });

        var response = new ClaimInvestigationNoteResponseDto
        {
            Id = note.Id,
            ClaimId = note.ClaimId,
            NoteType = note.NoteType,
            Subject = note.Subject,
            Content = note.Content,
            AttachmentUrls = string.IsNullOrEmpty(note.AttachmentUrls)
                ? null
                : JsonSerializer.Deserialize<List<string>>(note.AttachmentUrls),
            IsInternal = note.IsInternal,
            Tags = string.IsNullOrEmpty(note.Tags)
                ? null
                : JsonSerializer.Deserialize<List<string>>(note.Tags),
            NoteDate = note.NoteDate,
            CreatedBy = note.CreatedByUser?.Email ?? "Unknown",
            CreatedAt = note.CreatedAt
        };

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<ClaimInvestigationNoteResponseDto>> CreateNote(
        int claimId,
        [FromBody] CreateClaimInvestigationNoteDto dto)
    {
        var claim = await _claimRepository.GetByIdAsync(claimId);
        if (claim == null)
            return NotFound(new { message = "Claim not found" });

        if (dto.ClaimId != claimId)
            return BadRequest(new { message = "Claim ID mismatch" });

        var note = new ClaimInvestigationNote
        {
            ClaimId = claimId,
            TenantId = claim.TenantId,
            CreatedByUserId = _currentUserService.UserId ?? 0,
            NoteType = dto.NoteType,
            Subject = dto.Subject,
            Content = dto.Content,
            AttachmentUrls = dto.AttachmentUrls != null && dto.AttachmentUrls.Any()
                ? JsonSerializer.Serialize(dto.AttachmentUrls)
                : null,
            IsInternal = dto.IsInternal,
            Tags = dto.Tags != null && dto.Tags.Any()
                ? JsonSerializer.Serialize(dto.Tags)
                : null,
            NoteDate = DateTime.UtcNow,
            CreatedBy = _currentUserService.Email ?? "system"
        };

        await _noteRepository.AddAsync(note);

        _logger.LogInformation(
            "Investigation note created for claim {ClaimId} by user {UserId}",
            claimId,
            _currentUserService.UserId);

        var response = new ClaimInvestigationNoteResponseDto
        {
            Id = note.Id,
            ClaimId = note.ClaimId,
            NoteType = note.NoteType,
            Subject = note.Subject,
            Content = note.Content,
            AttachmentUrls = dto.AttachmentUrls,
            IsInternal = note.IsInternal,
            Tags = dto.Tags,
            NoteDate = note.NoteDate,
            CreatedBy = note.CreatedBy,
            CreatedAt = note.CreatedAt
        };

        return CreatedAtAction(
            nameof(GetNote),
            new { claimId = note.ClaimId, noteId = note.Id },
            response);
    }

    [HttpPut("{noteId}")]
    public async Task<ActionResult<ClaimInvestigationNoteResponseDto>> UpdateNote(
        int claimId,
        int noteId,
        [FromBody] UpdateClaimInvestigationNoteDto dto)
    {
        var note = await _noteRepository.GetByIdAsync(noteId);
        if (note == null || note.ClaimId != claimId)
            return NotFound(new { message = "Investigation note not found" });

        note.Subject = dto.Subject;
        note.Content = dto.Content;
        note.AttachmentUrls = dto.AttachmentUrls != null && dto.AttachmentUrls.Any()
            ? JsonSerializer.Serialize(dto.AttachmentUrls)
            : null;
        note.IsInternal = dto.IsInternal;
        note.Tags = dto.Tags != null && dto.Tags.Any()
            ? JsonSerializer.Serialize(dto.Tags)
            : null;
        note.UpdatedBy = _currentUserService.Email ?? "system";

        await _noteRepository.UpdateAsync(note);

        _logger.LogInformation(
            "Investigation note {NoteId} updated for claim {ClaimId} by user {UserId}",
            noteId,
            claimId,
            _currentUserService.UserId);

        var response = new ClaimInvestigationNoteResponseDto
        {
            Id = note.Id,
            ClaimId = note.ClaimId,
            NoteType = note.NoteType,
            Subject = note.Subject,
            Content = note.Content,
            AttachmentUrls = dto.AttachmentUrls,
            IsInternal = note.IsInternal,
            Tags = dto.Tags,
            NoteDate = note.NoteDate,
            CreatedBy = note.CreatedBy,
            CreatedAt = note.CreatedAt
        };

        return Ok(response);
    }

    [HttpDelete("{noteId}")]
    public async Task<IActionResult> DeleteNote(int claimId, int noteId)
    {
        var note = await _noteRepository.GetByIdAsync(noteId);
        if (note == null || note.ClaimId != claimId)
            return NotFound(new { message = "Investigation note not found" });

        await _noteRepository.DeleteAsync(note);

        _logger.LogInformation(
            "Investigation note {NoteId} deleted for claim {ClaimId} by user {UserId}",
            noteId,
            claimId,
            _currentUserService.UserId);

        return NoContent();
    }
}
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
