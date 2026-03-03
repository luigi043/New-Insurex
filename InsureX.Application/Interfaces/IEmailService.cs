namespace InsureX.Application.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body, bool isHtml = true);
    Task SendEmailAsync(string to, string subject, string body, string? attachmentPath = null);
    Task SendTemplatedEmailAsync(string to, string templateName, Dictionary<string, string> placeholders);
    Task SendBulkEmailAsync(IEnumerable<string> recipients, string subject, string body);
}
