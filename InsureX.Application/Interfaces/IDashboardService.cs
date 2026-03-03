using InsureX.Application.DTOs;

namespace InsureX.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync();
    Task<IEnumerable<ChartDataDto>> GetPolicyDistributionByTypeAsync();
    Task<IEnumerable<ChartDataDto>> GetClaimsByStatusAsync();
    Task<IEnumerable<ChartDataDto>> GetMonthlyRevenueAsync(int months = 12);
    Task<IEnumerable<ChartDataDto>> GetMonthlyClaimsAsync(int months = 12);
    Task<RecentActivityDto> GetRecentActivityAsync(int count = 10);
    Task<ExpiringPoliciesDto> GetExpiringPoliciesAsync(int days = 30);
    Task<PendingTasksDto> GetPendingTasksAsync();
}
