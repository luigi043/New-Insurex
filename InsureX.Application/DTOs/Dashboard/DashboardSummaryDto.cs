namespace InsureX.Application.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public int TotalPolicies { get; set; }
    public int ActivePolicies { get; set; }
    public int TotalClaims { get; set; }
    public int PendingClaims { get; set; }
    public decimal TotalPremium { get; set; }
    public decimal TotalPaidClaims { get; set; }
    public decimal OutstandingInvoices { get; set; }
    public int ExpiringPolicies { get; set; }
}
