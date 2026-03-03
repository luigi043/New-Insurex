namespace InsureX.Application.DTOs.Dashboard;

public class ClaimStatusDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Amount { get; set; }
}
