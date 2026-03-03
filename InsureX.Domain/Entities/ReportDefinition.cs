namespace InsureX.Domain.Entities;

public class ReportDefinition : BaseEntity
{
    public int? TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty; // "Policy", "Claims", "Financial", "Compliance", "Custom"
    public bool IsSystem { get; set; } // System reports cannot be deleted
    public string? QueryTemplate { get; set; } // SQL or LINQ query template
    public string? Parameters { get; set; } // JSON array of parameter definitions
    public string? ColumnDefinitions { get; set; } // JSON array of column definitions
    public string? DefaultSortColumn { get; set; }
    public bool DefaultSortDescending { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastRunAt { get; set; }
    public int RunCount { get; set; }

    // Scheduling
    public bool IsScheduled { get; set; }
    public string? CronExpression { get; set; }
    public string? ScheduledRecipients { get; set; } // JSON array of email addresses
    public string? ScheduledFormat { get; set; } // "pdf", "excel", "csv"

    // Navigation properties
    public Tenant? Tenant { get; set; }
}
