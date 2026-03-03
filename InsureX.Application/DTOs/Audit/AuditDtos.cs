namespace InsureX.Application.DTOs.Audit;

public class AuditFilterRequest : PaginationRequest
{
    public int? UserId { get; set; }
    public string? EntityType { get; set; }
    public string? EntityId { get; set; }
    public string? Action { get; set; }
}

public class AuditComplianceReport
{
    public DateTime ReportGeneratedAt { get; set; } = DateTime.UtcNow;
    public DateTime PeriodFrom { get; set; }
    public DateTime PeriodTo { get; set; }
    public int TotalAuditEntries { get; set; }
    public Dictionary<string, int> EntriesByAction { get; set; } = new();
    public Dictionary<string, int> EntriesByEntityType { get; set; } = new();
    public Dictionary<string, int> EntriesByUser { get; set; } = new();
    public List<AuditDailySummary> DailySummary { get; set; } = new();
    public List<AuditHighRiskActivity> HighRiskActivities { get; set; } = new();
}

public class AuditDailySummary
{
    public DateTime Date { get; set; }
    public int TotalActions { get; set; }
    public int Creates { get; set; }
    public int Updates { get; set; }
    public int Deletes { get; set; }
}

public class AuditHighRiskActivity
{
    public DateTime Timestamp { get; set; }
    public string? UserEmail { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string? Description { get; set; }
}
