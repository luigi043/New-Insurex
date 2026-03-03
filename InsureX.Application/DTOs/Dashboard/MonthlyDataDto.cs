namespace InsureX.Application.DTOs.Dashboard;

public class MonthlyDataDto
{
    public string Month { get; set; } = string.Empty;
    public int Year { get; set; }
    public decimal Amount { get; set; }
    public int Count { get; set; }
}
