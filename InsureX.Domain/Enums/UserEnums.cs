namespace InsureX.Domain.Enums;

public enum UserRole
{
    Admin = 0,
    Insurer = 1,
    Financer = 2,
    Broker = 3,
    Viewer = 4,
    Underwriter = 5,
    ClaimsProcessor = 6,
    Accountant = 7
}

public enum UserStatus
{
    Active = 0,
    Inactive = 1,
    Suspended = 2,
    Locked = 3,
    PendingVerification = 4
}
