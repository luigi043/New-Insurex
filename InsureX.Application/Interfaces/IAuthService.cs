using InsureX.Application.DTOs;

namespace InsureX.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto> RefreshTokenAsync(string token);
    Task RevokeTokenAsync(string token);
    Task<bool> VerifyEmailAsync(string token);
    Task<bool> RequestPasswordResetAsync(string email);
    Task<bool> ResetPasswordAsync(string token, string newPassword);
    Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    Task LogoutAsync(int userId);
}
