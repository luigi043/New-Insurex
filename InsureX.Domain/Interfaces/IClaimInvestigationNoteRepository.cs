using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Domain.Interfaces;

public interface IClaimInvestigationNoteRepository : IRepository<ClaimInvestigationNote>
{
    Task<IEnumerable<ClaimInvestigationNote>> GetByClaimIdAsync(int claimId, int tenantId);
    Task<IEnumerable<ClaimInvestigationNote>> GetByAuthorIdAsync(int authorId, int tenantId);
    Task<IEnumerable<ClaimInvestigationNote>> GetByNoteTypeAsync(InvestigationNoteType noteType, int tenantId);
    Task<IEnumerable<ClaimInvestigationNote>> GetUnresolvedAsync(int tenantId);
    Task<IEnumerable<ClaimInvestigationNote>> GetByPriorityAsync(InvestigationPriority priority, int tenantId);
    Task<IEnumerable<ClaimInvestigationNote>> GetWithFollowUpDueAsync(DateTime beforeDate, int tenantId);
}
