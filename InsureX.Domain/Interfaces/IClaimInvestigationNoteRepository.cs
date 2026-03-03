using InsureX.Domain.Entities;
<<<<<<< HEAD
=======
using InsureX.Domain.Enums;
>>>>>>> main

namespace InsureX.Domain.Interfaces;

public interface IClaimInvestigationNoteRepository : IRepository<ClaimInvestigationNote>
{
<<<<<<< HEAD
    Task<IEnumerable<ClaimInvestigationNote>> GetByClaimIdAsync(int claimId);
    Task<IEnumerable<ClaimInvestigationNote>> GetByClaimIdAndTypeAsync(int claimId, string noteType);
    Task<IEnumerable<ClaimInvestigationNote>> GetInternalNotesAsync(int claimId);
    Task<IEnumerable<ClaimInvestigationNote>> GetCustomerFacingNotesAsync(int claimId);
    Task<IEnumerable<ClaimInvestigationNote>> GetByDateRangeAsync(int claimId, DateTime from, DateTime to);
=======
    Task<IEnumerable<ClaimInvestigationNote>> GetByClaimIdAsync(int claimId, int tenantId);
    Task<IEnumerable<ClaimInvestigationNote>> GetByAuthorIdAsync(int authorId, int tenantId);
    Task<IEnumerable<ClaimInvestigationNote>> GetByNoteTypeAsync(InvestigationNoteType noteType, int tenantId);
    Task<IEnumerable<ClaimInvestigationNote>> GetUnresolvedAsync(int tenantId);
    Task<IEnumerable<ClaimInvestigationNote>> GetByPriorityAsync(InvestigationPriority priority, int tenantId);
    Task<IEnumerable<ClaimInvestigationNote>> GetWithFollowUpDueAsync(DateTime beforeDate, int tenantId);
>>>>>>> main
}
