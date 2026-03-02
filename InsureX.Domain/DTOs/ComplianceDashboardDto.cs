using System;

namespace InsureX.Domain.DTOs;

public class ComplianceDashboardDto
{
    public string AssetType { get; set; } = string.Empty;
    public int TotalAssets { get; set; }
    public int CompliantAssets { get; set; }
    public int NonCompliantAssets { get; set; }
    public double ComplianceRate { get; set; }
    public double AvgDaysSinceLastCheck { get; set; }
}