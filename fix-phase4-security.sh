#!/bin/bash
# Phase 4: Security Hardening - Refresh Tokens, Better JWT, Rate Limiting

echo "🔐 PHASE 4: Security Hardening"
echo "==============================="

# 1. Create Refresh Token Entity
echo "📋 Step 1: Creating refresh token entity..."

cat > InsureX.Domain/Entities/RefreshToken.cs << 'EOF'
namespace InsureX.Domain.Entities;

public class RefreshToken
{
    public int Id { get; private set; }
    public string Token { get; private set; } = string.Empty;
    public string JwtId { get; private set; } = string.Empty; // The JWT ID this refresh token belongs to
    public int UserId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime ExpiresAt { get; private set; }
    public bool IsUsed { get; private set; }
    public bool IsRevoked { get; private set; }
    public string? ReplacedByToken { get; private set; }

    public User User { get; private set; } = null!;

    public static RefreshToken Create(string token, string jwtId, int userId, DateTime expiresAt)
    {
        return new RefreshToken
        {
            Token = token,
            JwtId = jwtId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt,
            IsUsed = false,
            IsRevoked = false
        };
    }

    public void MarkAsUsed()
    {
        if (IsUsed) throw new InvalidOperationException("Token already used");
        if (IsRevoked) throw new InvalidOperationException("Token is revoked");
        if (DateTime.UtcNow > ExpiresAt) throw new InvalidOperationException("Token expired");
        
        IsUsed = true;
    }

    public void Revoke(string? replacedByToken = null)
    {
        IsRevoked = true;
        ReplacedByToken = replacedByToken;
    }

    public bool IsActive => !IsUsed && !IsRevoked && DateTime.UtcNow <= ExpiresAt;
}
EOF

echo "✅ Refresh token entity created"

# 2. Enhanced JWT Service with Refresh Tokens
echo "📋 Step 2: Creating enhanced JWT service..."

cat > InsureX.Application/Interfaces/IJwtService.cs << 'EOF'
using InsureX.Domain.Entities;

namespace InsureX.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user, IEnumerable<string> roles);
    string GenerateRefreshToken();
    Task<TokenResult> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
    Task RevokeTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
    Task<bool> ValidateTokenAsync(string token);
}

public class TokenResult
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime AccessTokenExpiresAt { get; set; }
    public DateTime RefreshTokenExpiresAt { get; set; }
    public string[] Roles { get; set; } = Array.Empty<string>();
    public string UserName { get; set; } = string.Empty;
}
EOF

cat > InsureX.Infrastructure/Security/JwtService.cs << 'EOF'
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace InsureX.Infrastructure.Security;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUserRepository _userRepository;

    public JwtService(
        IConfiguration configuration,
        IRefreshTokenRepository refreshTokenRepository,
        IUserRepository userRepository)
    {
        _configuration = configuration;
        _refreshTokenRepository = refreshTokenRepository;
        _userRepository = userRepository;
    }

    public string GenerateToken(User user, IEnumerable<string> roles)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new("tenantId", user.TenantId.ToString()),
            new(ClaimTypes.Name, user.UserName)
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpiryMinutes"] ?? "15")),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }
        return Convert.ToBase64String(randomBytes);
    }

    public async Task<TokenResult> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        var storedToken = await _refreshTokenRepository.GetByTokenAsync(refreshToken, cancellationToken);
        
        if (storedToken == null || !storedToken.IsActive)
            throw new UnauthorizedAccessException("Invalid refresh token");

        // Mark current token as used
        storedToken.MarkAsUsed();
        
        // Generate new tokens
        var user = await _userRepository.GetByIdAsync(storedToken.UserId, cancellationToken);
        if (user == null)
            throw new UnauthorizedAccessException("User not found");

        var roles = await _userRepository.GetUserRolesAsync(user.Id, cancellationToken);
        var newAccessToken = GenerateToken(user, roles);
        var newRefreshTokenString = GenerateRefreshToken();
        var jwtId = new JwtSecurityTokenHandler().ReadJwtToken(newAccessToken).Id;

        // Create new refresh token
        var newRefreshToken = RefreshToken.Create(
            newRefreshTokenString,
            jwtId,
            user.Id,
            DateTime.UtcNow.AddDays(7) // Refresh token valid for 7 days
        );

        // Replace old token
        storedToken.Revoke(newRefreshTokenString);
        await _refreshTokenRepository.AddAsync(newRefreshToken, cancellationToken);

        return new TokenResult
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshTokenString,
            AccessTokenExpiresAt = DateTime.UtcNow.AddMinutes(15),
            RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(7),
            Roles = roles.ToArray(),
            UserName = user.UserName
        };
    }

    public async Task RevokeTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        var storedToken = await _refreshTokenRepository.GetByTokenAsync(refreshToken, cancellationToken);
        if (storedToken != null)
        {
            storedToken.Revoke();
        }
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var tokenHandler = new JwtSecurityTokenHandler();
        
        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!)),
                ValidateIssuer = true,
                ValidIssuer = jwtSettings["Issuer"],
                ValidateAudience = true,
                ValidAudience = jwtSettings["Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out _);
            
            return true;
        }
        catch
        {
            return false;
        }
    }
}
EOF

echo "✅ Enhanced JWT service created"

# 3. Create Refresh Token Repository Interface
echo "📋 Step 3: Creating refresh token repository..."

cat > InsureX.Domain/Interfaces/IRefreshTokenRepository.cs << 'EOF'
using InsureX.Domain.Entities;

namespace InsureX.Domain.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken = default);
    Task AddAsync(RefreshToken refreshToken, CancellationToken cancellationToken = default);
    Task UpdateAsync(RefreshToken refreshToken, CancellationToken cancellationToken = default);
    Task RevokeAllUserTokensAsync(int userId, CancellationToken cancellationToken = default);
}
EOF

cat > InsureX.Infrastructure/Repositories/RefreshTokenRepository.cs << 'EOF'
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly ApplicationDbContext _context;

    public RefreshTokenRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        return await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == token, cancellationToken);
    }

    public async Task AddAsync(RefreshToken refreshToken, CancellationToken cancellationToken = default)
    {
        await _context.RefreshTokens.AddAsync(refreshToken, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(RefreshToken refreshToken, CancellationToken cancellationToken = default)
    {
        _context.RefreshTokens.Update(refreshToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RevokeAllUserTokensAsync(int userId, CancellationToken cancellationToken = default)
    {
        var tokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.IsRevoked && !rt.IsUsed)
            .ToListAsync(cancellationToken);

        foreach (var token in tokens)
        {
            token.Revoke();
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
EOF

echo "✅ Refresh token repository created"

# 4. Enhanced Auth Service
echo "📋 Step 4: Creating enhanced auth service..."

cat > InsureX.Application/Services/AuthService.cs << 'EOF'
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
EOF

echo "✅ Enhanced auth service created"

# 5. Update AuthController with refresh token endpoints
echo "📋 Step 5: Updating AuthController..."

cat > InsureX.API/Controllers/AuthController.cs << 'EOF'
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InsureX.Application.Interfaces;
using InsureX.Application.DTOs.Auth;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto loginDto)
    {
        try
        {
            var result = await _authService.LoginAsync(loginDto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto registerDto)
    {
        try
        {
            var result = await _authService.RegisterAsync(registerDto);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { message = "An error occurred during registration" });
        }
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken([FromBody] RefreshTokenRequestDto request)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(request.RefreshToken);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            return StatusCode(500, new { message = "An error occurred while refreshing token" });
        }
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDto request)
    {
        try
        {
            await _authService.LogoutAsync(request.RefreshToken);
            return Ok(new { message = "Logged out successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return StatusCode(500, new { message = "An error occurred during logout" });
        }
    }

    [Authorize]
    [HttpPost("logout-all")]
    public async Task<IActionResult> LogoutAllDevices()
    {
        try
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
            await _authService.LogoutAllDevicesAsync(userId);
            return Ok(new { message = "Logged out from all devices" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout all");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        var user = User.Identity;
        return Ok(new
        {
            IsAuthenticated = user?.IsAuthenticated ?? false,
            Name = user?.Name,
            Claims = User.Claims.Select(c => new { c.Type, c.Value })
        });
    }

    [HttpGet("test")]
    public IActionResult Test() => Ok(new { message = "API is working!", timestamp = DateTime.UtcNow });

    [HttpGet("health")]
    public IActionResult Health() => Ok(new { status = "Healthy", timestamp = DateTime.UtcNow });
}
EOF

echo "✅ AuthController updated"

# 6. Add DTOs for refresh token
echo "📋 Step 6: Adding refresh token DTOs..."

cat > InsureX.Application/DTOs/Auth/RefreshTokenRequestDto.cs << 'EOF'
namespace InsureX.Application.DTOs.Auth;

public class RefreshTokenRequestDto
{
    public string RefreshToken { get; set; } = string.Empty;
}
EOF

cat > InsureX.Application/DTOs/Auth/AuthResponseDto.cs << 'EOF'
namespace InsureX.Application.DTOs.Auth;

public class AuthResponseDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string[] Roles { get; set; } = Array.Empty<string>();
    public DateTime ExpiresAt { get; set; }
}
EOF

echo "✅ DTOs created"

# 7. Add Rate Limiting Middleware
echo "📋 Step 7: Adding rate limiting..."

cat > InsureX.API/Middleware/RateLimitingMiddleware.cs << 'EOF'
using System.Collections.Concurrent;

namespace InsureX.API.Middleware;

public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RateLimitingMiddleware> _logger;
    private static readonly ConcurrentDictionary<string, ClientRequestInfo> _clients = new();

    private readonly int _maxRequests = 100; // Max requests per window
    private readonly TimeSpan _window = TimeSpan.FromMinutes(1);

    public RateLimitingMiddleware(RequestDelegate next, ILogger<RateLimitingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var clientId = GetClientIdentifier(context);
        var now = DateTime.UtcNow;

        var clientInfo = _clients.GetOrAdd(clientId, _ => new ClientRequestInfo());

        lock (clientInfo)
        {
            // Remove old requests outside the window
            clientInfo.Requests.RemoveAll(r => now - r > _window);
            
            if (clientInfo.Requests.Count >= _maxRequests)
            {
                _logger.LogWarning("Rate limit exceeded for client {ClientId}", clientId);
                context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                context.Response.Headers.Add("Retry-After", "60");
                return;
            }

            clientInfo.Requests.Add(now);
        }

        await _next(context);
    }

    private string GetClientIdentifier(HttpContext context)
    {
        // Use authenticated user ID if available, otherwise use IP
        var userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userId))
            return $"user:{userId}";

        return $"ip:{context.Connection.RemoteIpAddress?.ToString() ?? "unknown"}";
    }

    private class ClientRequestInfo
    {
        public List<DateTime> Requests { get; } = new();
    }
}
EOF

echo "✅ Rate limiting middleware created"

echo ""
echo "🎉 PHASE 4 COMPLETE!"
echo "Next: Run ./fix-phase5-infrastructure.sh to clean up and add final touches"