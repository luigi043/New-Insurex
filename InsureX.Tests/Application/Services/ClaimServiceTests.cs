using Xunit;
using Moq;
using FluentAssertions;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Domain.Enums;
using InsureX.Application.Services;
using InsureX.Application.DTOs;
using InsureX.Application.Exceptions;
using Microsoft.Extensions.Logging;

namespace InsureX.Tests.Application.Services;

public class ClaimServiceTests
{
    private readonly Mock<IClaimRepository> _claimRepositoryMock;
    private readonly Mock<IPolicyRepository> _policyRepositoryMock;
    private readonly Mock<ITenantContext> _tenantContextMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<ClaimService>> _loggerMock;
    private readonly ClaimService _claimService;

    public ClaimServiceTests()
    {
        _claimRepositoryMock = new Mock<IClaimRepository>();
        _policyRepositoryMock = new Mock<IPolicyRepository>();
        _tenantContextMock = new Mock<ITenantContext>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<ClaimService>>();

        _tenantContextMock.Setup(x => x.TenantId).Returns(1);

        _claimService = new ClaimService(
            _claimRepositoryMock.Object,
            _policyRepositoryMock.Object,
            _tenantContextMock.Object,
            _unitOfWorkMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WithValidId_ReturnsClaim()
    {
        // Arrange
        var claim = new Claim { Id = 1, TenantId = 1, ClaimNumber = "CLM-001" };
        _claimRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(claim);

        // Act
        var result = await _claimService.GetByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.ClaimNumber.Should().Be("CLM-001");
    }

    [Fact]
    public async Task GetByIdAsync_WithWrongTenant_ReturnsNull()
    {
        // Arrange
        var claim = new Claim { Id = 1, TenantId = 2, ClaimNumber = "CLM-001" };
        _claimRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(claim);

        // Act
        var result = await _claimService.GetByIdAsync(1);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetByIdAsync_WithNonExistentId_ReturnsNull()
    {
        // Arrange
        _claimRepositoryMock.Setup(x => x.GetByIdAsync(999)).ReturnsAsync((Claim?)null);

        // Act
        var result = await _claimService.GetByIdAsync(999);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetByClaimNumberAsync_WithValidNumber_ReturnsClaim()
    {
        // Arrange
        var claim = new Claim { Id = 1, TenantId = 1, ClaimNumber = "CLM-001" };
        _claimRepositoryMock.Setup(x => x.GetByClaimNumberAsync("CLM-001")).ReturnsAsync(claim);

        // Act
        var result = await _claimService.GetByClaimNumberAsync("CLM-001");

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(1);
    }

    [Fact]
    public async Task GetByStatusAsync_ReturnsClaimsForTenant()
    {
        // Arrange
        var claims = new List<Claim>
        {
            new() { Id = 1, TenantId = 1, Status = ClaimStatus.UnderReview },
            new() { Id = 2, TenantId = 1, Status = ClaimStatus.UnderReview }
        };
        _claimRepositoryMock
            .Setup(x => x.GetByStatusAndTenantAsync(ClaimStatus.UnderReview, 1))
            .ReturnsAsync(claims);

        // Act
        var result = await _claimService.GetByStatusAsync(ClaimStatus.UnderReview);

        // Assert
        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task CreateAsync_WithValidClaim_ReturnsClaim()
    {
        // Arrange
        var claim = new Claim
        {
            ClaimNumber = "CLM-NEW",
            PolicyId = 1,
            ClaimType = ClaimType.PropertyDamage,
            ClaimedAmount = 5000,
            Description = "Test claim",
            IncidentDate = DateTime.UtcNow.AddDays(-1)
        };

        var policy = new Policy { Id = 1, TenantId = 1, Status = PolicyStatus.Active, EndDate = DateTime.UtcNow.AddYears(1), CoverageAmount = 10000 };
        _policyRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(policy);
        _claimRepositoryMock.Setup(x => x.GetByClaimNumberAsync("CLM-NEW")).ReturnsAsync((Claim?)null);
        _claimRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Claim>())).ReturnsAsync(claim);

        // Act
        var result = await _claimService.CreateAsync(claim);

        // Assert
        result.Should().NotBeNull();
        result.TenantId.Should().Be(1);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task SubmitAsync_WithValidClaim_TransitionsToUnderReview()
    {
        // Arrange
        var claim = new Claim
        {
            Id = 1,
            TenantId = 1,
            Status = ClaimStatus.Submitted,
            StatusHistory = new List<ClaimStatusHistory>()
        };
        _claimRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(claim);

        // Act
        var result = await _claimService.SubmitAsync(1);

        // Assert
        result.Status.Should().Be(ClaimStatus.UnderReview);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task ApproveAsync_WithValidClaim_TransitionsToApproved()
    {
        // Arrange
        var claim = new Claim
        {
            Id = 1,
            TenantId = 1,
            Status = ClaimStatus.UnderReview,
            ClaimedAmount = 5000,
            StatusHistory = new List<ClaimStatusHistory>()
        };
        _claimRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(claim);

        // Act
        var result = await _claimService.ApproveAsync(1, 4500, "Approved with deductible");

        // Assert
        result.Status.Should().Be(ClaimStatus.Approved);
        result.ApprovedAmount.Should().Be(4500);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task RejectAsync_WithValidClaim_TransitionsToRejected()
    {
        // Arrange
        var claim = new Claim
        {
            Id = 1,
            TenantId = 1,
            Status = ClaimStatus.UnderReview,
            StatusHistory = new List<ClaimStatusHistory>()
        };
        _claimRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(claim);

        // Act
        var result = await _claimService.RejectAsync(1, "Insufficient evidence");

        // Assert
        result.Status.Should().Be(ClaimStatus.Rejected);
        result.RejectionReason.Should().Be("Insufficient evidence");
    }

    [Fact]
    public async Task MarkAsPaidAsync_WithApprovedClaim_TransitionsToPaid()
    {
        // Arrange
        var claim = new Claim
        {
            Id = 1,
            TenantId = 1,
            Status = ClaimStatus.Approved,
            ApprovedAmount = 4500,
            StatusHistory = new List<ClaimStatusHistory>()
        };
        _claimRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(claim);

        // Act
        var result = await _claimService.MarkAsPaidAsync(1, "PAY-REF-001");

        // Assert
        result.Status.Should().Be(ClaimStatus.Paid);
        result.PaymentReference.Should().Be("PAY-REF-001");
    }

    [Fact]
    public async Task CloseAsync_WithPaidClaim_TransitionsToClosed()
    {
        // Arrange
        var claim = new Claim
        {
            Id = 1,
            TenantId = 1,
            Status = ClaimStatus.Paid,
            StatusHistory = new List<ClaimStatusHistory>()
        };
        _claimRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(claim);

        // Act
        var result = await _claimService.CloseAsync(1, "Claim fully settled");

        // Assert
        result.Status.Should().Be(ClaimStatus.Closed);
    }

    [Fact]
    public async Task GetTotalClaimedAmountAsync_ReturnsTotalForTenant()
    {
        // Arrange
        _claimRepositoryMock.Setup(x => x.GetTotalClaimedAmountAsync(1)).ReturnsAsync(50000m);

        // Act
        var result = await _claimService.GetTotalClaimedAmountAsync();

        // Assert
        result.Should().Be(50000m);
    }

    [Fact]
    public async Task GetTotalPaidAmountAsync_ReturnsTotalForTenant()
    {
        // Arrange
        _claimRepositoryMock.Setup(x => x.GetTotalPaidAmountAsync(1)).ReturnsAsync(35000m);

        // Act
        var result = await _claimService.GetTotalPaidAmountAsync();

        // Assert
        result.Should().Be(35000m);
    }
}
