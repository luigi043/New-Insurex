namespace InsureX.Application.DTOs;

public class CreateClaimInvestigationNoteDto
{
    public int ClaimId { get; set; }
    public string NoteType { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string>? AttachmentUrls { get; set; }
    public bool IsInternal { get; set; } = true;
    public List<string>? Tags { get; set; }
}

public class UpdateClaimInvestigationNoteDto
{
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string>? AttachmentUrls { get; set; }
    public bool IsInternal { get; set; }
    public List<string>? Tags { get; set; }
}

public class ClaimInvestigationNoteResponseDto
{
    public int Id { get; set; }
    public int ClaimId { get; set; }
    public string NoteType { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string>? AttachmentUrls { get; set; }
    public bool IsInternal { get; set; }
    public List<string>? Tags { get; set; }
    public DateTime NoteDate { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
