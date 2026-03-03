namespace InsureX.Application.DTOs;

public class DashboardSummaryDto
{
    public int TotalPolicies { get; set; }
    public int ActivePolicies { get; set; }
    public int ExpiringPolicies { get; set; }
    public int TotalClaims { get; set; }
    public int PendingClaims { get; set; }
    public int ApprovedClaims { get; set; }
    public decimal TotalPremium { get; set; }
    decimal TotalClaimsPaid { get; set; }
    public decimal OutstandingInvoices { get; set; }
    public int TotalAssets { get; set; }
    public int TotalPartners { get; set; }
    public decimal MonthlyRevenue { get; set; }
    public decimal MonthlyClaims { get; set; }
}

public class ChartDataDto
{
    public string Label { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public string? Color { get; set; }
    public DateTime? Date { get; set; }
}

public class RecentActivityDto
{
    public List<ActivityItemDto> Activities { get; set; } = new();
}

public class ActivityItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? EntityType { get; set; }
    public int? EntityId { get; set; }
    public string? UserName { get; set; }
    public DateTime Timestamp { get; set; }
    public string? Icon { get; set; }
    public string? Color { get; set; }
}

public class ExpiringPoliciesDto
{
    public List<ExpiringPolicyItemDto> Policies { get; set; } = new();
    public int TotalCount { get; set; }
}

public class ExpiringPolicyItemDto
{
    public int Id { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public string? InsuredName { get; set; }
    public DateTime EndDate { get; set; }
    public int DaysUntilExpiry { get; set; }
    public decimal PremiumAmount { get; set; }
}

public class PendingTasksDto
{
    public int PendingClaimsCount { get; set; }
    public int OverdueInvoicesCount { get; set; }
    public int ExpiringPoliciesCount { get; set; }
    public int UnreconciledPaymentsCount { get; set; }
    public List<PendingTaskItemDto> Tasks { get; set; } = new();
}

public class PendingTaskItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public int Priority { get; set; }
    public string? ActionUrl { get; set; }
}
