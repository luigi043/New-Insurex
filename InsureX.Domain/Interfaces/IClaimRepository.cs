using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Domain.Interfaces;

public interface IClaimRepository : IRepository<Claim>
{
    Task<Claim?> GetByClaimNumberAsync(string claimNumber);
    Task<IEnumerable<Claim>> GetByPolicyIdAsync(int policyId);
    Task<IEnumerable<Claim>> GetByStatusAsync(ClaimStatus status);
    Task<IEnumerable<Claim>> GetByStatusAndTenantAsync(ClaimStatus status, int tenantId);
    Task<IEnumerable<Claim>> GetByDateRangeAsync(DateTime from, DateTime to);
    Task<decimal> GetTotalClaimedAmountAsync(int tenantId);
    Task<decimal> GetTotalPaidAmountAsync(int tenantId);
    Task<IEnumerable<Claim>> GetPendingClaimsAsync(int tenantId);
    Task<IEnumerable<Claim>> GetClaimsByAssetIdAsync(int assetId);
}
