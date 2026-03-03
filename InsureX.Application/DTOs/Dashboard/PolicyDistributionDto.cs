namespace InsureX.Application.DTOs.Dashboard;

public class PolicyDistributionDto
{
    public string Type { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Percentage { get; set; }
}
