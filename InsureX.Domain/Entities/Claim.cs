using System;
using System.Collections.Generic;

namespace InsureX.Domain.Entities;

public class Claim
{
    public Guid Id { get; set; }
    public string ClaimNumber { get; set; } = string.Empty;
    public Guid PolicyId { get; set; }
    public Policy Policy { get; set; } = null!;
    public Guid ClientId { get; set; }
    public User Client { get; set; } = null!;
    public DateTime IncidentDate { get; set; }
    public DateTime ReportedDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? IncidentLocation { get; set; }
    public decimal ClaimedAmount { get; set; }
    public decimal? ApprovedAmount { get; set; }
    public ClaimStatus Status { get; set; }
    
    // ADD THIS
    public bool IsDeleted { get; set; } = false;
    
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? ApprovedBy { get; set; }
    public DateTime? PaidAt { get; set; }
    public string? PaymentReference { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

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