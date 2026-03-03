using InsureX.Domain.Entities;

namespace InsureX.Domain.Interfaces;

public interface IClaimInvestigationNoteRepository : IRepository<ClaimInvestigationNote>
{
    Task<IEnumerable<ClaimInvestigationNote>> GetByClaimIdAsync(int claimId);
    Task<IEnumerable<ClaimInvestigationNote>> GetByClaimIdAndTypeAsync(int claimId, string noteType);
    Task<IEnumerable<ClaimInvestigationNote>> GetInternalNotesAsync(int claimId);
    Task<IEnumerable<ClaimInvestigationNote>> GetCustomerFacingNotesAsync(int claimId);
    Task<IEnumerable<ClaimInvestigationNote>> GetByDateRangeAsync(int claimId, DateTime from, DateTime to);
}
