using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class ClaimInvestigationNoteRepository : Repository<ClaimInvestigationNote>, IClaimInvestigationNoteRepository
{
    public ClaimInvestigationNoteRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetByClaimIdAsync(int claimId)
    {
        return await _dbSet
            .Include(n => n.CreatedByUser)
            .Where(n => n.ClaimId == claimId)
            .OrderByDescending(n => n.NoteDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetByClaimIdAndTypeAsync(int claimId, string noteType)
    {
        return await _dbSet
            .Include(n => n.CreatedByUser)
            .Where(n => n.ClaimId == claimId && n.NoteType == noteType)
            .OrderByDescending(n => n.NoteDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetInternalNotesAsync(int claimId)
    {
        return await _dbSet
            .Include(n => n.CreatedByUser)
            .Where(n => n.ClaimId == claimId && n.IsInternal)
            .OrderByDescending(n => n.NoteDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetCustomerFacingNotesAsync(int claimId)
    {
        return await _dbSet
            .Include(n => n.CreatedByUser)
            .Where(n => n.ClaimId == claimId && !n.IsInternal)
            .OrderByDescending(n => n.NoteDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetByDateRangeAsync(int claimId, DateTime from, DateTime to)
    {
        return await _dbSet
            .Include(n => n.CreatedByUser)
            .Where(n => n.ClaimId == claimId && n.NoteDate >= from && n.NoteDate <= to)
            .OrderByDescending(n => n.NoteDate)
            .ToListAsync();
    }
}
