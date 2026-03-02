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
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AuthService(
        IUserRepository userRepository,
        IJwtService jwtService,
        IPasswordHasher passwordHasher,
        IRefreshTokenRepository refreshTokenRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null)
            throw new UnauthorizedAccessException("Invalid credentials");

        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Account is deactivated");

        // Update last login
        user.UpdateLastLogin();
        await _unitOfWork.SaveChangesAsync();

        var roles = await _userRepository.GetUserRolesAsync(user.Id);
        var accessToken = _jwtService.GenerateToken(user, roles);
        var refreshTokenString = _jwtService.GenerateRefreshToken();
        
        // Get JWT ID for refresh token linkage
        var jwtId = GetJwtIdFromToken(accessToken);
        
        // Store refresh token
        var refreshToken = RefreshToken.Create(
            refreshTokenString,
            jwtId,
            user.Id,
            DateTime.UtcNow.AddDays(7)
        );
        await _refreshTokenRepository.AddAsync(refreshToken);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenString,
            UserName = user.UserName,
            Email = user.Email,
            Roles = roles.ToArray(),
            ExpiresAt = DateTime.UtcNow.AddMinutes(15)
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        if (await _userRepository.ExistsByEmailAsync(request.Email))
            throw new InvalidOperationException("Email already registered");

        var user = User.Create(
            request.UserName,
            request.Email,
            _passwordHasher.HashPassword(request.Password),
            request.TenantId,
            request.FirstName,
            request.LastName
        );

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // Assign default role
        await _userRepository.AddToRoleAsync(user.Id, "User");

        // Generate tokens
        var roles = new[] { "User" };
        var accessToken = _jwtService.GenerateToken(user, roles);
        var refreshTokenString = _jwtService.GenerateRefreshToken();
        var jwtId = GetJwtIdFromToken(accessToken);

        var refreshToken = RefreshToken.Create(
            refreshTokenString,
            jwtId,
            user.Id,
            DateTime.UtcNow.AddDays(7)
        );
        await _refreshTokenRepository.AddAsync(refreshToken);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenString,
            UserName = user.UserName,
            Email = user.Email,
            Roles = roles,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15)
        };
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        return await _jwtService.RefreshTokenAsync(refreshToken);
    }

    public async Task LogoutAsync(string refreshToken)
    {
        await _jwtService.RevokeTokenAsync(refreshToken);
    }

    public async Task LogoutAllDevicesAsync(int userId)
    {
        await _refreshTokenRepository.RevokeAllUserTokensAsync(userId);
    }

    private string GetJwtIdFromToken(string token)
    {
        var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);
        return jwtToken.Id;
    }
}
