using System;

namespace InsureX.Shared.DTOs;

public class ReportDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsSystem { get; set; }
    public DateTime? LastRunAt { get; set; }
    public int RunCount { get; set; }
}
