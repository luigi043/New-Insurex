namespace InsureX.Shared.DTOs;

public class ComplianceDashboardDto
{
    public int TotalPolicies { get; set; }
    public int ActivePolicies { get; set; }
    public int ExpiredPolicies { get; set; }
    public int TotalClaims { get; set; }
    public int PendingClaims { get; set; }
    public decimal TotalPremium { get; set; }
    public decimal TotalPayout { get; set; }
    public Dictionary<string, int> PoliciesByStatus { get; set; } = new();
    public Dictionary<string, int> ClaimsByStatus { get; set; } = new();
    public List<MonthlyComplianceDto> MonthlyData { get; set; } = new();
}

public class MonthlyComplianceDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public int PoliciesCreated { get; set; }
    public int ClaimsFiled { get; set; }
    public decimal PremiumAmount { get; set; }
    public decimal PayoutAmount { get; set; }
}
