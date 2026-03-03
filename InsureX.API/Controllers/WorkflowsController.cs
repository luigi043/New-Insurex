using InsureX.Application.DTOs;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class WorkflowsController : ControllerBase
{
    private readonly IWorkflowService _workflowService;
    private readonly ILogger<WorkflowsController> _logger;

    public WorkflowsController(IWorkflowService workflowService, ILogger<WorkflowsController> logger)
    {
        _workflowService = workflowService;
        _logger = logger;
    }

    // Definitions
    [HttpGet("definitions")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<WorkflowDefinition>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDefinitions()
    {
        var definitions = await _workflowService.GetDefinitionsAsync();
        return Ok(ApiResponse<IEnumerable<WorkflowDefinition>>.SuccessResponse(definitions));
    }

    [HttpGet("definitions/{id:int}")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowDefinition>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDefinition(int id)
    {
        var definition = await _workflowService.GetDefinitionByIdAsync(id);
        if (definition == null)
            return NotFound(ApiResponse.ErrorResponse("Workflow definition not found"));

        return Ok(ApiResponse<WorkflowDefinition>.SuccessResponse(definition));
    }

    [HttpPost("definitions")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowDefinition>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateDefinition([FromBody] WorkflowDefinition definition)
    {
        var created = await _workflowService.CreateDefinitionAsync(definition);
        return CreatedAtAction(nameof(GetDefinition), new { id = created.Id },
            ApiResponse<WorkflowDefinition>.SuccessResponse(created, "Workflow definition created"));
    }

    [HttpPut("definitions/{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowDefinition>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateDefinition(int id, [FromBody] WorkflowDefinition definition)
    {
        definition.Id = id;
        var updated = await _workflowService.UpdateDefinitionAsync(definition);
        return Ok(ApiResponse<WorkflowDefinition>.SuccessResponse(updated, "Workflow definition updated"));
    }

    [HttpDelete("definitions/{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteDefinition(int id)
    {
        await _workflowService.DeleteDefinitionAsync(id);
        return Ok(ApiResponse.SuccessResponse("Workflow definition deleted"));
    }

    // Steps
    [HttpPost("definitions/{definitionId:int}/steps")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowStep>), StatusCodes.Status201Created)]
    public async Task<IActionResult> AddStep(int definitionId, [FromBody] WorkflowStep step)
    {
        var created = await _workflowService.AddStepAsync(definitionId, step);
        return Created("", ApiResponse<WorkflowStep>.SuccessResponse(created, "Step added"));
    }

    [HttpPut("steps/{stepId:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowStep>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateStep(int stepId, [FromBody] WorkflowStep step)
    {
        step.Id = stepId;
        var updated = await _workflowService.UpdateStepAsync(step);
        return Ok(ApiResponse<WorkflowStep>.SuccessResponse(updated, "Step updated"));
    }

    [HttpDelete("steps/{stepId:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteStep(int stepId)
    {
        await _workflowService.DeleteStepAsync(stepId);
        return Ok(ApiResponse.SuccessResponse("Step deleted"));
    }

    // Instances
    [HttpPost("instances/start")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowInstance>), StatusCodes.Status201Created)]
    public async Task<IActionResult> StartWorkflow([FromBody] StartWorkflowRequest request)
    {
        var instance = await _workflowService.StartWorkflowAsync(request.DefinitionId, request.EntityType, request.EntityId);
        return Created("", ApiResponse<WorkflowInstance>.SuccessResponse(instance, "Workflow started"));
    }

    [HttpGet("instances/{id:int}")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowInstance>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetInstance(int id)
    {
        var instance = await _workflowService.GetInstanceAsync(id);
        if (instance == null)
            return NotFound(ApiResponse.ErrorResponse("Workflow instance not found"));

        return Ok(ApiResponse<WorkflowInstance>.SuccessResponse(instance));
    }

    [HttpGet("instances/entity/{entityType}/{entityId:int}")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<WorkflowInstance>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetInstancesByEntity(string entityType, int entityId)
    {
        var instances = await _workflowService.GetInstancesByEntityAsync(entityType, entityId);
        return Ok(ApiResponse<IEnumerable<WorkflowInstance>>.SuccessResponse(instances));
    }

    [HttpPost("instances/{id:int}/transition")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowInstance>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Transition(int id, [FromBody] TransitionRequest request)
    {
        var instance = await _workflowService.TransitionAsync(id, request.ToStatus, request.Notes);
        return Ok(ApiResponse<WorkflowInstance>.SuccessResponse(instance, "Workflow transitioned"));
    }

    [HttpPost("instances/{id:int}/cancel")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowInstance>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Cancel(int id, [FromBody] CancelWorkflowRequest? request)
    {
        var instance = await _workflowService.CancelAsync(id, request?.Reason);
        return Ok(ApiResponse<WorkflowInstance>.SuccessResponse(instance, "Workflow cancelled"));
    }

    // History
    [HttpGet("instances/{id:int}/history")]
    [Authorize(Roles = "Admin,Insurer,ClaimsProcessor")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<WorkflowHistory>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHistory(int id)
    {
        var history = await _workflowService.GetHistoryAsync(id);
        return Ok(ApiResponse<IEnumerable<WorkflowHistory>>.SuccessResponse(history));
    }

    // Approvals
    [HttpPost("instances/{instanceId:int}/approvals")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowApproval>), StatusCodes.Status201Created)]
    public async Task<IActionResult> RequestApproval(int instanceId, [FromBody] RequestApprovalDto request)
    {
        var approval = await _workflowService.RequestApprovalAsync(instanceId, request.StepId, request.ApproverId);
        return Created("", ApiResponse<WorkflowApproval>.SuccessResponse(approval, "Approval requested"));
    }

    [HttpPost("approvals/{approvalId:int}/approve")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<WorkflowApproval>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Approve(int approvalId, [FromBody] ApprovalDecisionRequest? request)
    {
        var approval = await _workflowService.ApproveAsync(approvalId, request?.Comments);
        return Ok(ApiResponse<WorkflowApproval>.SuccessResponse(approval, "Approved"));
    }

    [HttpPost("approvals/{approvalId:int}/reject")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<WorkflowApproval>), StatusCodes.Status200OK)]
    public async Task<IActionResult> RejectApproval(int approvalId, [FromBody] ApprovalDecisionRequest? request)
    {
        var approval = await _workflowService.RejectApprovalAsync(approvalId, request?.Comments);
        return Ok(ApiResponse<WorkflowApproval>.SuccessResponse(approval, "Rejected"));
    }

    [HttpGet("approvals/pending")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<WorkflowApproval>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPendingApprovals([FromQuery] int approverId)
    {
        var approvals = await _workflowService.GetPendingApprovalsAsync(approverId);
        return Ok(ApiResponse<IEnumerable<WorkflowApproval>>.SuccessResponse(approvals));
    }
}

public class StartWorkflowRequest
{
    public int DefinitionId { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public int EntityId { get; set; }
}

public class TransitionRequest
{
    public string ToStatus { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class CancelWorkflowRequest
{
    public string? Reason { get; set; }
}

public class RequestApprovalDto
{
    public int StepId { get; set; }
    public int ApproverId { get; set; }
}

public class ApprovalDecisionRequest
{
    public string? Comments { get; set; }
}
