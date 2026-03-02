using InsureX.Application.DTOs.Dashboard;

namespace InsureX.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetDashboardStatsAsync();
    Task<FinancialSummaryDto> GetFinancialSummaryAsync(DateTime startDate, DateTime endDate);
    Task<List<MonthlyStatsDto>> GetMonthlyStatsAsync(int year);
    Task<List<PolicyTypeStatsDto>> GetPolicyTypeStatsAsync();
    Task<List<ClaimStatusStatsDto>> GetClaimStatusStatsAsync();
    Task<List<AssetTypeStatsDto>> GetAssetTypeStatsAsync();
}
