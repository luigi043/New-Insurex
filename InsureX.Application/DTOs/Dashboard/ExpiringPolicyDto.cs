using System;

namespace InsureX.Application.DTOs.Dashboard;

public class ExpiringPolicyDto
{
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public string InsuredName { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public int DaysLeft { get; set; }
    public decimal Premium { get; set; }
}
