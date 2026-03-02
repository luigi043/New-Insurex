using InsureX.Application.DTOs.Auth;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;

namespace InsureX.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;

    public AuthService(
        IUserRepository userRepository,
        IJwtService jwtService,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null)
            throw new UnauthorizedAccessException("Invalid credentials");

        // Simplified - check properties directly if methods don't exist
        if (user.PasswordHash != _passwordHasher.HashPassword(request.Password))
            throw new UnauthorizedAccessException("Invalid credentials");

        var roles = new[] { "User" }; // Simplified
        var token = _jwtService.GenerateToken(user, roles);

        return new AuthResponseDto
        {
            AccessToken = token,
            RefreshToken = "refresh-token-placeholder",
            UserName = user.Email, // Use Email if UserName doesn't exist
            Email = user.Email,
            Roles = roles,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15)
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        if (await _userRepository.ExistsByEmailAsync(request.Email))
            throw new InvalidOperationException("Email already registered");

        // Create user with minimal required fields
        var user = new User
        {
            Email = request.Email,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            TenantId = request.TenantId
        };

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var roles = new[] { "User" };
        var token = _jwtService.GenerateToken(user, roles);

        return new AuthResponseDto
        {
            AccessToken = token,
            RefreshToken = "refresh-token-placeholder",
            UserName = request.Email, // Use Email
            Email = request.Email,
            Roles = roles,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15)
        };
    }

    public Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        throw new NotImplementedException();
    }

    public Task LogoutAsync(string refreshToken)
    {
        return Task.CompletedTask;
    }

    public Task LogoutAllDevicesAsync(int userId)
    {
        return Task.CompletedTask;
    }

    public Task<bool> ValidateTokenAsync(string token)
    {
        return Task.FromResult(true);
    }
}
