namespace InsureX.Domain.Enums;

public enum WorkflowInstanceStatus
{
    Active = 0,
    Completed = 1,
    Cancelled = 2,
    Suspended = 3,
    TimedOut = 4
}

public enum ApprovalStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Escalated = 3
}
