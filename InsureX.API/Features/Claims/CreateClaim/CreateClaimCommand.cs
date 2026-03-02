using InsureX.Domain.Entities;
using InsureX.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Api.Features.Claims.CreateClaim;

public record CreateClaimCommand : IRequest<ClaimResponse>
{
    public Guid PolicyId { get; init; }
    public DateTime IncidentDate { get; init; }
    public string Description { get; init; } = string.Empty;
    public string? IncidentLocation { get; init; }
    public decimal ClaimedAmount { get; init; }
    public ClaimType Type { get; init; }
}

public record ClaimDocumentRequest(string FileName, string FileBase64, string FileType, string? Description, DocumentCategory Category);

public class CreateClaimHandler : IRequestHandler<CreateClaimCommand, ClaimResponse>
{
    private readonly ApplicationDbContext _context;

    public CreateClaimHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ClaimResponse> Handle(CreateClaimCommand request, CancellationToken cancellationToken)
    {
        var policy = await _context.Policies.FindAsync(request.PolicyId);
        if (policy == null) throw new InvalidOperationException("Policy not found");

        var year = DateTime.UtcNow.Year;
        var count = await _context.Claims.CountAsync(c => c.CreatedAt.Year == year) + 1;
        var claimNumber = $"CLM-{year}-{count:D6}";
        
        var claim = new Claim
        {
            ClaimNumber = claimNumber,
            PolicyId = request.PolicyId,
            ClientId = policy.ClientId,
            IncidentDate = request.IncidentDate,
            Description = request.Description,
            IncidentLocation = request.IncidentLocation,
            ClaimedAmount = request.ClaimedAmount,
            Type = request.Type,
            Status = ClaimStatus.Submitted
        };

        _context.Claims.Add(claim);
        await _context.SaveChangesAsync(cancellationToken);

        return new ClaimResponse(
            claim.Id,
            claim.ClaimNumber,
            claim.Status,
            claim.ClaimedAmount,
            claim.IncidentDate,
            claim.CreatedAt
        );
    }
}

public record ClaimResponse(Guid Id, string ClaimNumber, ClaimStatus Status, decimal ClaimedAmount, DateTime IncidentDate, DateTime CreatedAt);