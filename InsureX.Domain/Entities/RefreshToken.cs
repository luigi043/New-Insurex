namespace InsureX.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public string? RevokedBy { get; set; }
    public DateTime? RevokedAt { get; set; }
    public string? ReplacedByToken { get; set; }
    public int UserId { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    
    // Navigation properties
    public User User { get; set; } = null!;
    
    public bool IsActive => !IsRevoked && !IsExpired;
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
}
