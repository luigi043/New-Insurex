namespace InsureX.Domain.Entities;

public class AuditLog : BaseEntity
{
    public int TenantId { get; set; }
    public int? UserId { get; set; }
    public string Action { get; set; } = string.Empty; // Create, Update, Delete, Login, etc.
    public string EntityType { get; set; } = string.Empty; // Policy, Claim, User, etc.
    public int? EntityId { get; set; }
    public string? OldValues { get; set; } // JSON of previous state
    public string? NewValues { get; set; } // JSON of new state
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime Timestamp { get; set; }
    public string? AdditionalData { get; set; } // JSON for extra context
    public string Severity { get; set; } = "Info"; // Info, Warning, Critical
    public string? Category { get; set; } // Security, Compliance, DataModification, etc.

    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public User? User { get; set; }
}
