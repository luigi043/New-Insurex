using InsureX.Application.DTOs;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Application.Interfaces;

public interface IClaimInvestigationNoteService
{
    Task<IEnumerable<ClaimInvestigationNote>> GetByClaimIdAsync(int claimId);
    Task<ClaimInvestigationNote?> GetByIdAsync(int id);
    Task<ClaimInvestigationNote> CreateAsync(int claimId, ClaimInvestigationNote note);
    Task<ClaimInvestigationNote> UpdateAsync(ClaimInvestigationNote note);
    Task DeleteAsync(int id);
    Task<ClaimInvestigationNote> ResolveAsync(int noteId, string? resolutionNotes = null);
    Task<IEnumerable<ClaimInvestigationNote>> GetUnresolvedAsync();
    Task<IEnumerable<ClaimInvestigationNote>> GetByPriorityAsync(InvestigationPriority priority);
    Task<IEnumerable<ClaimInvestigationNote>> GetFollowUpsDueAsync(DateTime? beforeDate = null);
}
