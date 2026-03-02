// InsureX.Infrastructure/Repositories/ClaimRepository.cs
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class ClaimRepository : Repository<Claim>, IClaimRepository
{
    public ClaimRepository(ApplicationDbContext context) : base(context) { }

    public async Task<IEnumerable<Claim>> GetAllByTenantAsync(Guid tenantId)
    {
        return await _context.Claims
            .Include(c => c.Policy)
            .Where(c => c.TenantId == tenantId)
            .OrderByDescending(c => c.SubmittedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Claim>> GetByPolicyIdAsync(int policyId)
    {
        return await _context.Claims
            .Where(c => c.PolicyId == policyId)
            .OrderByDescending(c => c.SubmittedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Claim>> GetByStatusAndTenantAsync(ClaimStatus status, Guid tenantId)
    {
        return await _context.Claims
            .Include(c => c.Policy)
            .Where(c => c.Status == status && c.TenantId == tenantId)
            .ToListAsync();
    }

    public async Task<Claim?> GetByClaimNumberAsync(string claimNumber)
    {
        return await _context.Claims
            .Include(c => c.Policy)
            .FirstOrDefaultAsync(c => c.ClaimNumber == claimNumber);
    }

    public async Task<int> CountAsync()
    {
        return await _context.Claims.CountAsync();
    }
}