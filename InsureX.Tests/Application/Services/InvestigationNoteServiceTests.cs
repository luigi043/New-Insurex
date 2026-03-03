using Xunit;
using Moq;
using FluentAssertions;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Domain.Enums;
using InsureX.Application.Services;
using InsureX.Application.Exceptions;
using Microsoft.Extensions.Logging;

namespace InsureX.Tests.Application.Services;

public class InvestigationNoteServiceTests
{
    private readonly Mock<IClaimInvestigationNoteRepository> _noteRepositoryMock;
    private readonly Mock<IClaimRepository> _claimRepositoryMock;
    private readonly Mock<ITenantContext> _tenantContextMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<ILogger<ClaimInvestigationNoteService>> _loggerMock;
    private readonly ClaimInvestigationNoteService _noteService;

    public InvestigationNoteServiceTests()
    {
        _noteRepositoryMock = new Mock<IClaimInvestigationNoteRepository>();
        _claimRepositoryMock = new Mock<IClaimRepository>();
        _tenantContextMock = new Mock<ITenantContext>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _loggerMock = new Mock<ILogger<ClaimInvestigationNoteService>>();

        _tenantContextMock.Setup(x => x.TenantId).Returns(1);

        _noteService = new ClaimInvestigationNoteService(
            _noteRepositoryMock.Object,
            _claimRepositoryMock.Object,
            _tenantContextMock.Object,
            _unitOfWorkMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task CreateAsync_WithValidNote_ReturnsNote()
    {
        // Arrange
        var claim = new Claim { Id = 1, TenantId = 1 };
        _claimRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(claim);

        var note = new ClaimInvestigationNote
        {
            Title = "Field Inspection",
            Content = "Inspected the property on site",
            NoteType = InvestigationNoteType.FieldInspection,
            AuthorId = 1
        };

        _noteRepositoryMock.Setup(x => x.AddAsync(It.IsAny<ClaimInvestigationNote>())).ReturnsAsync(note);

        // Act
        var result = await _noteService.CreateAsync(1, note);

        // Assert
        result.Should().NotBeNull();
        result.ClaimId.Should().Be(1);
        result.TenantId.Should().Be(1);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(default), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WithEmptyTitle_ThrowsValidation()
    {
        // Arrange
        var claim = new Claim { Id = 1, TenantId = 1 };
        _claimRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(claim);

        var note = new ClaimInvestigationNote { Title = "", Content = "Some content" };

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => _noteService.CreateAsync(1, note));
    }

    [Fact]
    public async Task CreateAsync_WithNonExistentClaim_ThrowsNotFound()
    {
        // Arrange
        _claimRepositoryMock.Setup(x => x.GetByIdAsync(999)).ReturnsAsync((Claim?)null);

        var note = new ClaimInvestigationNote { Title = "Test", Content = "Test" };

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _noteService.CreateAsync(999, note));
    }

    [Fact]
    public async Task ResolveAsync_WithValidNote_MarksAsResolved()
    {
        // Arrange
        var note = new ClaimInvestigationNote
        {
            Id = 1,
            TenantId = 1,
            Title = "Test",
            Content = "Original content",
            IsResolved = false
        };
        _noteRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(note);

        // Act
        var result = await _noteService.ResolveAsync(1, "Issue resolved");

        // Assert
        result.IsResolved.Should().BeTrue();
        result.ResolvedAt.Should().NotBeNull();
        result.Content.Should().Contain("Resolution");
    }

    [Fact]
    public async Task ResolveAsync_AlreadyResolved_ThrowsValidation()
    {
        // Arrange
        var note = new ClaimInvestigationNote { Id = 1, TenantId = 1, IsResolved = true };
        _noteRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(note);

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => _noteService.ResolveAsync(1));
    }

    [Fact]
    public async Task GetUnresolvedAsync_ReturnsUnresolvedNotes()
    {
        // Arrange
        var notes = new List<ClaimInvestigationNote>
        {
            new() { Id = 1, TenantId = 1, IsResolved = false },
            new() { Id = 2, TenantId = 1, IsResolved = false }
        };
        _noteRepositoryMock.Setup(x => x.GetUnresolvedAsync(1)).ReturnsAsync(notes);

        // Act
        var result = await _noteService.GetUnresolvedAsync();

        // Assert
        result.Should().HaveCount(2);
    }
}
