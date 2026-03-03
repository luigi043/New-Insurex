using InsureX.Application.DTOs.Filters;
using InsureX.Application.DTOs;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Application.Interfaces;

public interface IClaimService
{
    Task<PagedResult<Claim>> GetAllAsync(PaginationRequest request);
    Task<Claim?> GetByIdAsync(int id);
    Task<Claim?> GetByClaimNumberAsync(string claimNumber);
    Task<PagedResult<Claim>> GetByPolicyIdAsync(int policyId, PaginationRequest request);
    Task<IEnumerable<Claim>> GetByStatusAsync(ClaimStatus status);
    Task<IEnumerable<Claim>> GetPendingClaimsAsync();
    Task<PagedResult<Claim>> FilterAsync(ClaimFilterRequest request);
    Task<Claim> CreateAsync(Claim claim);
    Task<Claim> UpdateAsync(Claim claim);
    Task DeleteAsync(int id);
    Task<Claim> SubmitAsync(int claimId);
    Task<Claim> ApproveAsync(int claimId, decimal approvedAmount, string? notes = null);
    Task<Claim> RejectAsync(int claimId, string reason);
    Task<Claim> MarkAsPaidAsync(int claimId, string paymentReference);
    Task<Claim> CloseAsync(int claimId, string? notes = null);
    Task<ClaimInvestigationNote> AddInvestigationNoteAsync(int claimId, string note, bool isInternal = true);
    Task<decimal> GetTotalClaimedAmountAsync();
    Task<decimal> GetTotalPaidAmountAsync();
}
