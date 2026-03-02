using System;
using InsureX.Domain.Entities;
using System.Collections.Generic;

namespace InsureX.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;  // ADD THIS
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public UserStatus Status { get; set; }
    
    // ADD THESE PROPERTIES
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public Guid? TenantId { get; set; }
    public Tenant? Tenant { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Policy> Policies { get; set; } = new List<Policy>();
    public ICollection<Claim> Claims { get; set; } = new List<Claim>();
}

public class Tenant
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;  // ADD THIS
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public ICollection<User> Users { get; set; } = new List<User>();
}

public enum UserRole
{
    Admin,
    Client,
    Insurer,
    Financer,
    Broker
}

public enum UserStatus
{
    Active,
    Inactive,
    Pending,
    Suspended
}