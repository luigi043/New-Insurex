using Xunit;
using Moq;
using FluentAssertions;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Application.Services;
using InsureX.Application.Interfaces;
using InsureX.Application.DTOs.Auth;
using InsureX.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace InsureX.Tests.Application.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IPasswordHasher> _passwordHasherMock;
    private readonly Mock<IJwtService> _jwtServiceMock;
    private readonly Mock<ILogger<AuthService>> _loggerMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _passwordHasherMock = new Mock<IPasswordHasher>();
        _jwtServiceMock = new Mock<IJwtService>();
        _loggerMock = new Mock<ILogger<AuthService>>();

        _authService = new AuthService(
            _userRepositoryMock.Object,
            _passwordHasherMock.Object,
            _jwtServiceMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsAuthResponse()
    {
        // Arrange
        var user = new User
        {
            Id = 1,
            Email = "test@example.com",
            FirstName = "Test",
            LastName = "User",
            PasswordHash = "hashed_password",
            Status = UserStatus.Active,
            Role = UserRole.Viewer,
            TenantId = 1,
            RefreshTokens = new List<RefreshToken>()
        };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync("test@example.com"))
            .ReturnsAsync(user);

        _passwordHasherMock
            .Setup(x => x.VerifyPassword("password123", "hashed_password"))
            .Returns(true);

        _jwtServiceMock
            .Setup(x => x.GenerateToken(user))
            .Returns("test-jwt-token");

        _jwtServiceMock
            .Setup(x => x.GenerateRefreshToken())
            .Returns("test-refresh-token");

        var request = new LoginRequestDto
        {
            Email = "test@example.com",
            Password = "password123"
        };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().Be("test-jwt-token");
        result.RefreshToken.Should().Be("test-refresh-token");
    }

    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ThrowsUnauthorized()
    {
        // Arrange
        var user = new User
        {
            Id = 1,
            Email = "test@example.com",
            PasswordHash = "hashed_password",
            RefreshTokens = new List<RefreshToken>()
        };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync("test@example.com"))
            .ReturnsAsync(user);

        _passwordHasherMock
            .Setup(x => x.VerifyPassword("wrong_password", "hashed_password"))
            .Returns(false);

        var request = new LoginRequestDto
        {
            Email = "test@example.com",
            Password = "wrong_password"
        };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _authService.LoginAsync(request));
    }

    [Fact]
    public async Task LoginAsync_WithNonExistentUser_ThrowsUnauthorized()
    {
        // Arrange
        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync("nonexistent@example.com"))
            .ReturnsAsync((User?)null);

        var request = new LoginRequestDto
        {
            Email = "nonexistent@example.com",
            Password = "password123"
        };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _authService.LoginAsync(request));
    }

    [Fact]
    public async Task RegisterAsync_WithNewEmail_CreatesUser()
    {
        // Arrange
        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync("new@example.com"))
            .ReturnsAsync((User?)null);

        _passwordHasherMock
            .Setup(x => x.HashPassword("password123"))
            .Returns("hashed_password");

        _jwtServiceMock
            .Setup(x => x.GenerateToken(It.IsAny<User>()))
            .Returns("new-jwt-token");

        _jwtServiceMock
            .Setup(x => x.GenerateRefreshToken())
            .Returns("new-refresh-token");

        var request = new RegisterRequestDto
        {
            Email = "new@example.com",
            Password = "password123",
            FirstName = "New",
            LastName = "User"
        };

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().Be("new-jwt-token");
        _userRepositoryMock.Verify(x => x.AddAsync(It.IsAny<User>()), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_WithExistingEmail_ThrowsInvalidOperation()
    {
        // Arrange
        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync("existing@example.com"))
            .ReturnsAsync(new User { Email = "existing@example.com" });

        var request = new RegisterRequestDto
        {
            Email = "existing@example.com",
            Password = "password123",
            FirstName = "Test",
            LastName = "User"
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _authService.RegisterAsync(request));
    }
}
