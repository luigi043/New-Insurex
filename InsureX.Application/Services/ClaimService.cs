using InsureX.Application.DTOs;
using InsureX.Application.Exceptions;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace InsureX.Application.Services;

public class ClaimService : IClaimService
{
    private readonly IClaimRepository _claimRepository;
    private readonly IPolicyRepository _policyRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ClaimService> _logger;

    public ClaimService(
        IClaimRepository claimRepository,
        IPolicyRepository policyRepository,
        ITenantContext tenantContext,
        IUnitOfWork unitOfWork,
        ILogger<ClaimService> logger)
    {
        _claimRepository = claimRepository;
        _policyRepository = policyRepository;
        _tenantContext = tenantContext;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PagedResult<Claim>> GetAllAsync(PaginationRequest request)
    {
        var query = _claimRepository.QueryByTenant(_tenantContext.TenantId);
        
        // Apply search
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            query = query.Where(c => 
                c.ClaimNumber.Contains(request.SearchTerm) ||
                c.Description.Contains(request.SearchTerm));
        }
        
        // Apply sorting
        query = ApplySorting(query, request.SortBy, request.SortDescending);
        
        var totalCount = await Task.FromResult(query.Count());
        var items = query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();
        
        return new PagedResult<Claim>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public async Task<Claim?> GetByIdAsync(int id)
    {
        var claim = await _claimRepository.GetByIdAsync(id);
        if (claim == null || claim.TenantId != _tenantContext.TenantId)
            return null;
        return claim;
    }

    public async Task<Claim?> GetByClaimNumberAsync(string claimNumber)
    {
        var claim = await _claimRepository.GetByClaimNumberAsync(claimNumber);
        if (claim == null || claim.TenantId != _tenantContext.TenantId)
            return null;
        return claim;
    }

    public async Task<PagedResult<Claim>> GetByPolicyIdAsync(int policyId, PaginationRequest request)
    {
        var policy = await _policyRepository.GetByIdAsync(policyId);
        if (policy == null || policy.TenantId != _tenantContext.TenantId)
            throw new NotFoundException("Policy not found");

        var query = _claimRepository.QueryByTenant(_tenantContext.TenantId)
            .Where(c => c.PolicyId == policyId);
        
        var totalCount = await Task.FromResult(query.Count());
        var items = query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();
        
        return new PagedResult<Claim>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public async Task<IEnumerable<Claim>> GetByStatusAsync(ClaimStatus status)
    {
        return await _claimRepository.GetByStatusAndTenantAsync(status, _tenantContext.TenantId);
    }

    public async Task<IEnumerable<Claim>> GetPendingClaimsAsync()
    {
        return await _claimRepository.GetByStatusAndTenantAsync(ClaimStatus.UnderReview, _tenantContext.TenantId);
    }

    public async Task<PagedResult<Claim>> FilterAsync(ClaimFilterRequest request)
    {
        var query = _claimRepository.QueryByTenant(_tenantContext.TenantId);
        
        // Apply filters
        if (request.PolicyId.HasValue)
            query = query.Where(c => c.PolicyId == request.PolicyId.Value);
        
        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<ClaimStatus>(request.Status, out var status))
            query = query.Where(c => c.Status == status);
        
        if (!string.IsNullOrWhiteSpace(request.ClaimType) && Enum.TryParse<ClaimType>(request.ClaimType, out var claimType))
            query = query.Where(c => c.ClaimType == claimType);
        
        if (request.FromIncidentDate.HasValue)
            query = query.Where(c => c.IncidentDate >= request.FromIncidentDate.Value);
        
        if (request.ToIncidentDate.HasValue)
            query = query.Where(c => c.IncidentDate <= request.ToIncidentDate.Value);
        
        if (request.MinAmount.HasValue)
            query = query.Where(c => c.ClaimedAmount >= request.MinAmount.Value);
        
        if (request.MaxAmount.HasValue)
            query = query.Where(c => c.ClaimedAmount <= request.MaxAmount.Value);
        
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            query = query.Where(c => 
                c.ClaimNumber.Contains(request.SearchTerm) ||
                c.Description.Contains(request.SearchTerm));
        }
        
        // Apply sorting
        query = ApplySorting(query, request.SortBy, request.SortDescending);
        
        var totalCount = await Task.FromResult(query.Count());
        var items = query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();
        
        return new PagedResult<Claim>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public async Task<Claim> CreateAsync(Claim claim)
    {
        // Validate policy exists and belongs to tenant
        var policy = await _policyRepository.GetByIdAsync(claim.PolicyId);
        if (policy == null)
            throw new NotFoundException("Policy not found");
        
        if (policy.TenantId != _tenantContext.TenantId)
            throw new UnauthorizedException("Policy does not belong to current tenant");

        if (!policy.IsActive)
            throw new ValidationException("Cannot create claim for inactive or expired policy");

        // Validate claim amount
        if (claim.ClaimedAmount <= 0)
            throw new ValidationException("Claim amount must be greater than zero");

        if (claim.ClaimedAmount > policy.CoverageAmount)
            throw new ValidationException("Claim amount cannot exceed policy coverage");

        // Generate claim number
        claim.ClaimNumber = await GenerateClaimNumberAsync();
        claim.TenantId = _tenantContext.TenantId;
        claim.Status = ClaimStatus.Submitted;
        claim.ReportedDate = DateTime.UtcNow;
        claim.SetCreated("system");

        await _claimRepository.AddAsync(claim);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Claim {ClaimNumber} created for policy {PolicyNumber}", 
            claim.ClaimNumber, policy.PolicyNumber);

        return claim;
    }

    public async Task<Claim> UpdateAsync(Claim claim)
    {
        var existingClaim = await GetByIdAsync(claim.Id);
        if (existingClaim == null)
            throw new NotFoundException("Claim not found");

        // Only allow updates for certain statuses
        if (existingClaim.Status != ClaimStatus.Submitted && existingClaim.Status != ClaimStatus.UnderReview)
            throw new ValidationException("Cannot update claim that is already processed");

        existingClaim.Description = claim.Description;
        existingClaim.DamageDescription = claim.DamageDescription;
        existingClaim.IncidentLocation = claim.IncidentLocation;
        existingClaim.IncidentDate = claim.IncidentDate;
        existingClaim.ClaimedAmount = claim.ClaimedAmount;
        existingClaim.SetUpdated("system");

        await _claimRepository.UpdateAsync(existingClaim);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Claim {ClaimNumber} updated", existingClaim.ClaimNumber);

        return existingClaim;
    }

    public async Task DeleteAsync(int id)
    {
        var claim = await GetByIdAsync(id);
        if (claim == null)
            throw new NotFoundException("Claim not found");

        if (claim.Status != ClaimStatus.Submitted)
            throw new ValidationException("Can only delete claims that are in Submitted status");

        await _claimRepository.DeleteAsync(claim);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Claim {ClaimNumber} deleted", claim.ClaimNumber);
    }

    public async Task<Claim> SubmitAsync(int claimId)
    {
        var claim = await GetByIdAsync(claimId);
        if (claim == null)
            throw new NotFoundException("Claim not found");

        claim.Submit();
        await _claimRepository.UpdateAsync(claim);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Claim {ClaimNumber} submitted for review", claim.ClaimNumber);

        return claim;
    }

    public async Task<Claim> ApproveAsync(int claimId, decimal approvedAmount, string? notes = null)
    {
        var claim = await GetByIdAsync(claimId);
        if (claim == null)
            throw new NotFoundException("Claim not found");

        claim.Approve(approvedAmount, notes);
        await _claimRepository.UpdateAsync(claim);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Claim {ClaimNumber} approved for {Amount:C}", claim.ClaimNumber, approvedAmount);

        return claim;
    }

    public async Task<Claim> RejectAsync(int claimId, string reason)
    {
        var claim = await GetByIdAsync(claimId);
        if (claim == null)
            throw new NotFoundException("Claim not found");

        claim.Reject(reason);
        await _claimRepository.UpdateAsync(claim);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Claim {ClaimNumber} rejected. Reason: {Reason}", claim.ClaimNumber, reason);

        return claim;
    }

    public async Task<Claim> MarkAsPaidAsync(int claimId, string paymentReference)
    {
        var claim = await GetByIdAsync(claimId);
        if (claim == null)
            throw new NotFoundException("Claim not found");

        claim.MarkAsPaid(paymentReference);
        await _claimRepository.UpdateAsync(claim);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Claim {ClaimNumber} marked as paid. Reference: {Reference}", 
            claim.ClaimNumber, paymentReference);

        return claim;
    }

    public async Task<Claim> CloseAsync(int claimId, string? notes = null)
    {
        var claim = await GetByIdAsync(claimId);
        if (claim == null)
            throw new NotFoundException("Claim not found");

        claim.Close(notes);
        await _claimRepository.UpdateAsync(claim);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Claim {ClaimNumber} closed", claim.ClaimNumber);

        return claim;
    }

    public async Task<decimal> GetTotalClaimedAmountAsync()
    {
        return await _claimRepository.GetTotalClaimedAmountAsync(_tenantContext.TenantId);
    }

    public async Task<decimal> GetTotalPaidAmountAsync()
    {
        return await _claimRepository.GetTotalPaidAmountAsync(_tenantContext.TenantId);
    }

    private async Task<string> GenerateClaimNumberAsync()
    {
        var year = DateTime.UtcNow.Year;
        var count = await _claimRepository.CountAsync() + 1;
        return $"CLM-{year}-{count:D6}";
    }

    private IQueryable<Claim> ApplySorting(IQueryable<Claim> query, string? sortBy, bool descending)
    {
        return sortBy?.ToLower() switch
        {
            "claimnumber" => descending ? query.OrderByDescending(c => c.ClaimNumber) : query.OrderBy(c => c.ClaimNumber),
            "status" => descending ? query.OrderByDescending(c => c.Status) : query.OrderBy(c => c.Status),
            "amount" => descending ? query.OrderByDescending(c => c.ClaimedAmount) : query.OrderBy(c => c.ClaimedAmount),
            "incidentdate" => descending ? query.OrderByDescending(c => c.IncidentDate) : query.OrderBy(c => c.IncidentDate),
            _ => query.OrderByDescending(c => c.CreatedAt)
        };
    }
}
