using InsureX.Application.DTOs.Dashboard;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;

namespace InsureX.Application.Services.Dashboard
{
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

        // NEW METHOD: GetDashboardStatsAsync
        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var totalPolicies = await _policyRepository.CountAsync();
            var activePolicies = await _policyRepository.CountActiveAsync();
            var totalClaims = await _claimRepository.CountAsync();
            var pendingClaims = await _claimRepository.CountByStatusAsync(ClaimStatus.Submitted) 
                + await _claimRepository.CountByStatusAsync(ClaimStatus.UnderReview);
            var totalAssets = await _assetRepository.CountAsync();
            var totalPremium = await _policyRepository.GetTotalPremiumAsync();

            return new DashboardStatsDto
            {
                TotalPolicies = totalPolicies,
                ActivePolicies = activePolicies,
                TotalClaims = totalClaims,
                PendingClaims = pendingClaims,
                TotalAssets = totalAssets,
                TotalPremium = totalPremium,
                MonthlyStats = await GetMonthlyStatsAsync(DateTime.UtcNow.Year),
                PolicyTypeStats = await GetPolicyTypeStatsAsync(),
                ClaimStatusStats = await GetClaimStatusStatsAsync(),
                AssetTypeStats = await GetAssetTypeStatsAsync()
            };
        }

        // NEW METHOD: GetFinancialSummaryAsync
        public async Task<FinancialSummaryDto> GetFinancialSummaryAsync(DateTime startDate, DateTime endDate)
        {
            var totalPremiums = await _policyRepository.GetTotalPremiumAsync();
            var totalClaimsPaid = await _claimRepository.GetTotalApprovedAmountAsync();
            
            var lossRatio = totalPremiums > 0 ? totalClaimsPaid / totalPremiums : 0;
            var profitMargin = totalPremiums - totalClaimsPaid;

            return new FinancialSummaryDto
            {
                TotalPremiums = totalPremiums,
                TotalClaimsPaid = totalClaimsPaid,
                LossRatio = lossRatio,
                ProfitMargin = profitMargin
            };
        }

        public async Task<List<MonthlyStatsDto>> GetMonthlyStatsAsync(int year)
        {
            // Implementation for monthly statistics
            var months = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
            var stats = new List<MonthlyStatsDto>();

            for (int i = 0; i < 12; i++)
            {
                stats.Add(new MonthlyStatsDto
                {
                    Month = months[i],
                    Policies = 0, // TODO: Implement actual query
                    Claims = 0,   // TODO: Implement actual query
                    Premium = 0   // TODO: Implement actual query
                });
            }

            return stats;
        }

        public async Task<List<PolicyTypeStatsDto>> GetPolicyTypeStatsAsync()
        {
            // Implementation for policy type statistics
            var types = Enum.GetValues<PolicyType>();
            var stats = new List<PolicyTypeStatsDto>();

            foreach (var type in types)
            {
                stats.Add(new PolicyTypeStatsDto
                {
                    Type = type.ToString(),
                    Count = 0,     // TODO: Implement actual query
                    Coverage = 0   // TODO: Implement actual query
                });
            }

            return stats;
        }

        public async Task<List<ClaimStatusStatsDto>> GetClaimStatusStatsAsync()
        {
            // Implementation for claim status statistics
            var statuses = Enum.GetValues<ClaimStatus>();
            var stats = new List<ClaimStatusStatsDto>();

            foreach (var status in statuses)
            {
                var count = await _claimRepository.CountByStatusAsync(status);
                stats.Add(new ClaimStatusStatsDto
                {
                    Status = status.ToString(),
                    Count = count,
                    Amount = 0 // TODO: Implement actual amount query
                });
            }

            return stats;
        }

        public async Task<List<AssetTypeStatsDto>> GetAssetTypeStatsAsync()
        {
            // Implementation for asset type statistics
            var countByType = await _assetRepository.GetCountByTypeAsync();
            var stats = new List<AssetTypeStatsDto>();

            foreach (var kvp in countByType)
            {
                stats.Add(new AssetTypeStatsDto
                {
                    Type = kvp.Key.ToString(),
                    Count = kvp.Value,
                    Value = 0 // TODO: Implement actual value query
                });
            }

            return stats;
        }
    }
}