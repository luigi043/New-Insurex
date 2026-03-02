namespace InsureX.Domain.Entities
{
    public class Claim : BaseEntity
    {
        public string ClaimNumber { get; set; } = string.Empty;
        public Guid PolicyId { get; set; }
        public Policy Policy { get; set; } = null!;
        public Guid ClientId { get; set; }
        public User Client { get; set; } = null!;
        public DateTime IncidentDate { get; set; }
        public DateTime ReportedDate { get; set; } = DateTime.UtcNow;
        public string Description { get; set; } = string.Empty;
        public string? IncidentLocation { get; set; }
        public decimal ClaimedAmount { get; set; }
        public decimal? ApprovedAmount { get; set; }
        public ClaimStatus Status { get; set; } = ClaimStatus.Submitted;
        public ClaimType Type { get; set; }
        
        public DateTime? ReviewedAt { get; set; }
        public string? ReviewedBy { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public string? ApprovedBy { get; set; }
        public DateTime? PaidAt { get; set; }
        public string? PaymentReference { get; set; }
        public string? RejectionReason { get; set; }
        
        public ICollection<ClaimDocument> Documents { get; set; } = new List<ClaimDocument>();
        public ICollection<ClaimNote> Notes { get; set; } = new List<ClaimNote>();
        public ICollection<ClaimStatusHistory> StatusHistory { get; set; } = new List<ClaimStatusHistory>();
    }

    public enum ClaimStatus
    {
        Submitted,
        UnderReview,
        AdditionalInfoRequired,
        Approved,
        Rejected,
        Paid,
        Closed,
        Withdrawn
    }

    public enum ClaimType
    {
        PropertyDamage,
        Theft,
        Liability,
        PersonalInjury,
        BusinessInterruption,
        VehicleAccident,
        NaturalDisaster,
        Fire,
        Other
    }

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

    public class ClaimNote : BaseEntity
    {
        public Guid ClaimId { get; set; }
        public Claim Claim { get; set; } = null!;
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public bool IsInternal { get; set; }
    }

    public class ClaimStatusHistory : BaseEntity
    {
        public Guid ClaimId { get; set; }
        public Claim Claim { get; set; } = null!;
        public ClaimStatus OldStatus { get; set; }
        public ClaimStatus NewStatus { get; set; }
        public string ChangedBy { get; set; } = string.Empty;
        public string? Reason { get; set; }
    }
}