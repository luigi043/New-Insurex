using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;

namespace InsureX.Application.Services;

public class ClaimService : IClaimService
{
    private readonly IClaimRepository _claimRepository;
    private readonly ITenantContext _tenantContext;

    public ClaimService(IClaimRepository claimRepository, ITenantContext tenantContext)
    {
        _claimRepository = claimRepository;
        _tenantContext = tenantContext;
    }

    public async Task<Claim?> GetByIdAsync(Guid id)
    {
        return await _claimRepository.GetByIdWithDetailsAsync(id);
    }

    public async Task<PagedResult<Claim>> GetPagedAsync(Guid? policyId, ClaimStatus? status, int pageNumber, int pageSize)
    {
        return await _claimRepository.GetPagedAsync(policyId, status, pageNumber, pageSize);
    }

    public async Task<Claim> CreateAsync(CreateClaimRequest request)
    {
        var year = DateTime.UtcNow.Year;
        var count = await _claimRepository.CountAsync(c => c.CreatedAt.Year == year) + 1;
        var claimNumber = $"CLM-{year}-{count:D6}";

        var claim = new Claim
        {
            ClaimNumber = claimNumber,
            PolicyId = request.PolicyId,
            IncidentDate = request.IncidentDate,
            Description = request.Description,
            IncidentLocation = request.IncidentLocation,
            ClaimedAmount = request.ClaimedAmount,
            Type = request.Type,
            Status = ClaimStatus.Submitted,
            CreatedAt = DateTime.UtcNow
        };

        return await _claimRepository.AddAsync(claim);
    }

    public async Task<Claim> ProcessAsync(Guid id, ProcessClaimRequest request)
    {
        var claim = await _claimRepository.GetByIdAsync(id);
        if (claim == null) throw new KeyNotFoundException($"Claim {id} not found");

        claim.Status = request.NewStatus;

        if (request.NewStatus == ClaimStatus.Approved)
            claim.ApprovedAmount = request.ApprovedAmount;

        if (request.NewStatus == ClaimStatus.Rejected)
            claim.RejectionReason = request.Reason;

        claim.UpdatedAt = DateTime.UtcNow;

        return await _claimRepository.UpdateAsync(claim);
    }

    public async Task<int> CountAsync()
    {
        return await _claimRepository.CountAsync(c => true);
    }

    public async Task<int> CountByStatusAsync(ClaimStatus status)
    {
        return await _claimRepository.CountAsync(c => c.Status == status);
    }

    public async Task<decimal> GetTotalClaimedAmountAsync()
    {
        return await _claimRepository.GetTotalClaimedAmountAsync();
    }
}

// DTOs
public class CreateClaimRequest
{
    public Guid PolicyId { get; set; }
    public DateTime IncidentDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? IncidentLocation { get; set; }
    public decimal ClaimedAmount { get; set; }
    public ClaimType Type { get; set; }
}

public class ProcessClaimRequest
{
    public ClaimStatus NewStatus { get; set; }
    public decimal? ApprovedAmount { get; set; }
    public string? Reason { get; set; }
}
