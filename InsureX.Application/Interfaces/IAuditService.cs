using InsureX.Application.DTOs;
using InsureX.Application.DTOs.Audit;
using InsureX.Domain.Entities;

namespace InsureX.Application.Interfaces;

public interface IAuditService
{
    Task<AuditEntry?> GetByIdAsync(long id);
    Task<PagedResult<AuditEntry>> SearchAsync(AuditFilterRequest filter);
    Task<IEnumerable<AuditEntry>> GetByEntityAsync(string entityType, string entityId);
    Task<IEnumerable<AuditEntry>> GetByUserAsync(int userId, DateTime? from = null, DateTime? to = null);
    Task<AuditComplianceReport> GenerateComplianceReportAsync(DateTime from, DateTime to);
    Task<IEnumerable<string>> GetDistinctEntityTypesAsync();
    Task<IEnumerable<string>> GetDistinctActionsAsync();
    Task<byte[]> ExportAsync(AuditFilterRequest filter, string format = "csv");
}
