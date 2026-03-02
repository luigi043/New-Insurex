namespace InsureX.Application.DTOs.Dashboard
{
    public class DashboardStatsDto
    {
        public int TotalPolicies { get; set; }
        public int ActivePolicies { get; set; }
        public int TotalClaims { get; set; }
        public int PendingClaims { get; set; }
        public int TotalAssets { get; set; }
        public decimal TotalPremium { get; set; }
        public List<MonthlyStatsDto> MonthlyStats { get; set; } = new();
        public List<PolicyTypeStatsDto> PolicyTypeStats { get; set; } = new();
        public List<ClaimStatusStatsDto> ClaimStatusStats { get; set; } = new();
        public List<AssetTypeStatsDto> AssetTypeStats { get; set; } = new();
    }

    public class MonthlyStatsDto
    {
        public string Month { get; set; } = string.Empty;
        public int Policies { get; set; }
        public int Claims { get; set; }
        public decimal Premium { get; set; }
    }

    public class PolicyTypeStatsDto
    {
        public string Type { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Coverage { get; set; }
    }

    public class ClaimStatusStatsDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Amount { get; set; }
    }

    public class AssetTypeStatsDto
    {
        public string Type { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Value { get; set; }
    }

    public class FinancialSummaryDto
    {
        public decimal TotalPremiums { get; set; }
        public decimal TotalClaimsPaid { get; set; }
        public decimal LossRatio { get; set; }
        public decimal ProfitMargin { get; set; }
    }
}