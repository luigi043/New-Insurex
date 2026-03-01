using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InsureX.Application.Services.Dashboard;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IDashboardService dashboardService, ILogger<DashboardController> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    [HttpGet("summary")]
    public async Task<ActionResult> GetSummary()
    {
        try
        {
            var summary = await _dashboardService.GetDashboardSummaryAsync();
            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard summary");
            return StatusCode(500, new { message = "Error retrieving dashboard data" });
        }
    }

    [HttpGet("charts/policy-status")]
    public async Task<ActionResult> GetPolicyChartData()
    {
        try
        {
            var chartData = await _dashboardService.GetPolicyChartDataAsync();
            return Ok(chartData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting policy chart data");
            return StatusCode(500, new { message = "Error retrieving chart data" });
        }
    }

    [HttpGet("recent-activity")]
    public async Task<ActionResult> GetRecentActivity([FromQuery] int count = 10)
    {
        try
        {
            var activities = await _dashboardService.GetRecentActivityAsync(count);
            return Ok(activities);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting recent activity");
            return StatusCode(500, new { message = "Error retrieving activity data" });
        }
    }

    [HttpGet("premium-trend")]
    public async Task<ActionResult> GetPremiumTrend([FromQuery] int months = 6)
    {
        try
        {
            var trend = await _dashboardService.GetMonthlyPremiumTrendAsync(months);
            return Ok(trend);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting premium trend");
            return StatusCode(500, new { message = "Error retrieving premium data" });
        }
    }

    [HttpGet("expiring-chart")]
    public async Task<ActionResult> GetExpiringChart()
    {
        try
        {
            var chartData = await _dashboardService.GetExpiringPoliciesChartAsync();
            return Ok(chartData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expiring chart");
            return StatusCode(500, new { message = "Error retrieving expiring policies data" });
        }
    }
}
