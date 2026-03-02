using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Application.DTOs.Dashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using InsureX.Application.Interfaces;
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

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync(Guid? userId = null)
    {
        var policies = await _policyRepository.GetAllAsync();
        var claims = await _claimRepository.GetAllAsync();
        var assets = await _assetRepository.GetAllAsync();

        // Filter deleted records and use correct enum comparisons
        var activePolicies = policies.Where(p => !p.IsDeleted && p.Status == PolicyStatus.Active).ToList();
        var pendingClaims = claims.Where(c => !c.IsDeleted && c.Status == ClaimStatus.Submitted).ToList();
        var totalAssets = assets.Where(a => !a.IsDeleted).ToList();

        var totalPremium = activePolicies.Sum(p => p.Premium);
        var totalCoverage = activePolicies.Sum(p => p.CoverageAmount);
        var totalClaimsAmount = claims.Where(c => !c.IsDeleted && (c.Status == ClaimStatus.Approved || c.Status == ClaimStatus.Paid))
            .Sum(c => c.ApprovedAmount ?? 0);

        return new DashboardSummaryDto
        {
            TotalPolicies = policies.Count(p => !p.IsDeleted),
            ActivePolicies = activePolicies.Count,
            ExpiredPolicies = policies.Count(p => !p.IsDeleted && p.Status == PolicyStatus.Expired),
            TotalClaims = claims.Count(c => !c.IsDeleted),
            PendingClaims = pendingClaims.Count,
            ApprovedClaims = claims.Count(c => !c.IsDeleted && c.Status == ClaimStatus.Approved),
            TotalAssets = totalAssets.Count,
            TotalPremium = totalPremium,
            TotalCoverage = totalCoverage,
            TotalClaimsAmount = totalClaimsAmount,
            LossRatio = totalPremium > 0 ? (totalClaimsAmount / totalPremium) * 100 : 0
        };
    }

    public async Task<List<MonthlyStatsDto>> GetMonthlyStatsAsync(int months = 12)
    {
        var policies = await _policyRepository.GetAllAsync();
        var claims = await _claimRepository.GetAllAsync();

        var result = new List<MonthlyStatsDto>();
        var endDate = DateTime.UtcNow;
        var startDate = endDate.AddMonths(-months);

        for (var date = startDate; date <= endDate; date = date.AddMonths(1))
        {
            var monthPolicies = policies.Where(p => 
                !p.IsDeleted && 
                p.CreatedAt.Month == date.Month && 
                p.CreatedAt.Year == date.Year).ToList();

            var monthClaims = claims.Where(c => 
                !c.IsDeleted && 
                c.CreatedAt.Month == date.Month && 
                c.CreatedAt.Year == date.Year).ToList();

            result.Add(new MonthlyStatsDto
            {
                Month = date.ToString("MMM yyyy"),
                NewPolicies = monthPolicies.Count,
                NewClaims = monthClaims.Count,
                PremiumCollected = monthPolicies.Where(p => p.Status == PolicyStatus.Active).Sum(p => p.Premium),
                ClaimsPaid = monthClaims.Where(c => c.Status == ClaimStatus.Paid).Sum(c => c.ApprovedAmount ?? 0)
            });
        }

        return result;
    }

    public async Task<List<PolicyTypeStatsDto>> GetPolicyTypeStatsAsync()
    {
        var policies = await _policyRepository.GetAllAsync();
        var activePolicies = policies.Where(p => !p.IsDeleted && p.Status == PolicyStatus.Active);

        return activePolicies
            .GroupBy(p => p.Type)
            .Select(g => new PolicyTypeStatsDto
            {
                Type = g.Key.ToString(),
                Count = g.Count(),
                TotalValue = g.Sum(p => p.CoverageAmount),
                AveragePremium = g.Average(p => p.Premium)
            })
            .ToList();
    }

    public async Task<List<ClaimStatusStatsDto>> GetClaimStatusStatsAsync()
    {
        var claims = await _claimRepository.GetAllAsync();
        var nonDeletedClaims = claims.Where(c => !c.IsDeleted);

        return nonDeletedClaims
            .GroupBy(c => c.Status)
            .Select(g => new ClaimStatusStatsDto
            {
                Status = g.Key.ToString(),
                Count = g.Count(),
                TotalAmount = g.Sum(c => c.ClaimedAmount)
            })
            .ToList();
    }

    public async Task<List<AssetTypeStatsDto>> GetAssetTypeStatsAsync()
    {
        var assets = await _assetRepository.GetAllAsync();
        var nonDeletedAssets = assets.Where(a => !a.IsDeleted);

        return nonDeletedAssets
            .GroupBy(a => a.Type)
            .Select(g => new AssetTypeStatsDto
            {
                Type = g.Key.ToString(),
                Count = g.Count(),
                TotalValue = g.Sum(a => a.Value),
                TotalInsuredValue = g.Sum(a => a.InsuredValue)  // Use InsuredValue property
            })
            .ToList();
    }

    public async Task<List<RecentActivityDto>> GetRecentActivityAsync(int count = 10)
    {
        var policies = await _policyRepository.GetAllAsync();
        var claims = await _claimRepository.GetAllAsync();

        var policyActivities = policies
            .Where(p => !p.IsDeleted)
            .OrderByDescending(p => p.CreatedAt)
            .Take(count)
            .Select(p => new RecentActivityDto
            {
                Id = p.Id,
                Type = "Policy",
                Description = $"Policy {p.PolicyNumber} created",
                Date = p.CreatedAt,
                Status = p.Status.ToString(),
                // Use CreatedByUser instead of CreatedByUser
                UserName = p.CreatedByUser != null ? $"{p.CreatedByUser.FirstName} {p.CreatedByUser.LastName}" : "System"
            });

        var claimActivities = claims
            .Where(c => !c.IsDeleted)
            .OrderByDescending(c => c.CreatedAt)
            .Take(count)
            .Select(c => new RecentActivityDto
            {
                Id = c.Id,
                Type = "Claim",
                Description = $"Claim {c.ClaimNumber} submitted",
                Date = c.CreatedAt,
                Status = c.Status.ToString(),
                UserName = $"{c.Client.FirstName} {c.Client.LastName}"
            });

        return policyActivities
            .Union(claimActivities)
            .OrderByDescending(a => a.Date)
            .Take(count)
            .ToList();
    }

    public async Task<FinancialSummaryDto> GetFinancialSummaryAsync(DateTime? startDate = null, DateTime? endDate = null)
    {
        var start = startDate ?? DateTime.UtcNow.AddYears(-1);
        var end = endDate ?? DateTime.UtcNow;

        var policies = await _policyRepository.GetAllAsync();
        var claims = await _claimRepository.GetAllAsync();

        var periodPolicies = policies.Where(p => 
            !p.IsDeleted && 
            p.CreatedAt >= start && 
            p.CreatedAt <= end).ToList();

        var periodClaims = claims.Where(c => 
            !c.IsDeleted && 
            c.CreatedAt >= start && 
            c.CreatedAt <= end &&
            (c.Status == ClaimStatus.Approved || c.Status == ClaimStatus.Paid)).ToList();

        var totalPremium = periodPolicies.Sum(p => p.Premium);
        var totalClaimsPaid = periodClaims.Sum(c => c.ApprovedAmount ?? 0);

        return new FinancialSummaryDto
        {
            StartDate = start,
            EndDate = end,
            TotalPremium = totalPremium,
            TotalClaimsPaid = totalClaimsPaid,
            NetProfit = totalPremium - totalClaimsPaid,
            LossRatio = totalPremium > 0 ? (totalClaimsPaid / totalPremium) * 100 : 0,
            AveragePolicyValue = periodPolicies.Any() ? periodPolicies.Average(p => p.CoverageAmount) : 0,
            AverageClaimValue = periodClaims.Any() ? periodClaims.Average(c => c.ClaimedAmount) : 0
        };
    }
}