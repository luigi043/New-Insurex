using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

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

    // NEW: Create endpoint
    [HttpPost]
    [Authorize(Roles = "Admin,Client")]
    public async Task<IActionResult> Create([FromBody] CreateAssetRequest request)
    {
        var asset = new Asset
        {
            Name = request.Name,
            Description = request.Description,
            Type = request.Type,
            Value = request.Value,
            PolicyId = request.PolicyId,
            PurchaseDate = request.PurchaseDate,
            SerialNumber = request.SerialNumber,
            Location = request.Location
        };

        var created = await _assetService.CreateAsync(asset);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // NEW: Update endpoint
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Client")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAssetRequest request)
    {
        var existing = await _assetService.GetByIdAsync(id);
        if (existing == null) return NotFound();

        existing.Name = request.Name ?? existing.Name;
        existing.Description = request.Description ?? existing.Description;
        existing.Value = request.Value ?? existing.Value;
        existing.Location = request.Location ?? existing.Location;
        existing.SerialNumber = request.SerialNumber ?? existing.SerialNumber;
        existing.UpdatedAt = DateTime.UtcNow;

        var updated = await _assetService.UpdateAsync(existing);
        return Ok(updated);
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

// NEW: DTOs
public class CreateAssetRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public AssetType Type { get; set; }
    public decimal Value { get; set; }
    public Guid? PolicyId { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public string? SerialNumber { get; set; }
    public string? Location { get; set; }
}

public class UpdateAssetRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Value { get; set; }
    public string? Location { get; set; }
    public string? SerialNumber { get; set; }
}
