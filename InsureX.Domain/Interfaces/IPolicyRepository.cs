using InsureX.Domain.Entities;

namespace InsureX.Domain.Interfaces
{
    public interface IPolicyRepository
    {
        Task<Policy?> GetByIdAsync(Guid id);
        Task<Policy?> GetByNumberAsync(string policyNumber);
        Task<IEnumerable<Policy>> GetAllAsync();
        Task<IEnumerable<Policy>> GetByClientIdAsync(Guid clientId);
        Task<IEnumerable<Policy>> GetByStatusAsync(PolicyStatus status);
        Task<Policy> AddAsync(Policy policy);
        Task UpdateAsync(Policy policy);
        Task DeleteAsync(Guid id);
        Task<int> CountAsync();
        Task<int> CountActiveAsync();
        Task<decimal> GetTotalCoverageAsync();
        Task<decimal> GetTotalPremiumAsync();
    }
}