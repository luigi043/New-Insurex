using InsureX.Application.DTOs;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Application.Interfaces;

public interface IPolicyService
{
    Task<PagedResult<Policy>> GetAllAsync(PaginationRequest request);
    Task<Policy?> GetByIdAsync(int id);
    Task<Policy?> GetByPolicyNumberAsync(string policyNumber);
    Task<IEnumerable<Policy>> GetByStatusAsync(PolicyStatus status);
    Task<IEnumerable<Policy>> GetByTypeAsync(PolicyType type);
    Task<PagedResult<Policy>> GetExpiringPoliciesAsync(DateTime from, DateTime to, PaginationRequest request);
    Task<PagedResult<Policy>> FilterAsync(PolicyFilterRequest request);
    Task<Policy> CreateAsync(Policy policy);
    Task<Policy> UpdateAsync(Policy policy);
    Task DeleteAsync(int id);
    Task<Policy> ActivateAsync(int policyId);
    Task<Policy> CancelAsync(int policyId, string reason);
    Task<Policy> RenewAsync(int policyId, DateTime newEndDate);
    Task<decimal> GetTotalPremiumAsync();
    Task<decimal> GetTotalCoverageAsync();
    Task<int> GetActivePolicyCountAsync();
}
