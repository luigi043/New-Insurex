using InsureX.Domain.Enums;

namespace InsureX.Domain.Entities;

public class WorkflowDefinition : BaseEntity
{
    public int TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string EntityType { get; set; } = string.Empty; // "Policy", "Claim", etc.
    public bool IsActive { get; set; } = true;
    public int Version { get; set; } = 1;
    public bool IsDefault { get; set; }

    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public ICollection<WorkflowStep> Steps { get; set; } = new List<WorkflowStep>();
    public ICollection<WorkflowInstance> Instances { get; set; } = new List<WorkflowInstance>();
}

public class WorkflowStep : BaseEntity
{
    public int WorkflowDefinitionId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StepOrder { get; set; }
    public string FromStatus { get; set; } = string.Empty;
    public string ToStatus { get; set; } = string.Empty;
    public string? RequiredRole { get; set; }
    public bool RequiresApproval { get; set; }
    public int? ApprovalCount { get; set; } // Number of approvals needed
    public bool IsAutomatic { get; set; }
    public string? AutomaticCondition { get; set; } // JSON condition
    public int? TimeoutHours { get; set; }
    public string? NotificationTemplate { get; set; }

    // Navigation properties
    public WorkflowDefinition WorkflowDefinition { get; set; } = null!;
}

public class WorkflowInstance : BaseEntity
{
    public int WorkflowDefinitionId { get; set; }
    public int TenantId { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public string CurrentStatus { get; set; } = string.Empty;
    public int? CurrentStepId { get; set; }
    public WorkflowInstanceStatus Status { get; set; } = WorkflowInstanceStatus.Active;
    public DateTime? CompletedAt { get; set; }
    public int? CompletedById { get; set; }

    // Navigation properties
    public WorkflowDefinition WorkflowDefinition { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
    public WorkflowStep? CurrentStep { get; set; }
    public ICollection<WorkflowHistory> History { get; set; } = new List<WorkflowHistory>();
    public ICollection<WorkflowApproval> Approvals { get; set; } = new List<WorkflowApproval>();
}

public class WorkflowHistory : BaseEntity
{
    public int WorkflowInstanceId { get; set; }
    public int? WorkflowStepId { get; set; }
    public string FromStatus { get; set; } = string.Empty;
    public string ToStatus { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public int? PerformedById { get; set; }
    public string? Notes { get; set; }
    public DateTime PerformedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public WorkflowInstance WorkflowInstance { get; set; } = null!;
    public WorkflowStep? WorkflowStep { get; set; }
    public User? PerformedBy { get; set; }
}

public class WorkflowApproval : BaseEntity
{
    public int WorkflowInstanceId { get; set; }
    public int WorkflowStepId { get; set; }
    public int ApproverId { get; set; }
    public ApprovalStatus Status { get; set; } = ApprovalStatus.Pending;
    public string? Comments { get; set; }
    public DateTime? DecisionAt { get; set; }
    public int ApprovalOrder { get; set; }

    // Navigation properties
    public WorkflowInstance WorkflowInstance { get; set; } = null!;
    public WorkflowStep WorkflowStep { get; set; } = null!;
    public User Approver { get; set; } = null!;
}
