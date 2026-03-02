using System;

namespace InsureX.Domain.Entities;

public class ClaimDocument : BaseEntity
{
    public Guid ClaimId { get; set; }
    public Claim Claim { get; set; } = null!;
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string? Description { get; set; }
    public DocumentCategory Category { get; set; }
    public string UploadedBy { get; set; } = string.Empty;
}

public enum DocumentCategory
{
    PoliceReport,
    MedicalReport,
    RepairEstimate,
    PhotoEvidence,
    Receipt,
    LegalDocument,
    Correspondence,
    Other
}