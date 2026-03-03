namespace InsureX.Domain.Entities;

public class ClaimInvestigationNote : BaseEntity
{
    public int ClaimId { get; set; }
    public int TenantId { get; set; }
    public int CreatedByUserId { get; set; }
    public string NoteType { get; set; } = string.Empty; // Investigation, Communication, Evidence, Decision
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? AttachmentUrls { get; set; } // JSON array of document URLs
    public bool IsInternal { get; set; } = true; // Internal notes vs customer-facing
    public string? Tags { get; set; } // JSON array for categorization
    public DateTime NoteDate { get; set; }

    // Navigation properties
    public Claim Claim { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
    public User CreatedByUser { get; set; } = null!;
}
