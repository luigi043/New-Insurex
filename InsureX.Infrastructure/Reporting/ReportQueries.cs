namespace InsureX.Infrastructure.Reporting;

public class ReportQueries : IReportQueries
{
    private readonly string _connectionString;
    private readonly ITenantContext _tenantContext;

    public ReportQueries(IConfiguration configuration, ITenantContext tenantContext)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
        _tenantContext = tenantContext;
    }

    // Port complex legacy reporting query
    public async Task<IEnumerable<ComplianceDashboardDto>> GetComplianceDashboardAsync(
        DateTime startDate, 
        DateTime endDate)
    {
        using var connection = new SqlConnection(_connectionString);
        
        // This is your legacy stored procedure logic, optimized for reporting
        const string sql = @"
            WITH ComplianceStats AS (
                SELECT 
                    a.TenantId,
                    a.AssetType,
                    COUNT(DISTINCT a.Id) as TotalAssets,
                    COUNT(DISTINCT CASE WHEN cs.IsCompliant = 1 THEN a.Id END) as CompliantAssets,
                    COUNT(DISTINCT CASE WHEN cs.IsCompliant = 0 THEN a.Id END) as NonCompliantAssets,
                    AVG(DATEDIFF(day, cs.LastCheckedDate, GETDATE())) as AvgDaysSinceLastCheck
                FROM registry.Assets a
                JOIN compliance.ComplianceStates cs ON a.Id = cs.AssetId
                WHERE a.TenantId = @TenantId
                    AND cs.CheckedDate BETWEEN @StartDate AND @EndDate
                GROUP BY a.TenantId, a.AssetType
            )
            SELECT 
                AssetType,
                TotalAssets,
                CompliantAssets,
                NonCompliantAssets,
                CAST(CompliantAssets AS FLOAT) / NULLIF(TotalAssets, 0) * 100 as ComplianceRate,
                AvgDaysSinceLastCheck
            FROM ComplianceStats
            ORDER BY ComplianceRate";
        
        return await connection.QueryAsync<ComplianceDashboardDto>(sql, new
        {
            TenantId = _tenantContext.TenantId,
            StartDate = startDate,
            EndDate = endDate
        });
    }

    // Export-friendly version
    public async Task<byte[]> ExportComplianceReportAsync(
        DateTime startDate, 
        DateTime endDate,
        ExportFormat format)
    {
        var data = await GetComplianceDashboardAsync(startDate, endDate);
        
        return format switch
        {
            ExportFormat.Csv => await ExportToCsvAsync(data),
            ExportFormat.Excel => await ExportToExcelAsync(data),
            ExportFormat.Pdf => await ExportToPdfAsync(data),
            _ => throw new NotSupportedException($"Format {format} not supported")
        };
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