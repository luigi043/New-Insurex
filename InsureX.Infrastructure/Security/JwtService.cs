using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SecurityClaim = System.Security.Claims.Claim;

namespace InsureX.Infrastructure.Security;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expirationHours;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
        var jwtSettings = configuration.GetSection("JwtSettings");
        _secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured");
        _issuer = jwtSettings["Issuer"] ?? "InsureX";
        _audience = jwtSettings["Audience"] ?? "InsureXClient";
        _expirationHours = int.Parse(jwtSettings["ExpirationHours"] ?? "24");
    }

    public string GenerateToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_secretKey);

        var claims = new List<SecurityClaim>
        {
            new SecurityClaim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new SecurityClaim(JwtRegisteredClaimNames.Email, user.Email),
            new SecurityClaim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new SecurityClaim("user_id", user.Id.ToString()),
            new SecurityClaim("first_name", user.FirstName),
            new SecurityClaim("last_name", user.LastName),
            new SecurityClaim("role", user.Role.ToString()),
            new SecurityClaim("tenant_id", user.TenantId.ToString()),
            new SecurityClaim("tenant_name", user.Tenant?.Name ?? ""),
            new SecurityClaim("email_verified", user.EmailVerified.ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new System.Security.Claims.ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(_expirationHours),
            Issuer = _issuer,
            Audience = _audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key), 
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }

    public int? ValidateToken(string token)
    {
        if (string.IsNullOrEmpty(token))
            return null;

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_secretKey);

        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _issuer,
                ValidateAudience = true,
                ValidAudience = _audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userId = jwtToken.Claims.First(x => x.Type == "user_id").Value;

            return int.Parse(userId);
        }
        catch
        {
            return null;
        }
    }

    public DateTime GetTokenExpirationDate()
    {
        return DateTime.UtcNow.AddHours(_expirationHours);
    }
}
