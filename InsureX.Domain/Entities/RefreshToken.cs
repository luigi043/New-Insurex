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
