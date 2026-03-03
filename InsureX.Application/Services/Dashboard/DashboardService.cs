using InsureX.Application.Interfaces.Dashboard;
using InsureX.Application.DTOs.Dashboard;
using InsureX.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace InsureX.Application.Services.Dashboard;

public class DashboardService : IDashboardService
{
    private readonly IPolicyRepository _policyRepository;
    private readonly IClaimRepository _claimRepository;
    private readonly ILogger<DashboardService> _logger;

    public DashboardService(
        IPolicyRepository policyRepository,
        IClaimRepository claimRepository,
        ILogger<DashboardService> logger)
    {
        _policyRepository = policyRepository;
        _claimRepository = claimRepository;
        _logger = logger;
    }

    public async Task<DashboardSummaryDto> GetSummaryAsync()
    {
        return new DashboardSummaryDto
        {
            TotalPolicies = await _policyRepository.CountAsync(),
            ActivePolicies = await _policyRepository.GetActivePolicyCountAsync(1),
            TotalClaims = await _claimRepository.CountAsync(),
            PendingClaims = (await _claimRepository.GetByStatusAsync(Domain.Enums.ClaimStatus.Submitted)).Count()
        };
    }

    public Task<List<PolicyDistributionDto>> GetPolicyDistributionByTypeAsync() => 
        Task.FromResult(new List<PolicyDistributionDto>());

    public Task<List<ClaimStatusDto>> GetClaimsByStatusAsync() => 
        Task.FromResult(new List<ClaimStatusDto>());

    public Task<List<MonthlyDataDto>> GetMonthlyRevenueAsync(int months) => 
        Task.FromResult(new List<MonthlyDataDto>());

    public Task<List<MonthlyDataDto>> GetMonthlyClaimsAsync(int months) => 
        Task.FromResult(new List<MonthlyDataDto>());

    public Task<List<ActivityDto>> GetRecentActivityAsync(int count) => 
        Task.FromResult(new List<ActivityDto>());

    public Task<List<ExpiringPolicyDto>> GetExpiringPoliciesAsync(int days) => 
        Task.FromResult(new List<ExpiringPolicyDto>());

    public Task<List<TaskDto>> GetPendingTasksAsync() => 
        Task.FromResult(new List<TaskDto>());
}
