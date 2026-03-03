using InsureX.Shared.DTOs;
using InsureX.Shared.Enums;

namespace InsureX.Domain.Interfaces;

public interface IReportQueries
{
    Task<ComplianceDashboardDto> GetComplianceDashboardAsync(DateTime? startDate = null, DateTime? endDate = null);
    Task<byte[]> ExportReportAsync(string reportType, ExportFormat format, Dictionary<string, object> parameters);
}
