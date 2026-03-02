
using InsureX.Domain.Entities;
using InsureX.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Api.Features.Assets.GetAssets;

public record GetAssetsQuery(
    Guid? PolicyId = null,
    AssetType? Type = null,
    AssetStatus? Status = null,
    string? SearchTerm = null,
    int PageNumber = 1,
    int PageSize = 10
) : IRequest<PagedList<AssetListResponse>>;

public class GetAssetsHandler : IRequestHandler<GetAssetsQuery, PagedList<AssetListResponse>>
{
    private readonly ApplicationDbContext _context;

    public GetAssetsHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedList<AssetListResponse>> Handle(GetAssetsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Assets
            .Include(a => a.Policy)
            .AsNoTracking()
            .AsQueryable();

        if (request.PolicyId.HasValue)
            query = query.Where(a => a.PolicyId == request.PolicyId.Value);

        if (request.Type.HasValue)
            query = query.Where(a => a.Type == request.Type.Value);

        if (request.Status.HasValue)
            query = query.Where(a => a.Status == request.Status.Value);

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            query = query.Where(a => 
                a.Name.Contains(request.SearchTerm) || 
                a.Description.Contains(request.SearchTerm));

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(a => new AssetListResponse(
                a.Id,
                a.Name,
                a.Type,
                a.Value,
                a.Status,
                a.Location,
                a.Policy.Name,
                a.CreatedAt
            ))
            .ToListAsync(cancellationToken);

        return new PagedList<AssetListResponse>(items, totalCount, request.PageNumber, request.PageSize);
    }
}

public record AssetListResponse(
    Guid Id,
    string Name,
    AssetType Type,
    decimal Value,
    AssetStatus Status,
    string Location,
    string PolicyName,
    DateTime CreatedAt
);

public record PagedList<T>(List<T> Items, int TotalCount, int PageNumber, int PageSize)
{
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;
}