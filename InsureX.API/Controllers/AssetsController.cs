using InsureX.Application.DTOs;
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
public class AssetsController : ControllerBase
{
    private readonly IAssetService _assetService;
    private readonly ILogger<AssetsController> _logger;

    public AssetsController(IAssetService assetService, ILogger<AssetsController> logger)
    {
        _assetService = assetService;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Asset>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var assets = await _assetService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<Asset>>.SuccessResponse(assets));
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<Asset>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var asset = await _assetService.GetByIdAsync(id);
        if (asset == null)
            return NotFound(ApiResponse.ErrorResponse("Asset not found"));
        
        return Ok(ApiResponse<Asset>.SuccessResponse(asset));
    }

    [HttpGet("type/{type}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Asset>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByType(AssetType type)
    {
        var assets = await _assetService.GetByTypeAsync(type);
        return Ok(ApiResponse<IEnumerable<Asset>>.SuccessResponse(assets));
    }

    [HttpGet("status/{status}")]
    [Authorize(Roles = "Admin,Insurer,Broker,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Asset>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByStatus(AssetStatus status)
    {
        var assets = await _assetService.GetByStatusAsync(status);
        return Ok(ApiResponse<IEnumerable<Asset>>.SuccessResponse(assets));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Insurer,Broker")]
    [ProducesResponseType(typeof(ApiResponse<Asset>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] Asset asset)
    {
        var created = await _assetService.CreateAsync(asset);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, 
            ApiResponse<Asset>.SuccessResponse(created, "Asset created successfully"));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Insurer,Broker")]
    [ProducesResponseType(typeof(ApiResponse<Asset>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] Asset asset)
    {
        asset.Id = id;
        var updated = await _assetService.UpdateAsync(asset);
        return Ok(ApiResponse<Asset>.SuccessResponse(updated, "Asset updated successfully"));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        await _assetService.DeleteAsync(id);
        return Ok(ApiResponse.SuccessResponse("Asset deleted successfully"));
    }

    [HttpGet("summary/total-value")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<decimal>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTotalValue()
    {
        var totalValue = await _assetService.GetTotalValueAsync();
        return Ok(ApiResponse<decimal>.SuccessResponse(totalValue));
    }

    [HttpGet("expiring-warranty")]
    [Authorize(Roles = "Admin,Insurer,Broker")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Asset>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetExpiringWarranty([FromQuery] DateTime? beforeDate)
    {
        var date = beforeDate ?? DateTime.UtcNow.AddMonths(3);
        var assets = await _assetService.GetExpiringWarrantyAsync(date);
        return Ok(ApiResponse<IEnumerable<Asset>>.SuccessResponse(assets));
    }
}
