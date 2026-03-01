using System.Security.Claims;

namespace InsureX.Domain.Interfaces;

public interface IJwtService
{
    string GenerateJwtToken(Domain.Entities.User user);
    string GenerateRefreshToken();
    ClaimsPrincipal? ValidateJwtToken(string token);
}
