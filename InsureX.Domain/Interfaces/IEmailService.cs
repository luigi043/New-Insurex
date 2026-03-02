
using System.Security.Claims;
using InsureX.Domain.Entities;

namespace InsureX.Domain.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendClaimSubmittedNotificationAsync(Entities.Claim claim);
    Task SendClaimApprovedNotificationAsync(Entities.Claim claim);
    Task SendClaimRejectedNotificationAsync(Entities.Claim claim);
    Task SendClaimPaidNotificationAsync(Entities.Claim claim);
}