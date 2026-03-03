using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Application.Interfaces;

public interface IClaimService
{
    Task<IEnumerable<Claim>> GetAllAsync();
    Task<Claim?> GetByIdAsync(int id);
    Task<Claim?> GetByClaimNumberAsync(string claimNumber);
    Task<IEnumerable<Claim>> GetByPolicyIdAsync(int policyId);
    Task<IEnumerable<Claim>> GetByStatusAsync(ClaimStatus status);
    Task<IEnumerable<Claim>> GetPendingClaimsAsync();
    Task<Claim> CreateAsync(Claim claim);
    Task<Claim> UpdateAsync(Claim claim);
    Task DeleteAsync(int id);
    Task<Claim> SubmitAsync(int claimId);
    Task<Claim> ApproveAsync(int claimId, decimal approvedAmount, string? notes = null);
    Task<Claim> RejectAsync(int claimId, string reason);
    Task<Claim> MarkAsPaidAsync(int claimId, string paymentReference);
    Task<Claim> CloseAsync(int claimId, string? notes = null);
    Task<decimal> GetTotalClaimedAmountAsync();
    Task<decimal> GetTotalPaidAmountAsync();
}
