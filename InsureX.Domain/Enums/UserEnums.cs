namespace InsureX.Domain.Enums;

public enum UserRole
{
    Admin = 0,
    Manager = 1,
    Insurer = 2,
    Broker = 3,
    ClaimsProcessor = 4,
    Accountant = 5,
    Viewer = 6,
    Underwriter = 7
}

public enum UserStatus
{
    PendingVerification = 0,
    Active = 1,
    Inactive = 2,
    Locked = 3,
    Suspended = 4
}
