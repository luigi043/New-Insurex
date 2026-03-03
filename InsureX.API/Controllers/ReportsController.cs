using System.Text;
using InsureX.Application.DTOs;
using InsureX.Application.DTOs.Reports;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class ReportsController : ControllerBase
{
    private readonly IReportGeneratorService _reportGeneratorService;
    private readonly IReportService _reportService;
    private readonly ILogger<ReportsController> _logger;

    public ReportsController(
        IReportGeneratorService reportGeneratorService,
        IReportService reportService,
        ILogger<ReportsController> logger)
    {
        _reportGeneratorService = reportGeneratorService;
        _reportService = reportService;
        _logger = logger;
    }

    // Report Definitions
    [HttpGet("definitions")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ReportDefinition>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAvailableReports()
    {
        var reports = await _reportGeneratorService.GetAvailableReportsAsync();
        return Ok(ApiResponse<IEnumerable<ReportDefinition>>.SuccessResponse(reports));
    }

    [HttpGet("definitions/{id:int}")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<ReportDefinition>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetReportDefinition(int id)
    {
        var report = await _reportGeneratorService.GetReportDefinitionAsync(id);
        if (report == null)
            return NotFound(ApiResponse.ErrorResponse("Report definition not found"));

        return Ok(ApiResponse<ReportDefinition>.SuccessResponse(report));
    }

    [HttpPost("definitions")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<ReportDefinition>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateReportDefinition([FromBody] ReportDefinition definition)
    {
        var created = await _reportGeneratorService.CreateReportDefinitionAsync(definition);
        return CreatedAtAction(nameof(GetReportDefinition), new { id = created.Id },
            ApiResponse<ReportDefinition>.SuccessResponse(created, "Report definition created"));
    }

    [HttpPut("definitions/{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<ReportDefinition>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateReportDefinition(int id, [FromBody] ReportDefinition definition)
    {
        definition.Id = id;
        var updated = await _reportGeneratorService.UpdateReportDefinitionAsync(definition);
        return Ok(ApiResponse<ReportDefinition>.SuccessResponse(updated, "Report definition updated"));
    }

    [HttpDelete("definitions/{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteReportDefinition(int id)
    {
        await _reportGeneratorService.DeleteReportDefinitionAsync(id);
        return Ok(ApiResponse.SuccessResponse("Report definition deleted"));
    }

    // Report Generation
    [HttpPost("generate/{reportId:int}")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<ReportResultDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GenerateReport(int reportId, [FromBody] ReportParametersDto parameters)
    {
        var result = await _reportGeneratorService.GenerateReportAsync(reportId, parameters);
        return Ok(ApiResponse<ReportResultDto>.SuccessResponse(result));
    }

    [HttpPost("export/{reportId:int}")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    public async Task<IActionResult> ExportReport(int reportId, [FromBody] ReportParametersDto parameters, [FromQuery] ExportFormat format = ExportFormat.Csv)
    {
        var bytes = await _reportGeneratorService.ExportReportAsync(reportId, parameters, format);
        var contentType = format switch
        {
            ExportFormat.Csv => "text/csv",
            ExportFormat.Excel => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ExportFormat.Pdf => "application/pdf",
            _ => "application/octet-stream"
        };
        return File(bytes, contentType, $"report_{reportId}_{DateTime.UtcNow:yyyyMMdd}.{format.ToString().ToLower()}");
    }

    // Predefined Reports
    [HttpGet("policies/summary")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<ReportResultDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> PolicySummary([FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var result = await _reportGeneratorService.GeneratePolicySummaryReportAsync(
            from ?? DateTime.UtcNow.AddMonths(-1), to ?? DateTime.UtcNow);
        return Ok(ApiResponse<ReportResultDto>.SuccessResponse(result));
    }

    [HttpGet("claims/summary")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<ReportResultDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ClaimsSummary([FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var result = await _reportGeneratorService.GenerateClaimsSummaryReportAsync(
            from ?? DateTime.UtcNow.AddMonths(-1), to ?? DateTime.UtcNow);
        return Ok(ApiResponse<ReportResultDto>.SuccessResponse(result));
    }

    [HttpGet("financial")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<ReportResultDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> FinancialReport([FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var result = await _reportGeneratorService.GenerateFinancialReportAsync(
            from ?? DateTime.UtcNow.AddMonths(-1), to ?? DateTime.UtcNow);
        return Ok(ApiResponse<ReportResultDto>.SuccessResponse(result));
    }

    [HttpGet("loss-ratio")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<ReportResultDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> LossRatio([FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var result = await _reportGeneratorService.GenerateLossRatioReportAsync(
            from ?? DateTime.UtcNow.AddYears(-1), to ?? DateTime.UtcNow);
        return Ok(ApiResponse<ReportResultDto>.SuccessResponse(result));
    }

    [HttpGet("expiring-policies")]
    [Authorize(Roles = "Admin,Insurer,Broker")]
    [ProducesResponseType(typeof(ApiResponse<ReportResultDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ExpiringPolicies([FromQuery] int days = 30)
    {
        var result = await _reportGeneratorService.GenerateExpiringPoliciesReportAsync(days);
        return Ok(ApiResponse<ReportResultDto>.SuccessResponse(result));
    }

    [HttpGet("partner-performance")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<ReportResultDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> PartnerPerformance([FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var result = await _reportGeneratorService.GeneratePartnerPerformanceReportAsync(
            from ?? DateTime.UtcNow.AddMonths(-3), to ?? DateTime.UtcNow);
        return Ok(ApiResponse<ReportResultDto>.SuccessResponse(result));
    }

    // Legacy overview endpoint
    [HttpGet("overview")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    public async Task<IActionResult> Overview([FromQuery] string period = "month")
    {
        var (from, to) = GetDateRange(period);
        var result = await _reportService.GetOverviewAsync(from, to);
        return Ok(result);
    }

    // Legacy CSV exports
    [HttpGet("export/policies")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    public async Task<IActionResult> ExportPoliciesCsv([FromQuery] string period = "month")
    {
        var (from, to) = GetDateRange(period);
        var rows = await _reportService.GetPoliciesForExportAsync(from, to);
        return CsvResult(rows, $"policies_{period}_{DateTime.UtcNow:yyyyMMdd}.csv");
    }

    [HttpGet("export/claims")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor,Accountant")]
    public async Task<IActionResult> ExportClaimsCsv([FromQuery] string period = "month")
    {
        var (from, to) = GetDateRange(period);
        var rows = await _reportService.GetClaimsForExportAsync(from, to);
        return CsvResult(rows, $"claims_{period}_{DateTime.UtcNow:yyyyMMdd}.csv");
    }

    [HttpGet("export/assets")]
    [Authorize(Roles = "Admin,Insurer")]
    public async Task<IActionResult> ExportAssetsCsv()
    {
        var rows = await _reportService.GetAssetsForExportAsync();
        return CsvResult(rows, $"assets_{DateTime.UtcNow:yyyyMMdd}.csv");
    }

    // Helpers
    private static (DateTime from, DateTime to) GetDateRange(string period)
    {
        var to = DateTime.UtcNow;
        var from = period switch
        {
            "week" => to.AddDays(-7),
            "quarter" => to.AddMonths(-3),
            "year" => to.AddYears(-1),
            _ => to.AddMonths(-1),
        };
        return (from, to);
    }

    private FileContentResult CsvResult(IEnumerable<IEnumerable<string>> rows, string fileName)
    {
        var sb = new StringBuilder();
        foreach (var row in rows)
        {
            sb.AppendLine(string.Join(",", row.Select(cell =>
                $"\"{cell?.Replace("\"", "\"\"")}\"")));
        }
        var bytes = Encoding.UTF8.GetPreamble()
            .Concat(Encoding.UTF8.GetBytes(sb.ToString()))
            .ToArray();
        return File(bytes, "text/csv", fileName);
    }
}
