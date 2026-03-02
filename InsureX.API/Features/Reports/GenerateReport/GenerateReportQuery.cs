// Controllers/AssetsController.cs
using Insurex.Api.Features.Assets.CreateAsset;
using Insurex.Api.Features.Assets.GetAssetById;
using Insurex.Api.Features.Assets.GetAssets;
using Insurex.Api.Features.Assets.UpdateAsset;
using Insurex.Api.Features.Assets.DeleteAsset;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Insurex.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssetsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AssetsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<AssetListResponse>>> GetAssets(
        [FromQuery] GetAssetsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AssetDetailResponse>> GetAsset(Guid id)
    {
        var result = await _mediator.Send(new GetAssetByIdQuery(id));
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Insurer,Client")]
    public async Task<ActionResult<AssetResponse>> CreateAsset(CreateAssetCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetAsset), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Insurer")]
    public async Task<ActionResult<AssetResponse>> UpdateAsset(Guid id, UpdateAssetCommand command)
    {
        var result = await _mediator.Send(command with { AssetId = id });
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteAsset(Guid id)
    {
        await _mediator.Send(new DeleteAssetCommand(id));
        return NoContent();
    }
}