using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Domain.Interfaces;

public interface IPolicyRepository : IRepository<Policy>
{
    Task<Policy?> GetByPolicyNumberAsync(string policyNumber);
    Task<IEnumerable<Policy>> GetByStatusAsync(PolicyStatus status);
    Task<IEnumerable<Policy>> GetByStatusAndTenantAsync(PolicyStatus status, int tenantId);
    Task<IEnumerable<Policy>> GetByTypeAsync(PolicyType type);
    Task<IEnumerable<Policy>> GetExpiringPoliciesAsync(DateTime from, DateTime to);
    Task<IEnumerable<Policy>> GetByInsuredIdAsync(int insuredId);
    Task<IEnumerable<Policy>> GetByBrokerIdAsync(int brokerId);
    Task<decimal> GetTotalPremiumAsync(int tenantId);
    Task<decimal> GetTotalCoverageAsync(int tenantId);
    Task<int> GetActivePolicyCountAsync(int tenantId);
}
