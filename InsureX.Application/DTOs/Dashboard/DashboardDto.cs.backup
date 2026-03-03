using System;
using System.Collections.Generic;

namespace InsureX.Application.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public int TotalPolicies { get; set; }
    public int ActivePolicies { get; set; }
    public int ExpiringSoon { get; set; }
    public int TotalAssets { get; set; }
    public decimal TotalInsuredValue { get; set; }
    public int PendingClaims { get; set; }
    public decimal OutstandingPremiums { get; set; }
    public int UninsuredAssets { get; set; }
}

public class ChartDataDto
{
    public string Label { get; set; } = string.Empty;
    public int Value { get; set; }
    public decimal? Amount { get; set; }
}

public class PolicyStatusChartDto
{
    public List<ChartDataDto> ByStatus { get; set; } = new();
    public List<ChartDataDto> ByType { get; set; } = new();
    public List<ChartDataDto> ByMonth { get; set; } = new();
}

public class RecentActivityDto
{
    public string ActivityType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Reference { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string User { get; set; } = string.Empty;
}
