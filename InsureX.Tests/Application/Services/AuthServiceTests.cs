using Xunit;
using Moq;
using FluentAssertions;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Application.Services;
using InsureX.Application.DTOs.Auth;
using System;
using System.Threading.Tasks;

namespace InsureX.Tests.Application.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<ITenantRepository> _tenantRepositoryMock;
    private readonly Mock<IJwtService> _jwtServiceMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _tenantRepositoryMock = new Mock<ITenantRepository>();
        _jwtServiceMock = new Mock<IJwtService>();
        
        _authService = new AuthService(
            _userRepositoryMock.Object,
            _tenantRepositoryMock.Object,
            _jwtServiceMock.Object);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsAuthResponse()
    {
        // Arrange
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "test@example.com",
            Username = "testuser",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Status = UserStatus.Active,
            Role = UserRole.Client
        };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync("test@example.com"))
            .ReturnsAsync(user);

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
        result.User.Email.Should().Be("test@example.com");
    }
}