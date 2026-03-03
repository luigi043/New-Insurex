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

public class AssetServiceTests
{
    private readonly Mock<IAssetRepository> _assetRepositoryMock;
    private readonly Mock<ITenantContext> _tenantContextMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<AssetService>> _loggerMock;
    private readonly AssetService _assetService;

    public AssetServiceTests()
    {
        _assetRepositoryMock = new Mock<IAssetRepository>();
        _tenantContextMock = new Mock<ITenantContext>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<AssetService>>();

        _tenantContextMock.Setup(x => x.TenantId).Returns(1);

        _assetService = new AssetService(
            _assetRepositoryMock.Object,
            _tenantContextMock.Object,
            _unitOfWorkMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WithValidId_ReturnsAsset()
    {
        // Arrange
        var asset = new Asset { Id = 1, TenantId = 1, Name = "Test Asset" };
        _assetRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(asset);

        // Act
        var result = await _assetService.GetByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Test Asset");
    }

    [Fact]
    public async Task GetByIdAsync_WithWrongTenant_ReturnsNull()
    {
        // Arrange
        var asset = new Asset { Id = 1, TenantId = 2, Name = "Test Asset" };
        _assetRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(asset);

        // Act
        var result = await _assetService.GetByIdAsync(1);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task CreateAsync_WithValidAsset_ReturnsAsset()
    {
        // Arrange
        var asset = new Asset
        {
            Name = "New Vehicle",
            Type = AssetType.Vehicle,
            Value = 25000
        };

        _assetRepositoryMock.Setup(x => x.AddAsync(It.IsAny<Asset>())).ReturnsAsync(asset);

        // Act
        var result = await _assetService.CreateAsync(asset);

        // Assert
        result.Should().NotBeNull();
        result.TenantId.Should().Be(1);
        result.Status.Should().Be(AssetStatus.Active);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WithEmptyName_ThrowsValidation()
    {
        // Arrange
        var asset = new Asset { Name = "", Value = 1000 };

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => _assetService.CreateAsync(asset));
    }

    [Fact]
    public async Task CreateAsync_WithNegativeValue_ThrowsValidation()
    {
        // Arrange
        var asset = new Asset { Name = "Test", Value = -100 };

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => _assetService.CreateAsync(asset));
    }

    [Fact]
    public async Task CreateAsync_WithDuplicateSerialNumber_ThrowsValidation()
    {
        // Arrange
        var asset = new Asset { Name = "Test", Value = 1000, SerialNumber = "SN-001" };
        _assetRepositoryMock
            .Setup(x => x.GetBySerialNumberAsync("SN-001"))
            .ReturnsAsync(new Asset { Id = 99, SerialNumber = "SN-001" });

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => _assetService.CreateAsync(asset));
    }

    [Fact]
    public async Task GetByTypeAsync_ReturnsFilteredAssets()
    {
        // Arrange
        var assets = new List<Asset>
        {
            new() { Id = 1, TenantId = 1, Type = AssetType.Vehicle },
            new() { Id = 2, TenantId = 1, Type = AssetType.Vehicle }
        };
        _assetRepositoryMock
            .Setup(x => x.GetByTypeAndTenantAsync(AssetType.Vehicle, 1))
            .ReturnsAsync(assets);

        // Act
        var result = await _assetService.GetByTypeAsync(AssetType.Vehicle);

        // Assert
        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetTotalValueAsync_ReturnsTotalForTenant()
    {
        // Arrange
        _assetRepositoryMock.Setup(x => x.GetTotalValueByTenantAsync(1)).ReturnsAsync(500000m);

        // Act
        var result = await _assetService.GetTotalValueAsync();

        // Assert
        result.Should().Be(500000m);
    }

    [Fact]
    public async Task DeleteAsync_WithValidId_SoftDeletes()
    {
        // Arrange
        var asset = new Asset { Id = 1, TenantId = 1, Name = "Test" };
        _assetRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(asset);

        // Act
        await _assetService.DeleteAsync(1);

        // Assert
        _assetRepositoryMock.Verify(x => x.DeleteAsync(It.IsAny<Asset>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WithNonExistentId_ThrowsNotFound()
    {
        // Arrange
        _assetRepositoryMock.Setup(x => x.GetByIdAsync(999)).ReturnsAsync((Asset?)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _assetService.DeleteAsync(999));
    }
}
