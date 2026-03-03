using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InsureX.Application.Interfaces;

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
        try { return Ok(await _dashboardService.GetSummaryAsync()); }
        catch (Exception ex) { _logger.LogError(ex, "Error getting dashboard summary"); return StatusCode(500, new { message = "Error retrieving dashboard data" }); }
    }

    [HttpGet("charts/policy-status")]
    public async Task<ActionResult> GetPolicyChartData()
    {
        try { return Ok(await _dashboardService.GetPolicyDistributionByTypeAsync()); }
        catch (Exception ex) { _logger.LogError(ex, "Error getting chart data"); return StatusCode(500, new { message = "Error retrieving chart data" }); }
    }

    [HttpGet("charts/claim-status")]
    public async Task<ActionResult> GetClaimChartData()
    {
        try { return Ok(await _dashboardService.GetClaimsByStatusAsync()); }
        catch (Exception ex) { _logger.LogError(ex, "Error getting claim chart data"); return StatusCode(500, new { message = "Error retrieving chart data" }); }
    }

    [HttpGet("charts/asset-types")]
    public async Task<ActionResult> GetAssetChartData()
    {
        try { return Ok(await _dashboardService.GetPolicyDistributionByTypeAsync()); }
        catch (Exception ex) { _logger.LogError(ex, "Error getting asset chart data"); return StatusCode(500, new { message = "Error retrieving chart data" }); }
    }

    [HttpGet("financial")]
    public async Task<ActionResult> GetFinancialSummary([FromQuery] int months = 12)
    {
        try
        {
            var revenue = await _dashboardService.GetMonthlyRevenueAsync(months);
            return Ok(revenue);
        }
        catch (Exception ex) { _logger.LogError(ex, "Error getting financial summary"); return StatusCode(500, new { message = "Error retrieving financial data" }); }
    }

    [HttpGet("monthly-stats")]
    public async Task<ActionResult> GetMonthlyStats([FromQuery] int months = 12)
    {
        try
        {
            var revenue = await _dashboardService.GetMonthlyRevenueAsync(months);
            var claims  = await _dashboardService.GetMonthlyClaimsAsync(months);
            return Ok(new { revenue, claims });
        }
        catch (Exception ex) { _logger.LogError(ex, "Error getting monthly stats"); return StatusCode(500, new { message = "Error retrieving monthly data" }); }
    }
}
