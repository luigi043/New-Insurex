using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;

namespace InsureX.Application.Services.Dashboard;

public class DashboardService : IDashboardService
{
    private readonly IPolicyRepository _policyRepository;
    private readonly IClaimRepository _claimRepository;

    public DashboardService(
        IPolicyRepository policyRepository,
        IClaimRepository claimRepository)
    {
        _policyRepository = policyRepository;
        _claimRepository = claimRepository;
    }

    public async Task<DashboardDto> GetDashboardDataAsync(int tenantId)
    {
        var totalPolicies = await _policyRepository.CountAsync();
        var activePolicies = await _policyRepository.CountActiveAsync();
        var totalPremium = await _policyRepository.GetTotalPremiumAsync();
        
        var pendingClaims = await _claimRepository.CountByStatusAsync(ClaimStatus.Submitted);
        var totalClaims = await _claimRepository.CountAsync();
        var totalClaimed = await _claimRepository.GetTotalClaimedAmountAsync();

        return new DashboardDto
        {
            TotalPolicies = totalPolicies,
            ActivePolicies = activePolicies,
            TotalPremium = totalPremium,
            PendingClaims = pendingClaims,
            TotalClaims = totalClaims,
            TotalClaimedAmount = totalClaimed
        };
    }
}
