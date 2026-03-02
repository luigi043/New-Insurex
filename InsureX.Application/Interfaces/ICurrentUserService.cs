namespace InsureX.Application.Interfaces;

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? UserName { get; }
    string? Role { get; }
    bool IsAuthenticated { get; }
}
