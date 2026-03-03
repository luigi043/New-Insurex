namespace InsureX.Domain.Entities;

public class AuditEntry
{
    public long Id { get; set; }
    public int? TenantId { get; set; }
    public int? UserId { get; set; }
    public string? UserEmail { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // Create, Update, Delete, SoftDelete
    public string? OldValues { get; set; } // JSON
    public string? NewValues { get; set; } // JSON
    public string? AffectedColumns { get; set; } // JSON array of changed column names
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? RequestPath { get; set; }
    public string? CorrelationId { get; set; }

    // Navigation
    public Tenant? Tenant { get; set; }
}
