using System.Text;
using InsureX.Application.DTOs;
using InsureX.Application.DTOs.Audit;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace InsureX.Application.Services;

public class AuditService : IAuditService
{
    private readonly IAuditRepository _auditRepository;
    private readonly ITenantContext _tenantContext;
    private readonly ILogger<AuditService> _logger;

    public AuditService(
        IAuditRepository auditRepository,
        ITenantContext tenantContext,
        ILogger<AuditService> logger)
    {
        _auditRepository = auditRepository;
        _tenantContext = tenantContext;
        _logger = logger;
    }

    public async Task<AuditEntry?> GetByIdAsync(long id)
    {
        var entry = await _auditRepository.GetByIdAsync(id);
        if (entry == null || entry.TenantId != _tenantContext.TenantId)
            return null;
        return entry;
    }

    public async Task<PagedResult<AuditEntry>> SearchAsync(AuditFilterRequest filter)
    {
        var (items, totalCount) = await _auditRepository.SearchAsync(
            tenantId: _tenantContext.TenantId,
            userId: filter.UserId,
            entityType: filter.EntityType,
            action: filter.Action,
            from: filter.FromDate,
            to: filter.ToDate,
            searchTerm: filter.SearchTerm,
            pageNumber: filter.PageNumber,
            pageSize: filter.PageSize);

        return new PagedResult<AuditEntry>
        {
            Items = items.ToList(),
            TotalCount = totalCount,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize
        };
    }

    public async Task<IEnumerable<AuditEntry>> GetByEntityAsync(string entityType, string entityId)
    {
        return await _auditRepository.GetByEntityAsync(entityType, entityId);
    }

    public async Task<IEnumerable<AuditEntry>> GetByUserAsync(int userId, DateTime? from = null, DateTime? to = null)
    {
        return await _auditRepository.GetByUserAsync(userId, from, to);
    }

    public async Task<AuditComplianceReport> GenerateComplianceReportAsync(DateTime from, DateTime to)
    {
        var tenantId = _tenantContext.TenantId;
        var (allEntries, totalCount) = await _auditRepository.SearchAsync(
            tenantId: tenantId,
            from: from,
            to: to,
            pageNumber: 1,
            pageSize: int.MaxValue);

        var entries = allEntries.ToList();

        var report = new AuditComplianceReport
        {
            PeriodFrom = from,
            PeriodTo = to,
            TotalAuditEntries = totalCount,
            EntriesByAction = entries
                .GroupBy(e => e.Action)
                .ToDictionary(g => g.Key, g => g.Count()),
            EntriesByEntityType = entries
                .GroupBy(e => e.EntityType)
                .ToDictionary(g => g.Key, g => g.Count()),
            EntriesByUser = entries
                .Where(e => e.UserEmail != null)
                .GroupBy(e => e.UserEmail!)
                .ToDictionary(g => g.Key, g => g.Count()),
            DailySummary = entries
                .GroupBy(e => e.Timestamp.Date)
                .OrderBy(g => g.Key)
                .Select(g => new AuditDailySummary
                {
                    Date = g.Key,
                    TotalActions = g.Count(),
                    Creates = g.Count(e => e.Action == "Create"),
                    Updates = g.Count(e => e.Action == "Update"),
                    Deletes = g.Count(e => e.Action == "Delete" || e.Action == "SoftDelete")
                })
                .ToList(),
            HighRiskActivities = entries
                .Where(e => e.Action == "Delete" || e.Action == "SoftDelete" ||
                           e.EntityType == "User" || e.EntityType == "Tenant")
                .OrderByDescending(e => e.Timestamp)
                .Take(50)
                .Select(e => new AuditHighRiskActivity
                {
                    Timestamp = e.Timestamp,
                    UserEmail = e.UserEmail,
                    EntityType = e.EntityType,
                    Action = e.Action,
                    EntityId = e.EntityId,
                    Description = $"{e.Action} on {e.EntityType} #{e.EntityId}"
                })
                .ToList()
        };

        _logger.LogInformation(
            "Compliance report generated for period {From} to {To}: {TotalEntries} entries",
            from, to, totalCount);

        return report;
    }

    public async Task<IEnumerable<string>> GetDistinctEntityTypesAsync()
    {
        return await _auditRepository.GetDistinctEntityTypesAsync(_tenantContext.TenantId);
    }

    public async Task<IEnumerable<string>> GetDistinctActionsAsync()
    {
        return await _auditRepository.GetDistinctActionsAsync(_tenantContext.TenantId);
    }

    public async Task<byte[]> ExportAsync(AuditFilterRequest filter, string format = "csv")
    {
        var result = await SearchAsync(filter);
        var entries = result.Items;

        var sb = new StringBuilder();
        sb.AppendLine("Id,Timestamp,UserEmail,EntityType,EntityId,Action,IpAddress,RequestPath");

        foreach (var entry in entries)
        {
            sb.AppendLine(string.Join(",",
                entry.Id,
                $"\"{entry.Timestamp:yyyy-MM-dd HH:mm:ss}\"",
                $"\"{entry.UserEmail}\"",
                $"\"{entry.EntityType}\"",
                $"\"{entry.EntityId}\"",
                $"\"{entry.Action}\"",
                $"\"{entry.IpAddress}\"",
                $"\"{entry.RequestPath}\""));
        }

        return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
    }
}
