namespace InsureX.Domain.Entities
{
    public class User : BaseEntity
    {
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.Client;
        public UserStatus Status { get; set; } = UserStatus.Active;
        public DateTime? LastLoginAt { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }  
        public Tenant? Tenant { get; set; }
        public Guid TenantId { get; set; }
        public ICollection<Policy> Policies { get; set; } = new List<Policy>();
        public ICollection<Claim> Claims { get; set; } = new List<Claim>();
        public ICollection<Asset> Assets { get; set; } = new List<Asset>();
    }
    public enum UserRole
    {
        Client,
        Financer,
        Insurer,
        Admin,
        Broker
    }
    public enum UserStatus
    {
        Active,
        Inactive,
        Suspended,
        PendingVerification
    }
}
