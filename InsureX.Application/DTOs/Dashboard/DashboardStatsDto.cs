namespace InsureX.Application.DTOs.Dashboard;

public class DashboardStatsDto
{
    public int TotalPolicies { get; set; }
    public int TotalClaims { get; set; }
    public int TotalAssets { get; set; }
    public int TotalUsers { get; set; }
    public int ActiveClaims { get; set; }
    public decimal TotalClaimedAmount { get; set; }
    public decimal TotalAssetValue { get; set; }
}

public class FinancialSummaryDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal TotalClaimedAmount { get; set; }
    public decimal TotalApprovedAmount { get; set; }
    public decimal TotalAssetValue { get; set; }
}

public class MonthlyStatsDto
{
    public int Month { get; set; }
    public int Year { get; set; }
    public int PolicyCount { get; set; }
    public int ClaimCount { get; set; }
    public decimal PremiumAmount { get; set; }
}

public class PolicyTypeStatsDto
{
    public string PolicyType { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal TotalPremium { get; set; }
}

public class ClaimStatusStatsDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class AssetTypeStatsDto
{
    public string AssetType { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal TotalValue { get; set; }
}
