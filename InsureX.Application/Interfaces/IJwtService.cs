using InsureX.Domain.Entities;

namespace InsureX.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
    string GenerateRefreshToken();
    int? ValidateToken(string token);
    DateTime GetTokenExpirationDate();
}
