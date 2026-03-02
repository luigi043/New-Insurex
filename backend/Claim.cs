using System;
using System.Collections.Generic;

namespace InsureX.Domain.Entities
{
    public class Claim
    {
        public int Id { get; set; }
        public string ClaimNumber { get; set; } = string.Empty;

        // FK to Policy
        public int PolicyId { get; set; }
        public Policy Policy { get; set; } = null!;

        public DateTime DateOfLoss { get; set; }
        public DateTime DateReported { get; set; } = DateTime.UtcNow;

        public ClaimStatus Status { get; set; } = ClaimStatus.Pending;

        public string Description { get; set; } = string.Empty;
        public decimal ClaimedAmount { get; set; }
        public decimal? ApprovedAmount { get; set; }
        public decimal? PaidAmount { get; set; }

        public string ClaimantName { get; set; } = string.Empty;
        public string ClaimantContact { get; set; } = string.Empty;

        public string? AssessorNotes { get; set; }
        public string? RejectionReason { get; set; }

        public DateTime? AssessedDate { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public DateTime? PaidDate { get; set; }

        public ICollection<ClaimDocument> Documents { get; set; } = new List<ClaimDocument>();

        // Audit
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class ClaimDocument
    {
        public int Id { get; set; }
        public int ClaimId { get; set; }
        public Claim Claim { get; set; } = null!;
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }

    public enum ClaimStatus
    {
        Pending = 0,
        UnderReview = 1,
        Assessed = 2,
        Approved = 3,
        PartiallyApproved = 4,
        Rejected = 5,
        Paid = 6,
        Closed = 7
    }
}
