<<<<<<< HEAD
=======
using InsureX.Domain.Enums;

>>>>>>> main
namespace InsureX.Domain.Entities;

public class ClaimInvestigationNote : BaseEntity
{
    public int ClaimId { get; set; }
    public int TenantId { get; set; }
<<<<<<< HEAD
    public int CreatedByUserId { get; set; }
    public string NoteType { get; set; } = string.Empty; // Investigation, Communication, Evidence, Decision
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? AttachmentUrls { get; set; } // JSON array of document URLs
    public bool IsInternal { get; set; } = true; // Internal notes vs customer-facing
    public string? Tags { get; set; } // JSON array for categorization
    public DateTime NoteDate { get; set; }
=======
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public InvestigationNoteType NoteType { get; set; } = InvestigationNoteType.General;
    public InvestigationPriority Priority { get; set; } = InvestigationPriority.Normal;
    public bool IsConfidential { get; set; }
    public int AuthorId { get; set; }
    public string? AttachmentUrls { get; set; } // JSON array of attachment URLs
    public DateTime? FollowUpDate { get; set; }
    public bool IsResolved { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public int? ResolvedById { get; set; }
>>>>>>> main

    // Navigation properties
    public Claim Claim { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
<<<<<<< HEAD
    public User CreatedByUser { get; set; } = null!;
=======
    public User Author { get; set; } = null!;
    public User? ResolvedBy { get; set; }
>>>>>>> main
}
