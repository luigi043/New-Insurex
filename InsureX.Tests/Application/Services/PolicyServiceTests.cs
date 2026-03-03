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

public class PolicyServiceTests
{
    private readonly Mock<IPolicyRepository> _policyRepositoryMock;
    private readonly Mock<ITenantContext> _tenantContextMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<PolicyService>> _loggerMock;
    private readonly PolicyService _policyService;

    public PolicyServiceTests()
    {
        _policyRepositoryMock = new Mock<IPolicyRepository>();
        _tenantContextMock = new Mock<ITenantContext>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<PolicyService>>();

        _tenantContextMock.Setup(x => x.TenantId).Returns(1);

        _policyService = new PolicyService(
            _policyRepositoryMock.Object,
            _tenantContextMock.Object,
            _unitOfWorkMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WithValidId_ReturnsPolicy()
    {
        // Arrange
        var policy = new Policy { Id = 1, TenantId = 1, PolicyNumber = "POL-001" };
        _policyRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(policy);

        // Act
        var result = await _policyService.GetByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.PolicyNumber.Should().Be("POL-001");
    }

    [Fact]
    public async Task GetByIdAsync_WithWrongTenant_ReturnsNull()
    {
        // Arrange
        var policy = new Policy { Id = 1, TenantId = 2, PolicyNumber = "POL-001" };
        _policyRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(policy);

        // Act
        var result = await _policyService.GetByIdAsync(1);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetByPolicyNumberAsync_WithValidNumber_ReturnsPolicy()
    {
        // Arrange
        var policy = new Policy { Id = 1, TenantId = 1, PolicyNumber = "POL-001" };
        _policyRepositoryMock.Setup(x => x.GetByPolicyNumberAsync("POL-001")).ReturnsAsync(policy);

        // Act
        var result = await _policyService.GetByPolicyNumberAsync("POL-001");

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(1);
    }

    [Fact]
    public async Task GetByStatusAsync_ReturnsFilteredPolicies()
    {
        // Arrange
        var policies = new List<Policy>
        {
            new() { Id = 1, TenantId = 1, Status = PolicyStatus.Active },
            new() { Id = 2, TenantId = 1, Status = PolicyStatus.Active }
        };
        _policyRepositoryMock
            .Setup(x => x.GetByStatusAndTenantAsync(PolicyStatus.Active, 1))
            .ReturnsAsync(policies);

        // Act
        var result = await _policyService.GetByStatusAsync(PolicyStatus.Active);

        // Assert
        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task CreateAsync_WithValidPolicy_ReturnsPolicy()
    {
        // Arrange
        var policy = new Policy
        {
            PolicyNumber = "POL-NEW",
            Type = PolicyType.Property,
            PremiumAmount = 1000,
            CoverageAmount = 50000,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddYears(1)
        };

        _policyRepositoryMock.Setup(x => x.GetByPolicyNumberAsync("POL-NEW")).ReturnsAsync((Policy?)null);
        _policyRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Policy>())).ReturnsAsync(policy);

        // Act
        var result = await _policyService.CreateAsync(policy);

        // Assert
        result.Should().NotBeNull();
        result.TenantId.Should().Be(1);
        result.Status.Should().Be(PolicyStatus.Draft);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WithEmptyPolicyNumber_ThrowsValidation()
    {
        // Arrange
        var policy = new Policy { PolicyNumber = "" };

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => _policyService.CreateAsync(policy));
    }

    [Fact]
    public async Task DeleteAsync_WithValidId_SoftDeletes()
    {
        // Arrange
        var policy = new Policy { Id = 1, TenantId = 1, PolicyNumber = "POL-001" };
        _policyRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(policy);

        // Act
        await _policyService.DeleteAsync(1);

        // Assert
        _policyRepositoryMock.Verify(x => x.DeleteAsync(It.IsAny<Policy>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WithNonExistentId_ThrowsNotFound()
    {
        // Arrange
        _policyRepositoryMock.Setup(x => x.GetByIdAsync(999)).ReturnsAsync((Policy?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _policyService.DeleteAsync(999));
    }

    [Fact]
    public async Task GetTotalPremiumAsync_ReturnsTotalForTenant()
    {
        // Arrange
        _policyRepositoryMock.Setup(x => x.GetTotalPremiumAsync(1)).ReturnsAsync(100000m);

        // Act
        var result = await _policyService.GetTotalPremiumAsync();

        // Assert
        result.Should().Be(100000m);
    }

    [Fact]
    public async Task GetTotalCoverageAsync_ReturnsTotalForTenant()
    {
        // Arrange
        _policyRepositoryMock.Setup(x => x.GetTotalCoverageAsync(1)).ReturnsAsync(5000000m);

        // Act
        var result = await _policyService.GetTotalCoverageAsync();

        // Assert
        result.Should().Be(5000000m);
    }

    [Fact]
    public async Task GetActivePolicyCountAsync_ReturnsCountForTenant()
    {
        // Arrange
        _policyRepositoryMock.Setup(x => x.GetActivePolicyCountAsync(1)).ReturnsAsync(42);

        // Act
        var result = await _policyService.GetActivePolicyCountAsync();

        // Assert
        result.Should().Be(42);
    }
}
