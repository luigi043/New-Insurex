using InsureX.Domain.Entities;

namespace InsureX.Domain.Interfaces;

public interface IAuditRepository
{
    Task AddAsync(AuditEntry entry);
    Task AddRangeAsync(IEnumerable<AuditEntry> entries);
    Task<AuditEntry?> GetByIdAsync(long id);
    Task<IEnumerable<AuditEntry>> GetByEntityAsync(string entityType, string entityId);
    Task<IEnumerable<AuditEntry>> GetByUserAsync(int userId, DateTime? from = null, DateTime? to = null);
    Task<IEnumerable<AuditEntry>> GetByTenantAsync(int tenantId, DateTime? from = null, DateTime? to = null);
    Task<(IEnumerable<AuditEntry> Items, int TotalCount)> SearchAsync(
        int? tenantId = null,
        int? userId = null,
        string? entityType = null,
        string? action = null,
        DateTime? from = null,
        DateTime? to = null,
        string? searchTerm = null,
        int pageNumber = 1,
        int pageSize = 20);
    Task<IEnumerable<string>> GetDistinctEntityTypesAsync(int tenantId);
    Task<IEnumerable<string>> GetDistinctActionsAsync(int tenantId);
    Task<int> GetCountByDateRangeAsync(int tenantId, DateTime from, DateTime to);
}
