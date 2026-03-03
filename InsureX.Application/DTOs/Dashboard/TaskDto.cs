using System;

namespace InsureX.Application.DTOs.Dashboard;

public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public string AssignedTo { get; set; } = string.Empty;
}
