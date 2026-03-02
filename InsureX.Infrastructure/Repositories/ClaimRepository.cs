using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories
{
    public class ClaimRepository : IClaimRepository
    {
        private readonly ApplicationDbContext _context;

        public ClaimRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Claim?> GetByIdAsync(Guid id)
            => await _context.Claims.FindAsync(id);

        public async Task<Claim?> GetByNumberAsync(string claimNumber)
            => await _context.Claims.FirstOrDefaultAsync(c => c.ClaimNumber == claimNumber);

        public async Task<IEnumerable<Claim>> GetAllAsync()
            => await _context.Claims.ToListAsync();

        public async Task<IEnumerable<Claim>> GetByPolicyIdAsync(Guid policyId)
            => await _context.Claims.Where(c => c.PolicyId == policyId).ToListAsync();

        public async Task<IEnumerable<Claim>> GetByStatusAsync(ClaimStatus status)
            => await _context.Claims.Where(c => c.Status == status).ToListAsync();

        public async Task<IEnumerable<Claim>> GetByClientIdAsync(Guid clientId)
            => await _context.Claims.Where(c => c.ClientId == clientId).ToListAsync();

        public async Task<Claim> AddAsync(Claim claim)
        {
            _context.Claims.Add(claim);
            await _context.SaveChangesAsync();
            return claim;
        }

        public async Task UpdateAsync(Claim claim)
        {
            _context.Claims.Update(claim);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var claim = await GetByIdAsync(id);
            if (claim != null)
            {
                _context.Claims.Remove(claim);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> CountAsync()
            => await _context.Claims.CountAsync();

        public async Task<int> CountByStatusAsync(ClaimStatus status)
            => await _context.Claims.CountAsync(c => c.Status == status);

        public async Task<decimal> GetTotalClaimedAmountAsync()
            => await _context.Claims.SumAsync(c => c.ClaimedAmount);

        public async Task<decimal> GetTotalApprovedAmountAsync()
            => await _context.Claims
                .Where(c => c.Status == ClaimStatus.Approved)
                .SumAsync(c => c.ApprovedAmount ?? 0);
    }
}
