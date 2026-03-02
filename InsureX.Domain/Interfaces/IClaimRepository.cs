using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Domain.Interfaces
{
    public interface IClaimRepository
    {
        Task<Claim?> GetByIdAsync(Guid id);
        Task<Claim?> GetByNumberAsync(string claimNumber);
        Task<IEnumerable<Claim>> GetAllAsync();
        Task<IEnumerable<Claim>> GetByPolicyIdAsync(Guid policyId);
        Task<IEnumerable<Claim>> GetByStatusAsync(ClaimStatus status);
        Task<IEnumerable<Claim>> GetByClientIdAsync(Guid clientId);
        Task AddAsync(Claim claim);
        Task UpdateAsync(Claim claim);
        Task DeleteAsync(Guid id);
        Task<int> CountAsync();
        Task<int> CountByStatusAsync(ClaimStatus status);
        Task<decimal> GetTotalClaimedAmountAsync();
        Task<decimal> GetTotalApprovedAmountAsync();
    }
}
