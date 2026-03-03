using InsureX.Application.DTOs;
using InsureX.Application.Exceptions;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace InsureX.Application.Services;

public class ClaimInvestigationNoteService : IClaimInvestigationNoteService
{
    private readonly IClaimInvestigationNoteRepository _noteRepository;
    private readonly IClaimRepository _claimRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ClaimInvestigationNoteService> _logger;

    public ClaimInvestigationNoteService(
        IClaimInvestigationNoteRepository noteRepository,
        IClaimRepository claimRepository,
        ITenantContext tenantContext,
        IUnitOfWork unitOfWork,
        ILogger<ClaimInvestigationNoteService> logger)
    {
        _noteRepository = noteRepository;
        _claimRepository = claimRepository;
        _tenantContext = tenantContext;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetByClaimIdAsync(int claimId)
    {
        var claim = await _claimRepository.GetByIdAsync(claimId);
        if (claim == null || claim.TenantId != _tenantContext.TenantId)
            throw new NotFoundException("Claim not found");

        return await _noteRepository.GetByClaimIdAsync(claimId, _tenantContext.TenantId);
    }

    public async Task<ClaimInvestigationNote?> GetByIdAsync(int id)
    {
        var note = await _noteRepository.GetByIdAsync(id);
        if (note == null || note.TenantId != _tenantContext.TenantId)
            return null;
        return note;
    }

    public async Task<ClaimInvestigationNote> CreateAsync(int claimId, ClaimInvestigationNote note)
    {
        var claim = await _claimRepository.GetByIdAsync(claimId);
        if (claim == null || claim.TenantId != _tenantContext.TenantId)
            throw new NotFoundException("Claim not found");

        if (string.IsNullOrWhiteSpace(note.Title))
            throw new ValidationException("Note title is required");

        if (string.IsNullOrWhiteSpace(note.Content))
            throw new ValidationException("Note content is required");

        note.ClaimId = claimId;
        note.TenantId = _tenantContext.TenantId;
        note.SetCreated("system");

        await _noteRepository.AddAsync(note);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation(
            "Investigation note created for Claim {ClaimId}: {Title}",
            claimId, note.Title);

        return note;
    }

    public async Task<ClaimInvestigationNote> UpdateAsync(ClaimInvestigationNote note)
    {
        var existing = await GetByIdAsync(note.Id);
        if (existing == null)
            throw new NotFoundException("Investigation note not found");

        if (string.IsNullOrWhiteSpace(note.Title))
            throw new ValidationException("Note title is required");

        existing.Title = note.Title;
        existing.Content = note.Content;
        existing.NoteType = note.NoteType;
        existing.Priority = note.Priority;
        existing.IsConfidential = note.IsConfidential;
        existing.AttachmentUrls = note.AttachmentUrls;
        existing.FollowUpDate = note.FollowUpDate;
        existing.SetUpdated("system");

        await _noteRepository.UpdateAsync(existing);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Investigation note {NoteId} updated", note.Id);

        return existing;
    }

    public async Task DeleteAsync(int id)
    {
        var note = await GetByIdAsync(id);
        if (note == null)
            throw new NotFoundException("Investigation note not found");

        await _noteRepository.DeleteAsync(note);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Investigation note {NoteId} deleted", id);
    }

    public async Task<ClaimInvestigationNote> ResolveAsync(int noteId, string? resolutionNotes = null)
    {
        var note = await GetByIdAsync(noteId);
        if (note == null)
            throw new NotFoundException("Investigation note not found");

        if (note.IsResolved)
            throw new ValidationException("Note is already resolved");

        note.IsResolved = true;
        note.ResolvedAt = DateTime.UtcNow;
        note.SetUpdated("system");

        if (!string.IsNullOrWhiteSpace(resolutionNotes))
            note.Content += $"\n\n--- Resolution ---\n{resolutionNotes}";

        await _noteRepository.UpdateAsync(note);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Investigation note {NoteId} resolved", noteId);

        return note;
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetUnresolvedAsync()
    {
        return await _noteRepository.GetUnresolvedAsync(_tenantContext.TenantId);
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetByPriorityAsync(InvestigationPriority priority)
    {
        return await _noteRepository.GetByPriorityAsync(priority, _tenantContext.TenantId);
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetFollowUpsDueAsync(DateTime? beforeDate = null)
    {
        var date = beforeDate ?? DateTime.UtcNow.AddDays(7);
        return await _noteRepository.GetWithFollowUpDueAsync(date, _tenantContext.TenantId);
    }
}
