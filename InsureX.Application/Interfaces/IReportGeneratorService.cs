using InsureX.Application.DTOs;
using InsureX.Application.DTOs.Reports;
using InsureX.Domain.Entities;

namespace InsureX.Application.Interfaces;

public interface IReportGeneratorService
{
    // Report Definitions
    Task<IEnumerable<ReportDefinition>> GetAvailableReportsAsync();
    Task<ReportDefinition?> GetReportDefinitionAsync(int id);
    Task<ReportDefinition> CreateReportDefinitionAsync(ReportDefinition definition);
    Task<ReportDefinition> UpdateReportDefinitionAsync(ReportDefinition definition);
    Task DeleteReportDefinitionAsync(int id);

    // Report Generation
    Task<ReportResultDto> GenerateReportAsync(int reportId, ReportParametersDto parameters);
    Task<byte[]> ExportReportAsync(int reportId, ReportParametersDto parameters, ExportFormat format);

    // Predefined Reports
    Task<ReportResultDto> GeneratePolicySummaryReportAsync(DateTime from, DateTime to);
    Task<ReportResultDto> GenerateClaimsSummaryReportAsync(DateTime from, DateTime to);
    Task<ReportResultDto> GenerateFinancialReportAsync(DateTime from, DateTime to);
    Task<ReportResultDto> GenerateLossRatioReportAsync(DateTime from, DateTime to);
    Task<ReportResultDto> GenerateExpiringPoliciesReportAsync(int daysAhead = 30);
    Task<ReportResultDto> GeneratePartnerPerformanceReportAsync(DateTime from, DateTime to);
}
