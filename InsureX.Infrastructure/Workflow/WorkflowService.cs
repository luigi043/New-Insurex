using InsureX.Application.DTOs;
using InsureX.Application.Exceptions;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace InsureX.Infrastructure.Workflow;

public class WorkflowService : IWorkflowService
{
    private readonly ApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<WorkflowService> _logger;

    public WorkflowService(
        ApplicationDbContext context,
        ITenantContext tenantContext,
        IUnitOfWork unitOfWork,
        ILogger<WorkflowService> logger)
    {
        _context = context;
        _tenantContext = tenantContext;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    // Workflow Definitions
    public async Task<IEnumerable<WorkflowDefinition>> GetDefinitionsAsync()
    {
        return await _context.Set<WorkflowDefinition>()
            .Include(d => d.Steps.OrderBy(s => s.StepOrder))
            .Where(d => d.TenantId == _tenantContext.TenantId && !d.IsDeleted)
            .OrderBy(d => d.Name)
            .ToListAsync();
    }

    public async Task<WorkflowDefinition?> GetDefinitionByIdAsync(int id)
    {
        return await _context.Set<WorkflowDefinition>()
            .Include(d => d.Steps.OrderBy(s => s.StepOrder))
            .FirstOrDefaultAsync(d => d.Id == id && d.TenantId == _tenantContext.TenantId && !d.IsDeleted);
    }

    public async Task<WorkflowDefinition> CreateDefinitionAsync(WorkflowDefinition definition)
    {
        if (string.IsNullOrWhiteSpace(definition.Name))
            throw new ValidationException("Workflow name is required");

        if (string.IsNullOrWhiteSpace(definition.EntityType))
            throw new ValidationException("Entity type is required");

        definition.TenantId = _tenantContext.TenantId;
        definition.SetCreated("system");

        _context.Set<WorkflowDefinition>().Add(definition);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Workflow definition '{Name}' created", definition.Name);
        return definition;
    }

    public async Task<WorkflowDefinition> UpdateDefinitionAsync(WorkflowDefinition definition)
    {
        var existing = await GetDefinitionByIdAsync(definition.Id);
        if (existing == null)
            throw new NotFoundException("Workflow definition not found");

        existing.Name = definition.Name;
        existing.Description = definition.Description;
        existing.EntityType = definition.EntityType;
        existing.IsActive = definition.IsActive;
        existing.SetUpdated("system");

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Workflow definition '{Name}' updated", existing.Name);
        return existing;
    }

    public async Task DeleteDefinitionAsync(int id)
    {
        var definition = await GetDefinitionByIdAsync(id);
        if (definition == null)
            throw new NotFoundException("Workflow definition not found");

        definition.SoftDelete("system");
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Workflow definition '{Name}' deleted", definition.Name);
    }

    // Workflow Steps
    public async Task<WorkflowStep> AddStepAsync(int definitionId, WorkflowStep step)
    {
        var definition = await GetDefinitionByIdAsync(definitionId);
        if (definition == null)
            throw new NotFoundException("Workflow definition not found");

        if (string.IsNullOrWhiteSpace(step.Name))
            throw new ValidationException("Step name is required");

        step.WorkflowDefinitionId = definitionId;
        step.SetCreated("system");

        if (step.StepOrder == 0)
            step.StepOrder = definition.Steps.Count + 1;

        _context.Set<WorkflowStep>().Add(step);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Step '{StepName}' added to workflow '{WorkflowName}'", step.Name, definition.Name);
        return step;
    }

    public async Task<WorkflowStep> UpdateStepAsync(WorkflowStep step)
    {
        var existing = await _context.Set<WorkflowStep>().FindAsync(step.Id);
        if (existing == null)
            throw new NotFoundException("Workflow step not found");

        existing.Name = step.Name;
        existing.Description = step.Description;
        existing.StepOrder = step.StepOrder;
        existing.FromStatus = step.FromStatus;
        existing.ToStatus = step.ToStatus;
        existing.RequiredRole = step.RequiredRole;
        existing.RequiresApproval = step.RequiresApproval;
        existing.ApprovalCount = step.ApprovalCount;
        existing.IsAutomatic = step.IsAutomatic;
        existing.AutomaticCondition = step.AutomaticCondition;
        existing.TimeoutHours = step.TimeoutHours;
        existing.NotificationTemplate = step.NotificationTemplate;
        existing.SetUpdated("system");

        await _unitOfWork.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteStepAsync(int stepId)
    {
        var step = await _context.Set<WorkflowStep>().FindAsync(stepId);
        if (step == null)
            throw new NotFoundException("Workflow step not found");

        step.SoftDelete("system");
        await _unitOfWork.SaveChangesAsync();
    }

    // Workflow Instances
    public async Task<WorkflowInstance> StartWorkflowAsync(int definitionId, string entityType, int entityId)
    {
        var definition = await GetDefinitionByIdAsync(definitionId);
        if (definition == null)
            throw new NotFoundException("Workflow definition not found");

        if (!definition.IsActive)
            throw new ValidationException("Workflow definition is not active");

        var firstStep = definition.Steps.OrderBy(s => s.StepOrder).FirstOrDefault();
        var initialStatus = firstStep?.FromStatus ?? "Initial";

        var instance = new WorkflowInstance
        {
            WorkflowDefinitionId = definitionId,
            TenantId = _tenantContext.TenantId,
            EntityType = entityType,
            EntityId = entityId,
            CurrentStatus = initialStatus,
            CurrentStepId = firstStep?.Id,
            Status = WorkflowInstanceStatus.Active
        };
        instance.SetCreated("system");

        _context.Set<WorkflowInstance>().Add(instance);

        // Add initial history entry
        var history = new WorkflowHistory
        {
            WorkflowInstanceId = instance.Id,
            WorkflowStepId = firstStep?.Id,
            FromStatus = "",
            ToStatus = initialStatus,
            Action = "WorkflowStarted",
            PerformedAt = DateTime.UtcNow
        };
        history.SetCreated("system");
        _context.Set<WorkflowHistory>().Add(history);

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation(
            "Workflow '{WorkflowName}' started for {EntityType} #{EntityId}",
            definition.Name, entityType, entityId);

        return instance;
    }

    public async Task<WorkflowInstance?> GetInstanceAsync(int instanceId)
    {
        return await _context.Set<WorkflowInstance>()
            .Include(i => i.WorkflowDefinition)
            .ThenInclude(d => d.Steps)
            .Include(i => i.History.OrderByDescending(h => h.PerformedAt))
            .Include(i => i.Approvals)
            .FirstOrDefaultAsync(i => i.Id == instanceId && i.TenantId == _tenantContext.TenantId);
    }

    public async Task<IEnumerable<WorkflowInstance>> GetInstancesByEntityAsync(string entityType, int entityId)
    {
        return await _context.Set<WorkflowInstance>()
            .Include(i => i.WorkflowDefinition)
            .Include(i => i.History.OrderByDescending(h => h.PerformedAt))
            .Where(i => i.EntityType == entityType &&
                       i.EntityId == entityId &&
                       i.TenantId == _tenantContext.TenantId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
    }

    public async Task<WorkflowInstance> TransitionAsync(int instanceId, string toStatus, string? notes = null)
    {
        var instance = await GetInstanceAsync(instanceId);
        if (instance == null)
            throw new NotFoundException("Workflow instance not found");

        if (instance.Status != WorkflowInstanceStatus.Active)
            throw new ValidationException($"Cannot transition workflow in status {instance.Status}");

        // Find the matching step
        var step = instance.WorkflowDefinition.Steps
            .FirstOrDefault(s => s.FromStatus == instance.CurrentStatus && s.ToStatus == toStatus);

        if (step == null)
            throw new ValidationException(
                $"No valid transition from '{instance.CurrentStatus}' to '{toStatus}'");

        // Check if approval is required and pending
        if (step.RequiresApproval)
        {
            var approvals = instance.Approvals
                .Where(a => a.WorkflowStepId == step.Id)
                .ToList();

            var approvedCount = approvals.Count(a => a.Status == ApprovalStatus.Approved);
            var requiredCount = step.ApprovalCount ?? 1;

            if (approvedCount < requiredCount)
                throw new ValidationException(
                    $"Insufficient approvals. Required: {requiredCount}, Approved: {approvedCount}");
        }

        var fromStatus = instance.CurrentStatus;
        instance.CurrentStatus = toStatus;
        instance.CurrentStepId = step.Id;

        // Check if this is the final step
        var nextStep = instance.WorkflowDefinition.Steps
            .FirstOrDefault(s => s.FromStatus == toStatus);
        if (nextStep == null)
        {
            instance.Status = WorkflowInstanceStatus.Completed;
            instance.CompletedAt = DateTime.UtcNow;
        }

        // Add history
        var history = new WorkflowHistory
        {
            WorkflowInstanceId = instanceId,
            WorkflowStepId = step.Id,
            FromStatus = fromStatus,
            ToStatus = toStatus,
            Action = "Transition",
            Notes = notes,
            PerformedAt = DateTime.UtcNow
        };
        history.SetCreated("system");
        _context.Set<WorkflowHistory>().Add(history);

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation(
            "Workflow instance {InstanceId} transitioned from '{From}' to '{To}'",
            instanceId, fromStatus, toStatus);

        return instance;
    }

    public async Task<WorkflowInstance> CancelAsync(int instanceId, string? reason = null)
    {
        var instance = await GetInstanceAsync(instanceId);
        if (instance == null)
            throw new NotFoundException("Workflow instance not found");

        if (instance.Status != WorkflowInstanceStatus.Active)
            throw new ValidationException("Only active workflows can be cancelled");

        instance.Status = WorkflowInstanceStatus.Cancelled;

        var history = new WorkflowHistory
        {
            WorkflowInstanceId = instanceId,
            FromStatus = instance.CurrentStatus,
            ToStatus = instance.CurrentStatus,
            Action = "Cancelled",
            Notes = reason,
            PerformedAt = DateTime.UtcNow
        };
        history.SetCreated("system");
        _context.Set<WorkflowHistory>().Add(history);

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Workflow instance {InstanceId} cancelled", instanceId);
        return instance;
    }

    // Workflow History
    public async Task<IEnumerable<WorkflowHistory>> GetHistoryAsync(int instanceId)
    {
        return await _context.Set<WorkflowHistory>()
            .Include(h => h.PerformedBy)
            .Include(h => h.WorkflowStep)
            .Where(h => h.WorkflowInstanceId == instanceId)
            .OrderByDescending(h => h.PerformedAt)
            .ToListAsync();
    }

    // Approvals
    public async Task<WorkflowApproval> RequestApprovalAsync(int instanceId, int stepId, int approverId)
    {
        var instance = await GetInstanceAsync(instanceId);
        if (instance == null)
            throw new NotFoundException("Workflow instance not found");

        var approval = new WorkflowApproval
        {
            WorkflowInstanceId = instanceId,
            WorkflowStepId = stepId,
            ApproverId = approverId,
            Status = ApprovalStatus.Pending,
            ApprovalOrder = instance.Approvals.Count(a => a.WorkflowStepId == stepId) + 1
        };
        approval.SetCreated("system");

        _context.Set<WorkflowApproval>().Add(approval);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation(
            "Approval requested from user {ApproverId} for workflow instance {InstanceId}",
            approverId, instanceId);

        return approval;
    }

    public async Task<WorkflowApproval> ApproveAsync(int approvalId, string? comments = null)
    {
        var approval = await _context.Set<WorkflowApproval>()
            .Include(a => a.WorkflowInstance)
            .FirstOrDefaultAsync(a => a.Id == approvalId);

        if (approval == null)
            throw new NotFoundException("Approval not found");

        if (approval.Status != ApprovalStatus.Pending)
            throw new ValidationException("Approval is not in pending status");

        approval.Status = ApprovalStatus.Approved;
        approval.Comments = comments;
        approval.DecisionAt = DateTime.UtcNow;
        approval.SetUpdated("system");

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Approval {ApprovalId} approved", approvalId);
        return approval;
    }

    public async Task<WorkflowApproval> RejectApprovalAsync(int approvalId, string? comments = null)
    {
        var approval = await _context.Set<WorkflowApproval>()
            .Include(a => a.WorkflowInstance)
            .FirstOrDefaultAsync(a => a.Id == approvalId);

        if (approval == null)
            throw new NotFoundException("Approval not found");

        if (approval.Status != ApprovalStatus.Pending)
            throw new ValidationException("Approval is not in pending status");

        approval.Status = ApprovalStatus.Rejected;
        approval.Comments = comments;
        approval.DecisionAt = DateTime.UtcNow;
        approval.SetUpdated("system");

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Approval {ApprovalId} rejected", approvalId);
        return approval;
    }

    public async Task<IEnumerable<WorkflowApproval>> GetPendingApprovalsAsync(int approverId)
    {
        return await _context.Set<WorkflowApproval>()
            .Include(a => a.WorkflowInstance)
            .ThenInclude(i => i.WorkflowDefinition)
            .Include(a => a.WorkflowStep)
            .Where(a => a.ApproverId == approverId && a.Status == ApprovalStatus.Pending)
            .OrderBy(a => a.CreatedAt)
            .ToListAsync();
    }
}
