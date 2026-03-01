using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Application.Interfaces;
using InsureX.Application.DTOs.Dashboard;

namespace InsureX.Application.Services.Dashboard;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetDashboardSummaryAsync();
    Task<PolicyStatusChartDto> GetPolicyChartDataAsync();
    Task<List<RecentActivityDto>> GetRecentActivityAsync(int count = 10);
    Task<List<ChartDataDto>> GetMonthlyPremiumTrendAsync(int months = 6);
    Task<List<ChartDataDto>> GetExpiringPoliciesChartAsync();
}

public class DashboardService : IDashboardService
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;
    private readonly ILogger<DashboardService> _logger;

    public DashboardService(
        IApplicationDbContext context,
        ITenantContext tenantContext,
        ILogger<DashboardService> logger)
    {
        _context = context;
        _tenantContext = tenantContext;
        _logger = logger;
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
    {
        try
        {
            var now = DateTime.UtcNow;
            var thirtyDaysFromNow = now.AddDays(30);

            var summary = new DashboardSummaryDto
            {
                TotalPolicies = await _context.Policies
                    .CountAsync(p => !p.IsDeleted),
                
                ActivePolicies = await _context.Policies
                    .CountAsync(p => !p.IsDeleted && p.Status == "Active"),
                
                ExpiringSoon = await _context.Policies
                    .CountAsync(p => !p.IsDeleted && 
                                    p.Status == "Active" && 
                                    p.EndDate <= thirtyDaysFromNow),
                
                TotalAssets = await _context.Assets
                    .CountAsync(a => !a.IsDeleted),
                
                TotalInsuredValue = await _context.Policies
                    .Where(p => !p.IsDeleted && p.Status == "Active")
                    .SumAsync(p => p.InsuredValue),
                
                PendingClaims = await _context.Claims
                    .CountAsync(c => !c.IsDeleted && c.Status == "Filed"),
                
                OutstandingPremiums = await _context.Policies
                    .Where(p => !p.IsDeleted && p.PaymentStatus == "Pending")
                    .SumAsync(p => p.Premium),
                
                UninsuredAssets = await _context.Assets
                    .CountAsync(a => !a.IsDeleted && a.InsuredValue == 0)
            };

            return summary;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard summary");
            throw;
        }
    }

    public async Task<PolicyStatusChartDto> GetPolicyChartDataAsync()
    {
        try
        {
            var chartData = new PolicyStatusChartDto();

            // Status breakdown
            var statusCounts = await _context.Policies
                .Where(p => !p.IsDeleted)
                .GroupBy(p => p.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            chartData.ByStatus = statusCounts
                .Select(x => new ChartDataDto 
                { 
                    Label = x.Status, 
                    Value = x.Count 
                })
                .ToList();

            // Type breakdown
            var typeCounts = await _context.Policies
                .Where(p => !p.IsDeleted)
                .GroupBy(p => p.PolicyType)
                .Select(g => new { Type = g.Key, Count = g.Count() })
                .ToListAsync();

            chartData.ByType = typeCounts
                .Select(x => new ChartDataDto 
                { 
                    Label = x.Type, 
                    Value = x.Count 
                })
                .ToList();

            // Monthly trend (last 6 months)
            var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
            var monthlyData = await _context.Policies
                .Where(p => !p.IsDeleted && p.CreatedAt >= sixMonthsAgo)
                .GroupBy(p => new { p.CreatedAt.Year, p.CreatedAt.Month })
                .Select(g => new 
                { 
                    Year = g.Key.Year, 
                    Month = g.Key.Month, 
                    Count = g.Count() 
                })
                .OrderBy(g => g.Year).ThenBy(g => g.Month)
                .ToListAsync();

            foreach (var data in monthlyData)
            {
                var monthName = new DateTime(data.Year, data.Month, 1).ToString("MMM yyyy");
                chartData.ByMonth.Add(new ChartDataDto 
                { 
                    Label = monthName, 
                    Value = data.Count 
                });
            }

            return chartData;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting policy chart data");
            throw;
        }
    }

    public async Task<List<RecentActivityDto>> GetRecentActivityAsync(int count = 10)
    {
        try
        {
            var activities = new List<RecentActivityDto>();

            // Get recent policies
            var recentPolicies = await _context.Policies
                .Include(p => p.CreatedByUser)
                .Where(p => !p.IsDeleted)
                .OrderByDescending(p => p.CreatedAt)
                .Take(count / 2)
                .Select(p => new RecentActivityDto
                {
                    ActivityType = "Policy Created",
                    Description = $"Policy {p.PolicyNumber} created",
                    Reference = p.PolicyNumber,
                    Timestamp = p.CreatedAt,
                    User = p.CreatedByUser != null ? p.CreatedByUser.Email : "System"
                })
                .ToListAsync();

            activities.AddRange(recentPolicies);

            // Get recent claims
            var recentClaims = await _context.Claims
                .Include(c => c.Policy)
                .Where(c => !c.IsDeleted)
                .OrderByDescending(c => c.CreatedAt)
                .Take(count / 2)
                .Select(c => new RecentActivityDto
                {
                    ActivityType = "Claim Filed",
                    Description = $"Claim {c.ClaimNumber} filed for {c.ClaimAmount:C}",
                    Reference = c.ClaimNumber,
                    Timestamp = c.CreatedAt,
                    User = "System"
                })
                .ToListAsync();

            activities.AddRange(recentClaims);

            return activities.OrderByDescending(a => a.Timestamp).Take(count).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting recent activity");
            throw;
        }
    }

    public async Task<List<ChartDataDto>> GetMonthlyPremiumTrendAsync(int months = 6)
    {
        try
        {
            var startDate = DateTime.UtcNow.AddMonths(-months);
            
            var premiumTrend = await _context.Policies
                .Where(p => !p.IsDeleted && p.CreatedAt >= startDate)
                .GroupBy(p => new { p.CreatedAt.Year, p.CreatedAt.Month })
                .Select(g => new 
                { 
                    Year = g.Key.Year, 
                    Month = g.Key.Month, 
                    Total = g.Sum(p => p.Premium) 
                })
                .OrderBy(g => g.Year).ThenBy(g => g.Month)
                .ToListAsync();

            return premiumTrend
                .Select(x => new ChartDataDto
                {
                    Label = new DateTime(x.Year, x.Month, 1).ToString("MMM yyyy"),
                    Amount = x.Total,
                    Value = (int)x.Total
                })
                .ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting monthly premium trend");
            throw;
        }
    }

    public async Task<List<ChartDataDto>> GetExpiringPoliciesChartAsync()
    {
        try
        {
            var now = DateTime.UtcNow;
            var chartData = new List<ChartDataDto>();

            for (int i = 0; i < 6; i++)
            {
                var startDate = now.AddDays(i * 30);
                var endDate = now.AddDays((i + 1) * 30);
                
                var count = await _context.Policies
                    .CountAsync(p => !p.IsDeleted && 
                                    p.Status == "Active" && 
                                    p.EndDate >= startDate && 
                                    p.EndDate < endDate);

                chartData.Add(new ChartDataDto
                {
                    Label = $"Month {i + 1}",
                    Value = count
                });
            }

            return chartData;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expiring policies chart");
            throw;
        }
    }
}
