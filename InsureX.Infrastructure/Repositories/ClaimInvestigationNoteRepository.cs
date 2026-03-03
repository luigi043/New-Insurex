using InsureX.Domain.Entities;
<<<<<<< HEAD
=======
using InsureX.Domain.Enums;
>>>>>>> main
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class ClaimInvestigationNoteRepository : Repository<ClaimInvestigationNote>, IClaimInvestigationNoteRepository
{
    public ClaimInvestigationNoteRepository(ApplicationDbContext context) : base(context)
    {
    }

<<<<<<< HEAD
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
=======
    public async Task<IEnumerable<ClaimInvestigationNote>> GetByClaimIdAsync(int claimId, int tenantId)
    {
        return await _dbSet
            .Include(n => n.Author)
            .Include(n => n.ResolvedBy)
            .Where(n => n.ClaimId == claimId && n.TenantId == tenantId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetByAuthorIdAsync(int authorId, int tenantId)
    {
        return await _dbSet
            .Include(n => n.Claim)
            .Where(n => n.AuthorId == authorId && n.TenantId == tenantId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetByNoteTypeAsync(InvestigationNoteType noteType, int tenantId)
    {
        return await _dbSet
            .Include(n => n.Claim)
            .Include(n => n.Author)
            .Where(n => n.NoteType == noteType && n.TenantId == tenantId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetUnresolvedAsync(int tenantId)
    {
        return await _dbSet
            .Include(n => n.Claim)
            .Include(n => n.Author)
            .Where(n => !n.IsResolved && n.TenantId == tenantId)
            .OrderByDescending(n => n.Priority)
            .ThenBy(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetByPriorityAsync(InvestigationPriority priority, int tenantId)
    {
        return await _dbSet
            .Include(n => n.Claim)
            .Include(n => n.Author)
            .Where(n => n.Priority == priority && n.TenantId == tenantId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<ClaimInvestigationNote>> GetWithFollowUpDueAsync(DateTime beforeDate, int tenantId)
    {
        return await _dbSet
            .Include(n => n.Claim)
            .Include(n => n.Author)
            .Where(n => n.FollowUpDate.HasValue &&
                       n.FollowUpDate <= beforeDate &&
                       !n.IsResolved &&
                       n.TenantId == tenantId)
            .OrderBy(n => n.FollowUpDate)
>>>>>>> main
            .ToListAsync();
    }
}
