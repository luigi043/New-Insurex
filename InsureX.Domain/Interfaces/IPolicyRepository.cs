using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Domain.Interfaces
{
    public interface IPolicyRepository
    {
        Task<Policy?> GetByIdAsync(Guid id);
        Task<Policy?> GetByNumberAsync(string policyNumber);
        Task<IEnumerable<Policy>> GetAllAsync();
        Task<IEnumerable<Policy>> GetByClientIdAsync(Guid clientId);
        Task<IEnumerable<Policy>> GetByStatusAsync(PolicyStatus status);
        Task AddAsync(Policy policy);
        Task UpdateAsync(Policy policy);
        Task DeleteAsync(Guid id);
        Task<int> CountAsync();
        Task<int> CountActiveAsync();
        Task<decimal> GetTotalCoverageAsync();
        Task<decimal> GetTotalPremiumAsync();
        Task<IEnumerable<Policy>> GetExpiringPoliciesAsync(DateTime from, DateTime to);
        Task<IEnumerable<Policy>> GetPoliciesByDateRangeAsync(DateTime from, DateTime to);
        Task<int> CountActivePoliciesAsOfDateAsync(DateTime date);
        Task<decimal> GetTotalPremiumByDateRangeAsync(DateTime from, DateTime to);
    }
}
