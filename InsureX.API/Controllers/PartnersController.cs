using InsureX.Application.DTOs;
using InsureX.Application.DTOs.Filters;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class PartnersController : ControllerBase
{
    private readonly IPartnerService _partnerService;
    private readonly ILogger<PartnersController> _logger;

    public PartnersController(IPartnerService partnerService, ILogger<PartnersController> logger)
    {
        _partnerService = partnerService;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<Partner>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] PaginationRequest request)
    {
        var partners = await _partnerService.GetAllAsync(request);
        return Ok(ApiResponse<PagedResult<Partner>>.SuccessResponse(partners));
    }

    [HttpGet("filter")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<Partner>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Filter([FromQuery] PartnerFilterRequest request)
    {
        var partners = await _partnerService.FilterAsync(request);
        return Ok(ApiResponse<PagedResult<Partner>>.SuccessResponse(partners));
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<Partner>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var partner = await _partnerService.GetByIdAsync(id);
        if (partner == null)
            return NotFound(ApiResponse.ErrorResponse("Partner not found"));
        
        return Ok(ApiResponse<Partner>.SuccessResponse(partner));
    }

    [HttpGet("type/{type}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Partner>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByType(PartnerType type)
    {
        var partners = await _partnerService.GetByTypeAsync(type);
        return Ok(ApiResponse<IEnumerable<Partner>>.SuccessResponse(partners));
    }

    [HttpGet("status/{status}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Partner>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByStatus(PartnerStatus status)
    {
        var partners = await _partnerService.GetByStatusAsync(status);
        return Ok(ApiResponse<IEnumerable<Partner>>.SuccessResponse(partners));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<Partner>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] Partner partner)
    {
        var created = await _partnerService.CreateAsync(partner);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, 
            ApiResponse<Partner>.SuccessResponse(created, "Partner created successfully"));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<Partner>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] Partner partner)
    {
        partner.Id = id;
        var updated = await _partnerService.UpdateAsync(partner);
        return Ok(ApiResponse<Partner>.SuccessResponse(updated, "Partner updated successfully"));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        await _partnerService.DeleteAsync(id);
        return Ok(ApiResponse.SuccessResponse("Partner deleted successfully"));
    }

    [HttpPost("{id:int}/activate")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<Partner>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Activate(int id)
    {
        var partner = await _partnerService.ActivateAsync(id);
        return Ok(ApiResponse<Partner>.SuccessResponse(partner, "Partner activated successfully"));
    }

    [HttpPost("{id:int}/deactivate")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<Partner>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deactivate(int id)
    {
        var partner = await _partnerService.DeactivateAsync(id);
        return Ok(ApiResponse<Partner>.SuccessResponse(partner, "Partner deactivated successfully"));
    }

    [HttpGet("check-email")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CheckEmailExists([FromQuery] string email, [FromQuery] int? excludeId)
    {
        var exists = await _partnerService.EmailExistsAsync(email, excludeId);
        return Ok(ApiResponse<bool>.SuccessResponse(exists));
    }
}
