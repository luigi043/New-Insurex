using InsureX.Application.DTOs.Auth;

namespace InsureX.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
        Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
        Task<bool> ValidateTokenAsync(string token);
    }
}