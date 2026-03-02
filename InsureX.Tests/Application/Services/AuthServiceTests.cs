
using System.Threading.Tasks;
using Xunit;
using Moq;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Application.Services;
using Microsoft.AspNetCore.Identity;

namespace InsureX.Tests.Application.Services
{
    public class AuthServiceTests
    {
        [Fact]
        public async Task ValidateUserAsync_WithValidCredentials_ReturnsSuccess()
        {
            // Arrange
            var userRepo = new Mock<IUserRepository>();
            var hasher = new Mock<IPasswordHasher>();
            var tokenService = new Mock<IJwtService>();
            var auditService = new Mock<IAuditService>();
            
            var user = new User 
            { 
                Id = Guid.NewGuid(), 
                Username = "test@example.com",
                Email = "test@example.com",
                PasswordHash = "hashedpassword"
            };
            
            userRepo.Setup(r => r.GetByEmailAsync("test@example.com"))
                .ReturnsAsync(user);
                
            hasher.Setup(h => h.VerifyPassword("password", user.PasswordHash))
                .Returns(true);
                
            tokenService.Setup(t => t.GenerateToken(user))
                .Returns("test-token");
                
            var service = new AuthService(
                userRepo.Object, 
                Mock.Of<ITenantRepository>(),
                tokenService.Object);

            // Act
            var result = await service.LoginAsync(new Application.DTOs.Auth.LoginRequestDto
            {
                Email = "test@example.com",
                Password = "password"
            });

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test-token", result.Token);
        }
    }
}