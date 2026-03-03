using InsureX.Shared.Enums;
using InsureX.Shared.DTOs;

namespace InsureX.Domain.Interfaces;

public interface IReportQueries
{
    Task<byte[]> GenerateReport(string reportName, ExportFormat format, Dictionary<string, object> parameters);
    Task<List<ReportDto>> GetAvailableReports();
}
