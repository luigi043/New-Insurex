using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories
{
    public class PolicyRepository : IPolicyRepository
    {
        private readonly ApplicationDbContext _context;

        public PolicyRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Policy?> GetByIdAsync(Guid id)
            => await _context.Policies.FindAsync(id);

        public async Task<Policy?> GetByNumberAsync(string policyNumber)
            => await _context.Policies.FirstOrDefaultAsync(p => p.PolicyNumber == policyNumber);

        public async Task<IEnumerable<Policy>> GetAllAsync()
            => await _context.Policies.ToListAsync();

        public async Task<IEnumerable<Policy>> GetByClientIdAsync(Guid clientId)
            => await _context.Policies.Where(p => p.ClientId == clientId).ToListAsync();

        public async Task<IEnumerable<Policy>> GetByStatusAsync(PolicyStatus status)
            => await _context.Policies.Where(p => p.Status == status).ToListAsync();

        public async Task<Policy> AddAsync(Policy policy)
        {
            _context.Policies.Add(policy);
            await _context.SaveChangesAsync();
            return policy;
        }

        public async Task UpdateAsync(Policy policy)
        {
            _context.Policies.Update(policy);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var policy = await GetByIdAsync(id);
            if (policy != null)
            {
                _context.Policies.Remove(policy);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> CountAsync()
            => await _context.Policies.CountAsync();

        public async Task<int> CountActiveAsync()
            => await _context.Policies.CountAsync(p => p.Status == PolicyStatus.Active);

        public async Task<decimal> GetTotalCoverageAsync()
            => await _context.Policies.SumAsync(p => p.CoverageAmount);

        public async Task<decimal> GetTotalPremiumAsync()
            => await _context.Policies.SumAsync(p => p.Premium);

        // Date-based methods
        public async Task<IEnumerable<Policy>> GetExpiringPoliciesAsync(DateTime from, DateTime to)
        {
            return await _context.Policies
                .Where(p => p.EndDate >= from && p.EndDate <= to)
                .OrderBy(p => p.EndDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Policy>> GetPoliciesByDateRangeAsync(DateTime from, DateTime to)
        {
            return await _context.Policies
                .Where(p => p.StartDate >= from && p.StartDate <= to)
                .ToListAsync();
        }

        public async Task<int> CountActivePoliciesAsOfDateAsync(DateTime date)
        {
            return await _context.Policies
                .CountAsync(p => p.StartDate <= date && p.EndDate >= date);
        }

        public async Task<decimal> GetTotalPremiumByDateRangeAsync(DateTime from, DateTime to)
        {
            return await _context.Policies
                .Where(p => p.StartDate >= from && p.StartDate <= to)
                .SumAsync(p => p.Premium);
        }
    }
}