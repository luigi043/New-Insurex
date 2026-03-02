namespace InsureX.Application.Interfaces;

public class DashboardDto
{
    public int TotalPolicies { get; set; }
    public int ActivePolicies { get; set; }
    public decimal TotalPremium { get; set; }
    public int PendingClaims { get; set; }
    public int TotalClaims { get; set; }
    public decimal TotalClaimedAmount { get; set; }
}