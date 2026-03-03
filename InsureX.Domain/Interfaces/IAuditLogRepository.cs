using InsureX.Domain.Entities;

namespace InsureX.Domain.Interfaces;

public interface IAuditLogRepository : IRepository<AuditLog>
{
    Task<IEnumerable<AuditLog>> GetByTenantIdAsync(int tenantId, int skip = 0, int take = 100);
    Task<IEnumerable<AuditLog>> GetByUserIdAsync(int userId, int skip = 0, int take = 100);
    Task<IEnumerable<AuditLog>> GetByEntityAsync(string entityType, int entityId);
    Task<IEnumerable<AuditLog>> GetByActionAsync(int tenantId, string action, DateTime? from = null, DateTime? to = null);
    Task<IEnumerable<AuditLog>> GetByCategoryAsync(int tenantId, string category, DateTime? from = null, DateTime? to = null);
    Task<IEnumerable<AuditLog>> GetBySeverityAsync(int tenantId, string severity, DateTime? from = null, DateTime? to = null);
    Task<IEnumerable<AuditLog>> FilterAsync(AuditLogFilter filter);
    Task<Dictionary<string, int>> GetComplianceStatisticsAsync(int tenantId, DateTime from, DateTime to);
    Task<byte[]> ExportComplianceReportAsync(int tenantId, DateTime from, DateTime to);
}

public class AuditLogFilter
{
    public int TenantId { get; set; }
    public int? UserId { get; set; }
    public string? Action { get; set; }
    public string? EntityType { get; set; }
    public int? EntityId { get; set; }
    public string? Category { get; set; }
    public string? Severity { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string? SearchTerm { get; set; }
    public int Skip { get; set; } = 0;
    public int Take { get; set; } = 100;
}
