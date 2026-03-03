using System.Text;
using InsureX.Application.DTOs;
using InsureX.Application.DTOs.Reports;
using InsureX.Application.Exceptions;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace InsureX.Infrastructure.Reporting;

public class ReportGeneratorService : IReportGeneratorService
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;
    private readonly ILogger<ReportGeneratorService> _logger;

    public ReportGeneratorService(
        ApplicationDbContext context,
        ITenantContext tenantContext,
        ILogger<ReportGeneratorService> logger)
    {
        _context = context;
        _tenantContext = tenantContext;
        _logger = logger;
    }

    // Report Definitions
    public async Task<IEnumerable<ReportDefinition>> GetAvailableReportsAsync()
    {
        return await _context.Set<ReportDefinition>()
            .Where(r => (r.TenantId == null || r.TenantId == _tenantContext.TenantId) &&
                        r.IsActive && !r.IsDeleted)
            .OrderBy(r => r.Category)
            .ThenBy(r => r.Name)
            .ToListAsync();
    }

    public async Task<ReportDefinition?> GetReportDefinitionAsync(int id)
    {
        return await _context.Set<ReportDefinition>()
            .FirstOrDefaultAsync(r => r.Id == id &&
                (r.TenantId == null || r.TenantId == _tenantContext.TenantId) &&
                !r.IsDeleted);
    }

    public async Task<ReportDefinition> CreateReportDefinitionAsync(ReportDefinition definition)
    {
        if (string.IsNullOrWhiteSpace(definition.Name))
            throw new ValidationException("Report name is required");

        definition.TenantId = _tenantContext.TenantId;
        definition.IsSystem = false;
        definition.SetCreated("system");

        _context.Set<ReportDefinition>().Add(definition);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Report definition '{Name}' created", definition.Name);
        return definition;
    }

    public async Task<ReportDefinition> UpdateReportDefinitionAsync(ReportDefinition definition)
    {
        var existing = await GetReportDefinitionAsync(definition.Id);
        if (existing == null)
            throw new NotFoundException("Report definition not found");

        if (existing.IsSystem)
            throw new ValidationException("System reports cannot be modified");

        existing.Name = definition.Name;
        existing.Description = definition.Description;
        existing.Category = definition.Category;
        existing.QueryTemplate = definition.QueryTemplate;
        existing.Parameters = definition.Parameters;
        existing.ColumnDefinitions = definition.ColumnDefinitions;
        existing.DefaultSortColumn = definition.DefaultSortColumn;
        existing.DefaultSortDescending = definition.DefaultSortDescending;
        existing.IsScheduled = definition.IsScheduled;
        existing.CronExpression = definition.CronExpression;
        existing.ScheduledRecipients = definition.ScheduledRecipients;
        existing.ScheduledFormat = definition.ScheduledFormat;
        existing.SetUpdated("system");

        await _context.SaveChangesAsync();

        _logger.LogInformation("Report definition '{Name}' updated", existing.Name);
        return existing;
    }

    public async Task DeleteReportDefinitionAsync(int id)
    {
        var definition = await GetReportDefinitionAsync(id);
        if (definition == null)
            throw new NotFoundException("Report definition not found");

        if (definition.IsSystem)
            throw new ValidationException("System reports cannot be deleted");

        definition.SoftDelete("system");
        await _context.SaveChangesAsync();
    }

    // Report Generation
    public async Task<ReportResultDto> GenerateReportAsync(int reportId, ReportParametersDto parameters)
    {
        var definition = await GetReportDefinitionAsync(reportId);
        if (definition == null)
            throw new NotFoundException("Report definition not found");

        // Update run stats
        definition.LastRunAt = DateTime.UtcNow;
        definition.RunCount++;

        // Route to predefined report generators based on category
        var result = definition.Category switch
        {
            "Policy" => await GeneratePolicySummaryReportAsync(
                parameters.FromDate ?? DateTime.UtcNow.AddMonths(-1),
                parameters.ToDate ?? DateTime.UtcNow),
            "Claims" => await GenerateClaimsSummaryReportAsync(
                parameters.FromDate ?? DateTime.UtcNow.AddMonths(-1),
                parameters.ToDate ?? DateTime.UtcNow),
            "Financial" => await GenerateFinancialReportAsync(
                parameters.FromDate ?? DateTime.UtcNow.AddMonths(-1),
                parameters.ToDate ?? DateTime.UtcNow),
            _ => await GenerateCustomReportAsync(definition, parameters)
        };

        result.ReportName = definition.Name;
        await _context.SaveChangesAsync();

        _logger.LogInformation("Report '{Name}' generated with {RowCount} rows", definition.Name, result.TotalRows);
        return result;
    }

    public async Task<byte[]> ExportReportAsync(int reportId, ReportParametersDto parameters, ExportFormat format)
    {
        var result = await GenerateReportAsync(reportId, parameters);

        return format switch
        {
            ExportFormat.Csv => ExportToCsv(result),
            _ => ExportToCsv(result) // Default to CSV
        };
    }

    // Predefined Reports
    public async Task<ReportResultDto> GeneratePolicySummaryReportAsync(DateTime from, DateTime to)
    {
        var tenantId = _tenantContext.TenantId;
        var policies = await _context.Policies
            .Where(p => p.TenantId == tenantId && p.CreatedAt >= from && p.CreatedAt <= to && !p.IsDeleted)
            .ToListAsync();

        var result = new ReportResultDto
        {
            ReportName = "Policy Summary Report",
            PeriodFrom = from,
            PeriodTo = to,
            Columns = new List<string> { "PolicyNumber", "Type", "Status", "PremiumAmount", "CoverageAmount", "StartDate", "EndDate", "CreatedAt" },
            Rows = policies.Select(p => new Dictionary<string, object?>
            {
                ["PolicyNumber"] = p.PolicyNumber,
                ["Type"] = p.Type.ToString(),
                ["Status"] = p.Status.ToString(),
                ["PremiumAmount"] = p.PremiumAmount,
                ["CoverageAmount"] = p.CoverageAmount,
                ["StartDate"] = p.StartDate.ToString("yyyy-MM-dd"),
                ["EndDate"] = p.EndDate.ToString("yyyy-MM-dd"),
                ["CreatedAt"] = p.CreatedAt.ToString("yyyy-MM-dd HH:mm")
            }).ToList(),
            Summary = new Dictionary<string, object?>
            {
                ["TotalPolicies"] = policies.Count,
                ["TotalPremium"] = policies.Sum(p => p.PremiumAmount),
                ["TotalCoverage"] = policies.Sum(p => p.CoverageAmount),
                ["ActivePolicies"] = policies.Count(p => p.Status == PolicyStatus.Active),
                ["DraftPolicies"] = policies.Count(p => p.Status == PolicyStatus.Draft),
                ["CancelledPolicies"] = policies.Count(p => p.Status == PolicyStatus.Cancelled),
                ["ByType"] = policies.GroupBy(p => p.Type.ToString()).ToDictionary(g => g.Key, g => (object?)g.Count())
            },
            TotalRows = policies.Count
        };

        return result;
    }

    public async Task<ReportResultDto> GenerateClaimsSummaryReportAsync(DateTime from, DateTime to)
    {
        var tenantId = _tenantContext.TenantId;
        var claims = await _context.Claims
            .Include(c => c.Policy)
            .Where(c => c.TenantId == tenantId && c.CreatedAt >= from && c.CreatedAt <= to && !c.IsDeleted)
            .ToListAsync();

        var result = new ReportResultDto
        {
            ReportName = "Claims Summary Report",
            PeriodFrom = from,
            PeriodTo = to,
            Columns = new List<string> { "ClaimNumber", "PolicyNumber", "ClaimType", "Status", "ClaimedAmount", "ApprovedAmount", "IncidentDate", "CreatedAt" },
            Rows = claims.Select(c => new Dictionary<string, object?>
            {
                ["ClaimNumber"] = c.ClaimNumber,
                ["PolicyNumber"] = c.Policy?.PolicyNumber,
                ["ClaimType"] = c.ClaimType.ToString(),
                ["Status"] = c.Status.ToString(),
                ["ClaimedAmount"] = c.ClaimedAmount,
                ["ApprovedAmount"] = c.ApprovedAmount,
                ["IncidentDate"] = c.IncidentDate.ToString("yyyy-MM-dd"),
                ["CreatedAt"] = c.CreatedAt.ToString("yyyy-MM-dd HH:mm")
            }).ToList(),
            Summary = new Dictionary<string, object?>
            {
                ["TotalClaims"] = claims.Count,
                ["TotalClaimedAmount"] = claims.Sum(c => c.ClaimedAmount),
                ["TotalApprovedAmount"] = claims.Where(c => c.ApprovedAmount.HasValue).Sum(c => c.ApprovedAmount ?? 0),
                ["ApprovedClaims"] = claims.Count(c => c.Status == ClaimStatus.Approved),
                ["RejectedClaims"] = claims.Count(c => c.Status == ClaimStatus.Rejected),
                ["PendingClaims"] = claims.Count(c => c.Status == ClaimStatus.Submitted || c.Status == ClaimStatus.UnderReview),
                ["PaidClaims"] = claims.Count(c => c.Status == ClaimStatus.Paid),
                ["ByType"] = claims.GroupBy(c => c.ClaimType.ToString()).ToDictionary(g => g.Key, g => (object?)g.Count())
            },
            TotalRows = claims.Count
        };

        return result;
    }

    public async Task<ReportResultDto> GenerateFinancialReportAsync(DateTime from, DateTime to)
    {
        var tenantId = _tenantContext.TenantId;

        var policies = await _context.Policies
            .Where(p => p.TenantId == tenantId && p.Status == PolicyStatus.Active && !p.IsDeleted)
            .ToListAsync();

        var claims = await _context.Claims
            .Where(c => c.TenantId == tenantId && c.CreatedAt >= from && c.CreatedAt <= to && !c.IsDeleted)
            .ToListAsync();

        var invoices = await _context.Invoices
            .Where(i => i.TenantId == tenantId && i.IssueDate >= from && i.IssueDate <= to && !i.IsDeleted)
            .ToListAsync();

        var totalPremium = policies.Sum(p => p.PremiumAmount);
        var totalClaimed = claims.Sum(c => c.ClaimedAmount);
        var totalPaid = claims.Where(c => c.Status == ClaimStatus.Paid).Sum(c => c.ApprovedAmount ?? 0);
        var totalInvoiced = invoices.Sum(i => i.Amount + i.TaxAmount);
        var totalCollected = invoices.Sum(i => i.PaidAmount);
        var lossRatio = totalPremium > 0 ? (totalPaid / totalPremium) * 100 : 0;

        var result = new ReportResultDto
        {
            ReportName = "Financial Summary Report",
            PeriodFrom = from,
            PeriodTo = to,
            Columns = new List<string> { "Metric", "Value" },
            Rows = new List<Dictionary<string, object?>>
            {
                new() { ["Metric"] = "Total Active Premium", ["Value"] = totalPremium },
                new() { ["Metric"] = "Total Claims Amount", ["Value"] = totalClaimed },
                new() { ["Metric"] = "Total Claims Paid", ["Value"] = totalPaid },
                new() { ["Metric"] = "Loss Ratio (%)", ["Value"] = Math.Round(lossRatio, 2) },
                new() { ["Metric"] = "Total Invoiced", ["Value"] = totalInvoiced },
                new() { ["Metric"] = "Total Collected", ["Value"] = totalCollected },
                new() { ["Metric"] = "Outstanding Balance", ["Value"] = totalInvoiced - totalCollected },
                new() { ["Metric"] = "Active Policies", ["Value"] = policies.Count },
                new() { ["Metric"] = "Claims Filed", ["Value"] = claims.Count },
                new() { ["Metric"] = "Invoices Issued", ["Value"] = invoices.Count }
            },
            Summary = new Dictionary<string, object?>
            {
                ["TotalPremium"] = totalPremium,
                ["TotalClaimsPaid"] = totalPaid,
                ["LossRatio"] = Math.Round(lossRatio, 2),
                ["TotalInvoiced"] = totalInvoiced,
                ["TotalCollected"] = totalCollected,
                ["OutstandingBalance"] = totalInvoiced - totalCollected
            },
            TotalRows = 10
        };

        return result;
    }

    public async Task<ReportResultDto> GenerateLossRatioReportAsync(DateTime from, DateTime to)
    {
        var tenantId = _tenantContext.TenantId;

        var policies = await _context.Policies
            .Where(p => p.TenantId == tenantId && !p.IsDeleted)
            .ToListAsync();

        var claims = await _context.Claims
            .Where(c => c.TenantId == tenantId && c.CreatedAt >= from && c.CreatedAt <= to && !c.IsDeleted)
            .ToListAsync();

        var byType = policies.GroupBy(p => p.Type).Select(g =>
        {
            var typePremium = g.Sum(p => p.PremiumAmount);
            var typeClaims = claims.Where(c => g.Any(p => p.Id == c.PolicyId));
            var typePaid = typeClaims.Where(c => c.Status == ClaimStatus.Paid).Sum(c => c.ApprovedAmount ?? 0);
            var ratio = typePremium > 0 ? (typePaid / typePremium) * 100 : 0;

            return new Dictionary<string, object?>
            {
                ["PolicyType"] = g.Key.ToString(),
                ["PolicyCount"] = g.Count(),
                ["TotalPremium"] = typePremium,
                ["ClaimCount"] = typeClaims.Count(),
                ["TotalPaid"] = typePaid,
                ["LossRatio"] = Math.Round(ratio, 2)
            };
        }).ToList();

        return new ReportResultDto
        {
            ReportName = "Loss Ratio Report",
            PeriodFrom = from,
            PeriodTo = to,
            Columns = new List<string> { "PolicyType", "PolicyCount", "TotalPremium", "ClaimCount", "TotalPaid", "LossRatio" },
            Rows = byType,
            TotalRows = byType.Count
        };
    }

    public async Task<ReportResultDto> GenerateExpiringPoliciesReportAsync(int daysAhead = 30)
    {
        var tenantId = _tenantContext.TenantId;
        var cutoff = DateTime.UtcNow.AddDays(daysAhead);

        var policies = await _context.Policies
            .Include(p => p.Insured)
            .Include(p => p.Broker)
            .Where(p => p.TenantId == tenantId &&
                       p.Status == PolicyStatus.Active &&
                       p.EndDate <= cutoff &&
                       p.EndDate >= DateTime.UtcNow &&
                       !p.IsDeleted)
            .OrderBy(p => p.EndDate)
            .ToListAsync();

        return new ReportResultDto
        {
            ReportName = "Expiring Policies Report",
            Columns = new List<string> { "PolicyNumber", "Type", "InsuredName", "BrokerName", "PremiumAmount", "EndDate", "DaysUntilExpiry" },
            Rows = policies.Select(p => new Dictionary<string, object?>
            {
                ["PolicyNumber"] = p.PolicyNumber,
                ["Type"] = p.Type.ToString(),
                ["InsuredName"] = p.Insured?.Name,
                ["BrokerName"] = p.Broker?.Name,
                ["PremiumAmount"] = p.PremiumAmount,
                ["EndDate"] = p.EndDate.ToString("yyyy-MM-dd"),
                ["DaysUntilExpiry"] = p.DaysUntilExpiry
            }).ToList(),
            Summary = new Dictionary<string, object?>
            {
                ["TotalExpiring"] = policies.Count,
                ["TotalPremiumAtRisk"] = policies.Sum(p => p.PremiumAmount)
            },
            TotalRows = policies.Count
        };
    }

    public async Task<ReportResultDto> GeneratePartnerPerformanceReportAsync(DateTime from, DateTime to)
    {
        var tenantId = _tenantContext.TenantId;

        var partners = await _context.Partners
            .Where(p => p.TenantId == tenantId && !p.IsDeleted)
            .ToListAsync();

        var policies = await _context.Policies
            .Where(p => p.TenantId == tenantId && p.CreatedAt >= from && p.CreatedAt <= to && !p.IsDeleted)
            .ToListAsync();

        var rows = partners.Select(partner =>
        {
            var partnerPolicies = policies.Where(p => p.BrokerId == partner.Id || p.InsuredId == partner.Id).ToList();
            return new Dictionary<string, object?>
            {
                ["PartnerName"] = partner.Name,
                ["Type"] = partner.Type.ToString(),
                ["Status"] = partner.Status.ToString(),
                ["PoliciesCount"] = partnerPolicies.Count,
                ["TotalPremium"] = partnerPolicies.Sum(p => p.PremiumAmount),
                ["ActivePolicies"] = partnerPolicies.Count(p => p.Status == PolicyStatus.Active)
            };
        }).ToList();

        return new ReportResultDto
        {
            ReportName = "Partner Performance Report",
            PeriodFrom = from,
            PeriodTo = to,
            Columns = new List<string> { "PartnerName", "Type", "Status", "PoliciesCount", "TotalPremium", "ActivePolicies" },
            Rows = rows,
            TotalRows = rows.Count
        };
    }

    private async Task<ReportResultDto> GenerateCustomReportAsync(ReportDefinition definition, ReportParametersDto parameters)
    {
        // For custom reports, return a basic structure
        return new ReportResultDto
        {
            ReportName = definition.Name,
            PeriodFrom = parameters.FromDate,
            PeriodTo = parameters.ToDate,
            Columns = new List<string> { "Info" },
            Rows = new List<Dictionary<string, object?>>
            {
                new() { ["Info"] = "Custom report execution - configure QueryTemplate for data" }
            },
            TotalRows = 1
        };
    }

    private static byte[] ExportToCsv(ReportResultDto result)
    {
        var sb = new StringBuilder();

        // Header
        sb.AppendLine(string.Join(",", result.Columns.Select(c => $"\"{c}\"")));

        // Rows
        foreach (var row in result.Rows)
        {
            var values = result.Columns.Select(col =>
            {
                var val = row.TryGetValue(col, out var v) ? v?.ToString() ?? "" : "";
                return $"\"{val.Replace("\"", "\"\"")}\"";
            });
            sb.AppendLine(string.Join(",", values));
        }

        return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
    }
}
