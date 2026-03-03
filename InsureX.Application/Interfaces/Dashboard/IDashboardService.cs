using InsureX.Application.DTOs.Dashboard;

namespace InsureX.Application.Interfaces.Dashboard;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync();
    Task<List<PolicyDistributionDto>> GetPolicyDistributionByTypeAsync();
    Task<List<ClaimStatusDto>> GetClaimsByStatusAsync();
    Task<List<MonthlyDataDto>> GetMonthlyRevenueAsync(int months);
    Task<List<MonthlyDataDto>> GetMonthlyClaimsAsync(int months);
    Task<List<ActivityDto>> GetRecentActivityAsync(int count);
    Task<List<ExpiringPolicyDto>> GetExpiringPoliciesAsync(int days);
    Task<List<TaskDto>> GetPendingTasksAsync();
}
