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

public class PartnerServiceTests
{
    private readonly Mock<IPartnerRepository> _partnerRepositoryMock;
    private readonly Mock<ITenantContext> _tenantContextMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<PartnerService>> _loggerMock;
    private readonly PartnerService _partnerService;

    public PartnerServiceTests()
    {
        _partnerRepositoryMock = new Mock<IPartnerRepository>();
        _tenantContextMock = new Mock<ITenantContext>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<PartnerService>>();

        _tenantContextMock.Setup(x => x.TenantId).Returns(1);

        _partnerService = new PartnerService(
            _partnerRepositoryMock.Object,
            _tenantContextMock.Object,
            _unitOfWorkMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WithValidId_ReturnsPartner()
    {
        // Arrange
        var partner = new Partner { Id = 1, TenantId = 1, Name = "Test Partner" };
        _partnerRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(partner);

        // Act
        var result = await _partnerService.GetByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Test Partner");
    }

    [Fact]
    public async Task GetByIdAsync_WithWrongTenant_ReturnsNull()
    {
        // Arrange
        var partner = new Partner { Id = 1, TenantId = 2, Name = "Test Partner" };
        _partnerRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(partner);

        // Act
        var result = await _partnerService.GetByIdAsync(1);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task CreateAsync_WithValidPartner_ReturnsPartner()
    {
        // Arrange
        var partner = new Partner
        {
            Name = "New Broker",
            Type = PartnerType.Broker,
            Email = "broker@example.com"
        };

        _partnerRepositoryMock.Setup(x => x.GetByEmailAsync("broker@example.com")).ReturnsAsync((Partner?)null);
        _partnerRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Partner>())).ReturnsAsync(partner);

        // Act
        var result = await _partnerService.CreateAsync(partner);

        // Assert
        result.Should().NotBeNull();
        result.TenantId.Should().Be(1);
        result.Status.Should().Be(PartnerStatus.Active);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WithEmptyName_ThrowsValidation()
    {
        // Arrange
        var partner = new Partner { Name = "" };

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => _partnerService.CreateAsync(partner));
    }

    [Fact]
    public async Task CreateAsync_WithDuplicateEmail_ThrowsValidation()
    {
        // Arrange
        var partner = new Partner { Name = "Test", Email = "existing@example.com" };
        _partnerRepositoryMock
            .Setup(x => x.GetByEmailAsync("existing@example.com"))
            .ReturnsAsync(new Partner { Id = 99, Email = "existing@example.com" });

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => _partnerService.CreateAsync(partner));
    }

    [Fact]
    public async Task GetByTypeAsync_ReturnsFilteredPartners()
    {
        // Arrange
        var partners = new List<Partner>
        {
            new() { Id = 1, TenantId = 1, Type = PartnerType.Broker },
            new() { Id = 2, TenantId = 1, Type = PartnerType.Broker }
        };
        _partnerRepositoryMock
            .Setup(x => x.GetByTypeAndTenantAsync(PartnerType.Broker, 1))
            .ReturnsAsync(partners);

        // Act
        var result = await _partnerService.GetByTypeAsync(PartnerType.Broker);

        // Assert
        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task DeleteAsync_WithValidId_SoftDeletes()
    {
        // Arrange
        var partner = new Partner { Id = 1, TenantId = 1, Name = "Test" };
        _partnerRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(partner);

        // Act
        await _partnerService.DeleteAsync(1);

        // Assert
        _partnerRepositoryMock.Verify(x => x.DeleteAsync(It.IsAny<Partner>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WithNonExistentId_ThrowsNotFound()
    {
        // Arrange
        _partnerRepositoryMock.Setup(x => x.GetByIdAsync(999)).ReturnsAsync((Partner?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _partnerService.DeleteAsync(999));
    }

    [Fact]
    public async Task EmailExistsAsync_WithExistingEmail_ReturnsTrue()
    {
        // Arrange
        _partnerRepositoryMock
            .Setup(x => x.EmailExistsAsync("test@example.com", null))
            .ReturnsAsync(true);

        // Act
        var result = await _partnerService.EmailExistsAsync("test@example.com");

        // Assert
        result.Should().BeTrue();
    }
}
