using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Domain.Interfaces;

public interface IClaimRepository
{
    Task<Claim?> GetByIdAsync(int id);
    Task<Claim?> GetByNumberAsync(string claimNumber);
    Task<IEnumerable<Claim>> GetAllAsync();
    Task<IEnumerable<Claim>> GetByPolicyIdAsync(int policyId);
    Task<IEnumerable<Claim>> GetByStatusAsync(ClaimStatus status);
    Task<IEnumerable<Claim>> GetByTenantIdAsync(int tenantId);
    Task AddAsync(Claim claim);
    Task UpdateAsync(Claim claim);
    Task DeleteAsync(int id);
    Task<int> CountAsync();
    Task<int> CountByStatusAsync(ClaimStatus status);
    Task<decimal> GetTotalClaimedAmountAsync();
    Task<decimal> GetTotalApprovedAmountAsync(); // Added missing method
}
