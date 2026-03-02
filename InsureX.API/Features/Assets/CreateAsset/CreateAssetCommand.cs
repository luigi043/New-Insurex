
using InsureX.Domain.Entities;
using InsureX.Infrastructure.Data;
using MediatR;

namespace InsureX.Api.Features.Assets.CreateAsset;

public record CreateAssetCommand : IRequest<AssetResponse>
{
    public AssetType AssetType { get; init; }
    public Guid PolicyId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Value { get; init; }
    public string Location { get; init; } = string.Empty;
    public DateTime AcquisitionDate { get; init; }
    
    // Vehicle specific
    public string? VehicleMake { get; init; }
    public string? VehicleModel { get; init; }
    public int? VehicleYear { get; init; }
    public string? VehicleRegistrationNumber { get; init; }
    public string? VehicleVinNumber { get; init; }
    public VehicleType? VehicleType { get; init; }
    public FuelType? FuelType { get; init; }
    
    // Property specific
    public PropertyType? PropertyType { get; init; }
    public string? PropertyAddress { get; init; }
    public string? PropertyCity { get; init; }
    public string? PropertyState { get; init; }
    public string? PropertyZipCode { get; init; }
    public decimal? PropertySquareFeet { get; init; }
    public int? PropertyYearBuilt { get; init; }
    public ConstructionType? ConstructionType { get; init; }
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
        Asset asset = request.AssetType switch
        {
            AssetType.Vehicle => new VehicleAsset
            {
                Name = request.Name,
                Description = request.Description,
                Value = request.Value,
                Location = request.Location,
                AcquisitionDate = request.AcquisitionDate,
                PolicyId = request.PolicyId,
                Make = request.VehicleMake!,
                Model = request.VehicleModel!,
                Year = request.VehicleYear ?? 0,
                RegistrationNumber = request.VehicleRegistrationNumber!,
                VinNumber = request.VehicleVinNumber!,
                VehicleType = request.VehicleType ?? Domain.Entities.VehicleType.Car,
                FuelType = request.FuelType ?? Domain.Entities.FuelType.Petrol
            },
            AssetType.Property => new PropertyAsset
            {
                Name = request.Name,
                Description = request.Description,
                Value = request.Value,
                Location = request.Location,
                AcquisitionDate = request.AcquisitionDate,
                PolicyId = request.PolicyId,
                PropertyType = request.PropertyType ?? Domain.Entities.PropertyType.Residential,
                Address = request.PropertyAddress!,
                City = request.PropertyCity!,
                State = request.PropertyState!,
                ZipCode = request.PropertyZipCode!,
                SquareFeet = request.PropertySquareFeet ?? 0,
                YearBuilt = request.PropertyYearBuilt ?? 0,
                ConstructionType = request.ConstructionType ?? Domain.Entities.ConstructionType.WoodFrame
            },
            _ => throw new NotSupportedException($"Asset type {request.AssetType} not yet implemented")
        };

        _context.Assets.Add(asset);
        await _context.SaveChangesAsync(cancellationToken);

        return new AssetResponse(
            asset.Id,
            asset.Name,
            asset.Type,
            asset.Value,
            asset.Status,
            asset.CreatedAt
        );
    }
}

public record AssetResponse(Guid Id, string Name, AssetType Type, decimal Value, AssetStatus Status, DateTime CreatedAt);