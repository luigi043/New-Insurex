namespace InsureX.Application.DTOs.Reports;

public class ReportParametersDto
{
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public Dictionary<string, string> CustomParameters { get; set; } = new();
}

public class ReportResultDto
{
    public string ReportName { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PeriodFrom { get; set; }
    public DateTime? PeriodTo { get; set; }
    public List<string> Columns { get; set; } = new();
    public List<Dictionary<string, object?>> Rows { get; set; } = new();
    public Dictionary<string, object?> Summary { get; set; } = new();
    public int TotalRows { get; set; }
}
