using InsureX.Application.DTOs;
using InsureX.Application.DTOs.Audit;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "AdminOnly")]
[Produces("application/json")]
public class AuditController : ControllerBase
{
    private readonly IAuditService _auditService;
    private readonly ILogger<AuditController> _logger;

    public AuditController(IAuditService auditService, ILogger<AuditController> logger)
    {
        _auditService = auditService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<AuditEntry>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Search([FromQuery] AuditFilterRequest filter)
    {
        var result = await _auditService.SearchAsync(filter);
        return Ok(ApiResponse<PagedResult<AuditEntry>>.SuccessResponse(result));
    }

    [HttpGet("{id:long}")]
    [ProducesResponseType(typeof(ApiResponse<AuditEntry>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id)
    {
        var entry = await _auditService.GetByIdAsync(id);
        if (entry == null)
            return NotFound(ApiResponse.ErrorResponse("Audit entry not found"));

        return Ok(ApiResponse<AuditEntry>.SuccessResponse(entry));
    }

    [HttpGet("entity/{entityType}/{entityId}")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<AuditEntry>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByEntity(string entityType, string entityId)
    {
        var entries = await _auditService.GetByEntityAsync(entityType, entityId);
        return Ok(ApiResponse<IEnumerable<AuditEntry>>.SuccessResponse(entries));
    }

    [HttpGet("user/{userId:int}")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<AuditEntry>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByUser(int userId, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var entries = await _auditService.GetByUserAsync(userId, from, to);
        return Ok(ApiResponse<IEnumerable<AuditEntry>>.SuccessResponse(entries));
    }

    [HttpGet("entity-types")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<string>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetEntityTypes()
    {
        var types = await _auditService.GetDistinctEntityTypesAsync();
        return Ok(ApiResponse<IEnumerable<string>>.SuccessResponse(types));
    }

    [HttpGet("actions")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<string>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActions()
    {
        var actions = await _auditService.GetDistinctActionsAsync();
        return Ok(ApiResponse<IEnumerable<string>>.SuccessResponse(actions));
    }

    [HttpGet("compliance-report")]
    [ProducesResponseType(typeof(ApiResponse<AuditComplianceReport>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetComplianceReport([FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        var report = await _auditService.GenerateComplianceReportAsync(from, to);
        return Ok(ApiResponse<AuditComplianceReport>.SuccessResponse(report));
    }

    [HttpGet("export")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> Export([FromQuery] AuditFilterRequest filter, [FromQuery] string format = "csv")
    {
        var bytes = await _auditService.ExportAsync(filter, format);
        var contentType = format.ToLower() == "csv" ? "text/csv" : "application/octet-stream";
        var fileName = $"audit_export_{DateTime.UtcNow:yyyyMMdd_HHmmss}.{format}";
        return File(bytes, contentType, fileName);
    }
}
