using InsureX.Application.DTOs;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Application.Interfaces;

public interface IWorkflowService
{
    // Workflow Definitions
    Task<IEnumerable<WorkflowDefinition>> GetDefinitionsAsync();
    Task<WorkflowDefinition?> GetDefinitionByIdAsync(int id);
    Task<WorkflowDefinition> CreateDefinitionAsync(WorkflowDefinition definition);
    Task<WorkflowDefinition> UpdateDefinitionAsync(WorkflowDefinition definition);
    Task DeleteDefinitionAsync(int id);

    // Workflow Steps
    Task<WorkflowStep> AddStepAsync(int definitionId, WorkflowStep step);
    Task<WorkflowStep> UpdateStepAsync(WorkflowStep step);
    Task DeleteStepAsync(int stepId);

    // Workflow Instances
    Task<WorkflowInstance> StartWorkflowAsync(int definitionId, string entityType, int entityId);
    Task<WorkflowInstance?> GetInstanceAsync(int instanceId);
    Task<IEnumerable<WorkflowInstance>> GetInstancesByEntityAsync(string entityType, int entityId);
    Task<WorkflowInstance> TransitionAsync(int instanceId, string toStatus, string? notes = null);
    Task<WorkflowInstance> CancelAsync(int instanceId, string? reason = null);

    // Workflow History
    Task<IEnumerable<WorkflowHistory>> GetHistoryAsync(int instanceId);

    // Approvals
    Task<WorkflowApproval> RequestApprovalAsync(int instanceId, int stepId, int approverId);
    Task<WorkflowApproval> ApproveAsync(int approvalId, string? comments = null);
    Task<WorkflowApproval> RejectApprovalAsync(int approvalId, string? comments = null);
    Task<IEnumerable<WorkflowApproval>> GetPendingApprovalsAsync(int approverId);
}
