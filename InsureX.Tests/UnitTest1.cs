namespace InsureX.Tests;

public class DomainEntityTests
{
    [Fact]
    public void Claim_Submit_TransitionsToUnderReview()
    {
        // Arrange
        var claim = new InsureX.Domain.Entities.Claim
        {
            Id = 1,
            Status = Domain.Enums.ClaimStatus.Submitted,
            StatusHistory = new List<InsureX.Domain.Entities.ClaimStatusHistory>()
        };

        // Act
        claim.Submit();

        // Assert
        claim.Status.Should().Be(Domain.Enums.ClaimStatus.UnderReview);
        claim.ReportedDate.Should().NotBeNull();
    }

    [Fact]
    public void Claim_Approve_TransitionsToApproved()
    {
        // Arrange
        var claim = new InsureX.Domain.Entities.Claim
        {
            Id = 1,
            Status = Domain.Enums.ClaimStatus.UnderReview,
            StatusHistory = new List<InsureX.Domain.Entities.ClaimStatusHistory>()
        };

        // Act
        claim.Approve(5000, "Approved");

        // Assert
        claim.Status.Should().Be(Domain.Enums.ClaimStatus.Approved);
        claim.ApprovedAmount.Should().Be(5000);
        claim.ApprovedAt.Should().NotBeNull();
    }

    [Fact]
    public void Claim_Reject_RequiresReason()
    {
        // Arrange
        var claim = new InsureX.Domain.Entities.Claim
        {
            Id = 1,
            Status = Domain.Enums.ClaimStatus.UnderReview,
            StatusHistory = new List<InsureX.Domain.Entities.ClaimStatusHistory>()
        };

        // Act & Assert
        Assert.Throws<ArgumentException>(() => claim.Reject(""));
    }

    [Fact]
    public void Claim_MarkAsPaid_RequiresApprovedStatus()
    {
        // Arrange
        var claim = new InsureX.Domain.Entities.Claim
        {
            Id = 1,
            Status = Domain.Enums.ClaimStatus.Submitted,
            StatusHistory = new List<InsureX.Domain.Entities.ClaimStatusHistory>()
        };

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => claim.MarkAsPaid("REF-001"));
    }

    [Fact]
    public void Claim_Close_RequiresPaidOrRejectedStatus()
    {
        // Arrange
        var claim = new InsureX.Domain.Entities.Claim
        {
            Id = 1,
            Status = Domain.Enums.ClaimStatus.Approved,
            StatusHistory = new List<InsureX.Domain.Entities.ClaimStatusHistory>()
        };

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => claim.Close());
    }

    [Fact]
    public void Policy_IsExpired_ReturnsTrueWhenPastEndDate()
    {
        // Arrange
        var policy = new InsureX.Domain.Entities.Policy
        {
            EndDate = DateTime.UtcNow.AddDays(-1)
        };

        // Assert
        policy.IsExpired.Should().BeTrue();
    }

    [Fact]
    public void Policy_IsActive_ReturnsTrueWhenActiveAndNotExpired()
    {
        // Arrange
        var policy = new InsureX.Domain.Entities.Policy
        {
            Status = Domain.Enums.PolicyStatus.Active,
            EndDate = DateTime.UtcNow.AddDays(30)
        };

        // Assert
        policy.IsActive.Should().BeTrue();
    }

    [Fact]
    public void BaseEntity_SetCreated_SetsTimestampAndCreator()
    {
        // Arrange
        var entity = new InsureX.Domain.Entities.Claim();

        // Act
        entity.SetCreated("admin");

        // Assert
        entity.CreatedBy.Should().Be("admin");
        entity.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void BaseEntity_SoftDelete_SetsIsDeletedAndUpdated()
    {
        // Arrange
        var entity = new InsureX.Domain.Entities.Claim();

        // Act
        entity.SoftDelete("admin");

        // Assert
        entity.IsDeleted.Should().BeTrue();
        entity.UpdatedBy.Should().Be("admin");
    }

    [Fact]
    public void Invoice_RecordPayment_UpdatesStatusToPartiallyPaid()
    {
        // Arrange
        var invoice = new InsureX.Domain.Entities.Invoice
        {
            Amount = 1000,
            TaxAmount = 100,
            PaidAmount = 0,
            Status = Domain.Enums.InvoiceStatus.Sent,
            DueDate = DateTime.UtcNow.AddDays(30)
        };

        // Act
        invoice.RecordPayment(500);

        // Assert
        invoice.PaidAmount.Should().Be(500);
        invoice.Status.Should().Be(Domain.Enums.InvoiceStatus.PartiallyPaid);
    }

    [Fact]
    public void Invoice_RecordPayment_FullPayment_UpdatesStatusToPaid()
    {
        // Arrange
        var invoice = new InsureX.Domain.Entities.Invoice
        {
            Amount = 1000,
            TaxAmount = 100,
            PaidAmount = 0,
            Status = Domain.Enums.InvoiceStatus.Sent,
            DueDate = DateTime.UtcNow.AddDays(30)
        };

        // Act
        invoice.RecordPayment(1100);

        // Assert
        invoice.PaidAmount.Should().Be(1100);
        invoice.Status.Should().Be(Domain.Enums.InvoiceStatus.Paid);
        invoice.PaidDate.Should().NotBeNull();
    }
}
