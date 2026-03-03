using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Dapper;
using CsvHelper;
using System.Globalization;
using InsureX.Domain.Interfaces;
using InsureX.Shared.DTOs;
using InsureX.Shared.Enums;

namespace InsureX.Infrastructure.Reporting;

public class ReportQueries : IReportQueries
{
    private readonly string _connectionString;
    private readonly ITenantContext _tenantContext;

    public ReportQueries(IConfiguration configuration, ITenantContext tenantContext)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        _tenantContext = tenantContext;
    }

    public async Task<IEnumerable<ComplianceDashboardDto>> GetComplianceDashboardAsync(
        DateTime startDate, 
        DateTime endDate)
    {
        using var connection = new SqlConnection(_connectionString);
        
        const string sql = @"
            WITH ComplianceStats AS (
                SELECT 
                    a.AssetType,
                    COUNT(DISTINCT a.Id) as TotalAssets,
                    COUNT(DISTINCT CASE WHEN cs.IsCompliant = 1 THEN a.Id END) as CompliantAssets,
                    COUNT(DISTINCT CASE WHEN cs.IsCompliant = 0 THEN a.Id END) as NonCompliantAssets,
                    AVG(DATEDIFF(day, cs.LastCheckedDate, GETDATE())) as AvgDaysSinceLastCheck
                FROM Assets a
                LEFT JOIN ComplianceStates cs ON a.Id = cs.AssetId
                WHERE a.TenantId = @TenantId
                    AND (cs.CheckedDate BETWEEN @StartDate AND @EndDate OR cs.CheckedDate IS NULL)
                GROUP BY a.AssetType
            )
            SELECT 
                AssetType,
                TotalAssets,
                CompliantAssets,
                NonCompliantAssets,
                CASE 
                    WHEN TotalAssets > 0 
                    THEN CAST(CompliantAssets AS FLOAT) / TotalAssets * 100 
                    ELSE 0 
                END as ComplianceRate,
                ISNULL(AvgDaysSinceLastCheck, 0) as AvgDaysSinceLastCheck
            FROM ComplianceStats
            ORDER BY ComplianceRate";
        
        var result = await connection.QueryAsync<ComplianceDashboardDto>(sql, new
        {
            TenantId = _tenantContext.TenantId,
            StartDate = startDate,
            EndDate = endDate
        });
        
        return result.ToList();
    }

    public async Task<byte[]> ExportComplianceReportAsync(
        DateTime startDate, 
        DateTime endDate,
        ExportFormat format)
    {
        var data = await GetComplianceDashboardAsync(startDate, endDate);
        
        return format switch
        {
            ExportFormat.CSV => await ExportToCsvAsync(data),
            ExportFormat.Excel => throw new NotImplementedException("Excel export not implemented yet"),
            ExportFormat.PDF => throw new NotImplementedException("PDF export not implemented yet"),
            _ => throw new NotSupportedException($"Format {format} not supported")
        };
    }

    public async Task<byte[]> GenerateReport(string reportName, ExportFormat format, Dictionary<string, object> parameters)
    {
        // Delegate to compliance report as default implementation
        var startDate = parameters.TryGetValue("startDate", out var sd) ? (DateTime)sd : DateTime.UtcNow.AddMonths(-1);
        var endDate = parameters.TryGetValue("endDate", out var ed) ? (DateTime)ed : DateTime.UtcNow;
        return await ExportComplianceReportAsync(startDate, endDate, format);
    }

    public Task<List<ReportDto>> GetAvailableReports()
    {
        var reports = new List<ReportDto>
        {
            new ReportDto
            {
                Id = "compliance-dashboard",
                Name = "Compliance Dashboard",
                Description = "Asset compliance statistics by type",
                Category = "Compliance",
                IsSystem = true
            }
        };
        return Task.FromResult(reports);
    }

    private async Task<byte[]> ExportToCsvAsync(IEnumerable<ComplianceDashboardDto> data)
    {
        using var memoryStream = new MemoryStream();
        using var writer = new StreamWriter(memoryStream);
        using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
        
        await csv.WriteRecordsAsync(data);
        await writer.FlushAsync();
        
        return memoryStream.ToArray();
    }
}
