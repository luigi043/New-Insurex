using InsureX.Domain.Entities;

namespace InsureX.Application.Interfaces;

public interface IEmailService
{
    Task SendClaimApprovedNotificationAsync(Claim claim);
    Task SendClaimRejectedNotificationAsync(Claim claim);
    Task SendClaimPaidNotificationAsync(Claim claim);
}
