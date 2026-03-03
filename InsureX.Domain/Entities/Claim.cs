using InsureX.Domain.Enums;

namespace InsureX.Domain.Entities;

public class Claim : BaseEntity
{
    public string ClaimNumber { get; set; } = string.Empty;
    public int PolicyId { get; set; }
    public int TenantId { get; set; }
    public int? AssetId { get; set; }
    public ClaimType ClaimType { get; set; }
    public ClaimStatus Status { get; set; } = ClaimStatus.Submitted;
    public decimal ClaimedAmount { get; set; }
    public decimal? ApprovedAmount { get; set; }
    public decimal? DeductibleApplied { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? IncidentLocation { get; set; }
    public DateTime IncidentDate { get; set; }
    public DateTime? ReportedDate { get; set; }
    public string? ReporterName { get; set; }
    public string? ReporterContact { get; set; }
    public string? PoliceReportNumber { get; set; }
    public string? DamageDescription { get; set; }
    public string? ResolutionNotes { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public int? ResolvedById { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public int? ApprovedById { get; set; }
    public DateTime? RejectedAt { get; set; }
    public int? RejectedById { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime? PaidAt { get; set; }
    public int? PaidById { get; set; }
    public string? PaymentReference { get; set; }
    public string? Documents { get; set; } // JSON array of document URLs
    public ICollection<ClaimInvestigationNote> InvestigationNotes { get; set; } = new List<ClaimInvestigationNote>();
    
    // Navigation properties
    public Policy Policy { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
    public Asset? Asset { get; set; }
    public User? ResolvedBy { get; set; }
    public User? ApprovedBy { get; set; }
    public User? RejectedBy { get; set; }
    public User? PaidBy { get; set; }
    public ICollection<ClaimStatusHistory> StatusHistory { get; set; } = new List<ClaimStatusHistory>();
    
    // Workflow methods
    public void Submit()
    {
        if (Status != ClaimStatus.Submitted)
            throw new InvalidOperationException($"Cannot submit claim with status {Status}");
        
        Status = ClaimStatus.UnderReview;
        ReportedDate = DateTime.UtcNow;
        AddStatusHistory(ClaimStatus.UnderReview, "Claim submitted and under review");
    }
    
    public void Approve(decimal approvedAmount, string? notes = null, int? approvedById = null)
    {
        if (Status != ClaimStatus.Submitted && Status != ClaimStatus.UnderReview)
            throw new InvalidOperationException($"Cannot approve claim with status {Status}");
        
        Status = ClaimStatus.Approved;
        ApprovedAmount = approvedAmount;
        ApprovedAt = DateTime.UtcNow;
        ApprovedById = approvedById;
        ResolutionNotes = notes;
        AddStatusHistory(ClaimStatus.Approved, $"Claim approved. Amount: {approvedAmount:C}. {notes}");
    }
    
    public void Reject(string reason, int? rejectedById = null)
    {
        if (Status != ClaimStatus.Submitted && Status != ClaimStatus.UnderReview)
            throw new InvalidOperationException($"Cannot reject claim with status {Status}");
        
        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("Rejection reason is required");
        
        Status = ClaimStatus.Rejected;
        RejectionReason = reason;
        RejectedAt = DateTime.UtcNow;
        RejectedById = rejectedById;
        AddStatusHistory(ClaimStatus.Rejected, $"Claim rejected. Reason: {reason}");
    }
    
    public void MarkAsPaid(string paymentReference, int? paidById = null)
    {
        if (Status != ClaimStatus.Approved)
            throw new InvalidOperationException($"Cannot mark as paid claim with status {Status}");
        
        Status = ClaimStatus.Paid;
        PaidAt = DateTime.UtcNow;
        PaidById = paidById;
        PaymentReference = paymentReference;
        ResolvedAt = DateTime.UtcNow;
        AddStatusHistory(ClaimStatus.Paid, $"Claim paid. Reference: {paymentReference}");
    }
    
    public void Close(string? notes = null)
    {
        if (Status != ClaimStatus.Paid && Status != ClaimStatus.Rejected)
            throw new InvalidOperationException($"Cannot close claim with status {Status}");
        
        Status = ClaimStatus.Closed;
        ResolvedAt = DateTime.UtcNow;
        ResolutionNotes = notes;
        AddStatusHistory(ClaimStatus.Closed, $"Claim closed. {notes}");
    }
    
    private void AddStatusHistory(ClaimStatus newStatus, string? notes = null)
    {
        StatusHistory.Add(new ClaimStatusHistory
        {
            ClaimId = Id,
            FromStatus = Status,
            ToStatus = newStatus,
            ChangedAt = DateTime.UtcNow,
            Notes = notes
        });
    }

    public void AddInvestigationNote(string note, int? createdById = null, bool isInternal = true)
    {
        if (string.IsNullOrWhiteSpace(note))
            throw new ArgumentException("Investigation note is required");

        InvestigationNotes.Add(new ClaimInvestigationNote
        {
            ClaimId = Id,
            Note = note.Trim(),
            CreatedById = createdById,
            IsInternal = isInternal
        });
    }
}

public class ClaimStatusHistory : BaseEntity
{
    public int ClaimId { get; set; }
    public ClaimStatus FromStatus { get; set; }
    public ClaimStatus ToStatus { get; set; }
    public DateTime ChangedAt { get; set; }
    public int? ChangedById { get; set; }
    public string? Notes { get; set; }
    
    // Navigation properties
    public Claim Claim { get; set; } = null!;
    public User? ChangedBy { get; set; }
}

public class ClaimInvestigationNote : BaseEntity
{
    public int ClaimId { get; set; }
    public int? CreatedById { get; set; }
    public string Note { get; set; } = string.Empty;
    public bool IsInternal { get; set; }

    public Claim Claim { get; set; } = null!;
    public User? CreatedBy { get; set; }
}
