using InsureX.Application.DTOs.Dashboard;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;

namespace InsureX.Application.Services.Dashboard;

public class DashboardService : IDashboardService
{
    private readonly IPolicyRepository _policyRepository;
    private readonly IClaimRepository _claimRepository;
    private readonly IAssetRepository _assetRepository;
    private readonly IUserRepository _userRepository;

    public DashboardService(
        IPolicyRepository policyRepository,
        IClaimRepository claimRepository,
        IAssetRepository assetRepository,
        IUserRepository userRepository)
    {
        _policyRepository = policyRepository;
        _claimRepository = claimRepository;
        _assetRepository = assetRepository;
        _userRepository = userRepository;
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var totalPolicies = await _policyRepository.CountAsync();
        var totalClaims = await _claimRepository.CountAsync();
        var totalAssets = await _assetRepository.CountAsync();
        var totalUsers = await _userRepository.CountAsync();
        var activeClaims = await _claimRepository.CountByStatusAsync(ClaimStatus.UnderReview);
        var totalClaimedAmount = await _claimRepository.GetTotalClaimedAmountAsync();
        var totalAssetValue = await _assetRepository.GetTotalValueAsync();

        return new DashboardStatsDto
        {
            TotalPolicies = totalPolicies,
            TotalClaims = totalClaims,
            TotalAssets = totalAssets,
            TotalUsers = totalUsers,
            ActiveClaims = activeClaims,
            TotalClaimedAmount = totalClaimedAmount,
            TotalAssetValue = totalAssetValue
        };
    }

    public async Task<FinancialSummaryDto> GetFinancialSummaryAsync(DateTime startDate, DateTime endDate)
    {
        var totalClaimedAmount = await _claimRepository.GetTotalClaimedAmountAsync();
        var totalApprovedAmount = await _claimRepository.GetTotalApprovedAmountAsync();
        var totalAssetValue = await _assetRepository.GetTotalValueAsync();

        return new FinancialSummaryDto
        {
            StartDate = startDate,
            EndDate = endDate,
            TotalClaimedAmount = totalClaimedAmount,
            TotalApprovedAmount = totalApprovedAmount,
            TotalAssetValue = totalAssetValue
        };
    }

    public async Task<List<MonthlyStatsDto>> GetMonthlyStatsAsync(int year)
    {
        var stats = new List<MonthlyStatsDto>();
        for (int month = 1; month <= 12; month++)
        {
            stats.Add(new MonthlyStatsDto { Month = month, Year = year });
        }
        return await Task.FromResult(stats);
    }

    public async Task<List<PolicyTypeStatsDto>> GetPolicyTypeStatsAsync()
    {
        return await Task.FromResult(new List<PolicyTypeStatsDto>());
    }

    public async Task<List<ClaimStatusStatsDto>> GetClaimStatusStatsAsync()
    {
        var stats = new List<ClaimStatusStatsDto>();
        foreach (ClaimStatus status in Enum.GetValues<ClaimStatus>())
        {
            var count = await _claimRepository.CountByStatusAsync(status);
            if (count > 0)
                stats.Add(new ClaimStatusStatsDto { Status = status.ToString(), Count = count });
        }
        return stats;
    }

    public async Task<List<AssetTypeStatsDto>> GetAssetTypeStatsAsync()
    {
        var countByType = await _assetRepository.GetCountByTypeAsync();
        return countByType.Select(kvp => new AssetTypeStatsDto
        {
            AssetType = kvp.Key.ToString(),
            Count = kvp.Value
        }).ToList();
    }
}
