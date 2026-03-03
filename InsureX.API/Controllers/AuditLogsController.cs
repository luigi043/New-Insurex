using InsureX.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/audit-logs")]
[Authorize(Roles = "Admin,Auditor")]
public class AuditLogsController : ControllerBase
{
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<AuditLogsController> _logger;

    public AuditLogsController(
        IAuditLogRepository auditLogRepository,
        ICurrentUserService currentUserService,
        ILogger<AuditLogsController> logger)
    {
        _auditLogRepository = auditLogRepository;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAuditLogs(
        [FromQuery] int? userId,
        [FromQuery] string? action,
        [FromQuery] string? entityType,
        [FromQuery] int? entityId,
        [FromQuery] string? category,
        [FromQuery] string? severity,
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        [FromQuery] string? searchTerm,
        [FromQuery] int skip = 0,
        [FromQuery] int take = 100)
    {
        var tenantId = _currentUserService.TenantId ?? 0;

        var filter = new AuditLogFilter
        {
            TenantId = tenantId,
            UserId = userId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            Category = category,
            Severity = severity,
            FromDate = fromDate,
            ToDate = toDate,
            SearchTerm = searchTerm,
            Skip = skip,
            Take = take
        };

        var logs = await _auditLogRepository.FilterAsync(filter);

        return Ok(logs);
    }

    [HttpGet("entity/{entityType}/{entityId}")]
    public async Task<IActionResult> GetEntityHistory(string entityType, int entityId)
    {
        var logs = await _auditLogRepository.GetByEntityAsync(entityType, entityId);
        return Ok(logs);
    }

    [HttpGet("compliance/statistics")]
    public async Task<IActionResult> GetComplianceStatistics(
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null)
    {
        var tenantId = _currentUserService.TenantId ?? 0;
        var fromDate = from ?? DateTime.UtcNow.AddDays(-30);
        var toDate = to ?? DateTime.UtcNow;

        var stats = await _auditLogRepository.GetComplianceStatisticsAsync(tenantId, fromDate, toDate);

        return Ok(new
        {
            period = new { from = fromDate, to = toDate },
            statistics = stats
        });
    }

    [HttpGet("compliance/export")]
    public async Task<IActionResult> ExportComplianceReport(
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null)
    {
        var tenantId = _currentUserService.TenantId ?? 0;
        var fromDate = from ?? DateTime.UtcNow.AddDays(-30);
        var toDate = to ?? DateTime.UtcNow;

        var reportData = await _auditLogRepository.ExportComplianceReportAsync(tenantId, fromDate, toDate);

        _logger.LogInformation(
            "Compliance report exported by user {UserId} for period {From} to {To}",
            _currentUserService.UserId,
            fromDate,
            toDate);

        return File(
            reportData,
            "text/csv",
            $"compliance_report_{fromDate:yyyyMMdd}_{toDate:yyyyMMdd}.csv");
    }

    [HttpGet("categories")]
    public IActionResult GetCategories()
    {
        var categories = new[] { "Security", "Compliance", "DataModification", "Authentication", "Authorization" };
        return Ok(categories);
    }

    [HttpGet("actions")]
    public IActionResult GetActions()
    {
        var actions = new[] { "Create", "Update", "Delete", "Login", "Logout", "Export", "Import", "Approve", "Reject" };
        return Ok(actions);
    }
}
