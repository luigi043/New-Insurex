using InsureX.Domain.Entities;

namespace InsureX.Domain.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);  // Not GenerateJwtToken
    string GenerateRefreshToken();    // Not GenerateRefreshToken (no parameters)
    bool ValidateToken(string token);   // Not ValidateJwtToken
    Guid? GetUserIdFromToken(string token);
}