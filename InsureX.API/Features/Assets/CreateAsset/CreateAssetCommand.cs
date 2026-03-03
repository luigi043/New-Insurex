
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Infrastructure.Data;
using MediatR;

namespace InsureX.Api.Features.Assets.CreateAsset;

public record CreateAssetCommand : IRequest<AssetResponse>
{
    public AssetType AssetType { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public decimal Value { get; init; }
    public string? Location { get; init; }
    public DateTime? PurchaseDate { get; init; }
    public string? SerialNumber { get; init; }
    public string? Manufacturer { get; init; }
    public string? Model { get; init; }
    public int? Year { get; init; }
    public string? RegistrationNumber { get; init; }
    public string? VIN { get; init; }
    public string? Notes { get; init; }
}

public class CreateAssetHandler : IRequestHandler<CreateAssetCommand, AssetResponse>
{
    private readonly ApplicationDbContext _context;

    public CreateAssetHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AssetResponse> Handle(CreateAssetCommand request, CancellationToken cancellationToken)
    {
        var asset = new Asset
        {
            Name         = request.Name,
            Description  = request.Description,
            Type         = request.AssetType,
            Value        = request.Value,
            Location     = request.Location,
            PurchaseDate = request.PurchaseDate,
            SerialNumber = request.SerialNumber,
            Manufacturer = request.Manufacturer,
            Model        = request.Model,
            Year         = request.Year,
            RegistrationNumber = request.RegistrationNumber,
            VIN          = request.VIN,
            Notes        = request.Notes,
            Status       = AssetStatus.Active,
        };

        _context.Assets.Add(asset);
        await _context.SaveChangesAsync(cancellationToken);

        return new AssetResponse(asset.Id, asset.Name, asset.Type, asset.Value, asset.Status, asset.CreatedAt);
    }
}

public record AssetResponse(int Id, string Name, AssetType Type, decimal Value, AssetStatus Status, DateTime CreatedAt);
