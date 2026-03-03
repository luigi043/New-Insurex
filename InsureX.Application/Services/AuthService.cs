using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Application.DTOs;
using Microsoft.Extensions.Logging;

namespace InsureX.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtService jwtService,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
        _logger = logger;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        var token = _jwtService.GenerateToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshTokens.Add(new RefreshToken
        {
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            UserId = user.Id
        });

        await _userRepository.UpdateAsync(user);

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            User = new UserDto { Id = user.Id,    Role = user.Role } };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        // Check if user exists
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        var user = new User
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            Role = Domain.Enums.UserRole.Viewer,
            Status = Domain.Enums.UserStatus.Active,
            TenantId = 1 // Default tenant
        };

        await _userRepository.AddAsync(user);

        var token = _jwtService.GenerateToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            User = new UserDto { Id = user.Id,    Role = user.Role } };
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        var user = await _userRepository.GetByRefreshTokenAsync(refreshToken);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid refresh token");
        }

        var token = _jwtService.GenerateToken(user);
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        // Revoke old token
        var oldToken = user.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshToken);
        if (oldToken != null)
        {
            oldToken.IsRevoked = true;
            oldToken.ReplacedByToken = newRefreshToken;
        }

        // Add new token
        user.RefreshTokens.Add(new RefreshToken
        {
            Token = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            UserId = user.Id
        });

        await _userRepository.UpdateAsync(user);

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            User = new UserDto { Id = user.Id,    Role = user.Role } };
    }

    public async Task RevokeTokenAsync(string refreshToken)
    {
        var user = await _userRepository.GetByRefreshTokenAsync(refreshToken);
        if (user == null) return;

        var token = user.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshToken);
        if (token != null)
        {
            token.IsRevoked = true;
            await _userRepository.UpdateAsync(user);
        }
    }

    public async Task<bool> VerifyEmailAsync(string token) => await Task.FromResult(true);
    public async Task<bool> RequestPasswordResetAsync(string email) => await Task.FromResult(true);
    public async Task<bool> ResetPasswordAsync(string token, string newPassword) => await Task.FromResult(true);
    public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword) => await Task.FromResult(true);
    public async Task LogoutAsync(int userId) => await Task.CompletedTask;
}



