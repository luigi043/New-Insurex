using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssetsController : ControllerBase
{
    private readonly IAssetService _assetService;

    public AssetsController(IAssetService assetService)
    {
        _assetService = assetService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? policyId,
        [FromQuery] AssetType? type,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _assetService.GetPagedAsync(policyId, type, search, page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var asset = await _assetService.GetByIdAsync(id);
        if (asset == null) return NotFound();
        return Ok(asset);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _assetService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
