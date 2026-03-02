using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Domain.Interfaces
{
    public interface IPolicyRepository
    {
        Task<Policy?> GetByIdAsync(int id);
        Task<Policy?> GetByNumberAsync(string policyNumber);
        Task<IEnumerable<Policy>> GetAllAsync();
        Task<IEnumerable<Policy>> GetByTenantIdAsync(int tenantId);
        Task<IEnumerable<Policy>> GetByStatusAsync(PolicyStatus status);
        Task AddAsync(Policy policy);
        Task UpdateAsync(Policy policy);
        Task DeleteAsync(int id);
        Task<int> CountAsync();
        Task<int> CountActiveAsync();
        Task<decimal> GetTotalPremiumAsync();
        Task<IEnumerable<Policy>> GetExpiringPoliciesAsync(DateTime from, DateTime to);
    }
}
