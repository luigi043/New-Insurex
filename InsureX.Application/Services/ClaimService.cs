// InsureX.Application/Services/ClaimService.cs
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Application.Exceptions;

namespace InsureX.Application.Services;

public class ClaimService : IClaimService
{
    private readonly IClaimRepository _claimRepository;
    private readonly IPolicyRepository _policyRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IUnitOfWork _unitOfWork;

    public ClaimService(
        IClaimRepository claimRepository,
        IPolicyRepository policyRepository,
        ITenantContext tenantContext,
        IUnitOfWork unitOfWork)
    {
        _claimRepository = claimRepository;
        _policyRepository = policyRepository;
        _tenantContext = tenantContext;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<Claim>> GetAllAsync()
    {
        return await _claimRepository.GetAllByTenantAsync(_tenantContext.TenantId);
    }

    public async Task<Claim?> GetByIdAsync(int id)
    {
        var claim = await _claimRepository.GetByIdAsync(id);
        if (claim?.TenantId != _tenantContext.TenantId)
            throw new NotFoundException($"Claim {id} not found");
        return claim;
    }

    public async Task<IEnumerable<Claim>> GetByPolicyIdAsync(int policyId)
    {
        // Verify policy belongs to tenant
        var policy = await _policyRepository.GetByIdAsync(policyId);
        if (policy?.TenantId != _tenantContext.TenantId)
            throw new NotFoundException($"Policy {policyId} not found");
            
        return await _claimRepository.GetByPolicyIdAsync(policyId);
    }

    public async Task<IEnumerable<Claim>> GetByStatusAsync(ClaimStatus status)
    {
        return await _claimRepository.GetByStatusAndTenantAsync(status, _tenantContext.TenantId);
    }

    public async Task<Claim> CreateAsync(Claim claim)
    {
        // Validate policy exists and belongs to tenant
        var policy = await _policyRepository.GetByIdAsync(claim.PolicyId);
        if (policy?.TenantId != _tenantContext.TenantId)
            throw new NotFoundException($"Policy {claim.PolicyId} not found");

        // Business rules
        if (claim.Amount > policy.CoverageAmount)
            throw new ValidationException("Claim amount exceeds policy coverage");

        claim.TenantId = _tenantContext.TenantId;
        claim.Status = ClaimStatus.SUBMITTED;
        claim.SubmittedAt = DateTime.UtcNow;
        claim.ClaimNumber = await GenerateClaimNumberAsync();

        await _claimRepository.AddAsync(claim);
        await _unitOfWork.SaveChangesAsync();
        
        return claim;
    }

    public async Task<Claim> SubmitAsync(int policyId, decimal amount, string description, DateTime dateOfLoss)
    {
        var claim = new Claim
        {
            PolicyId = policyId,
            Amount = amount,
            Description = description,
            DateOfLoss = dateOfLoss
        };
        return await CreateAsync(claim);
    }

    public async Task<Claim> UpdateAsync(Claim claim)
    {
        var existing = await GetByIdAsync(claim.Id);
        if (existing == null)
            throw new NotFoundException($"Claim {claim.Id} not found");

        // Only allow updates for certain statuses
        if (existing.Status != ClaimStatus.SUBMITTED && existing.Status != ClaimStatus.UNDER_REVIEW)
            throw new ValidationException($"Cannot update claim with status {existing.Status}");

        existing.Amount = claim.Amount;
        existing.Description = claim.Description;
        existing.DateOfLoss = claim.DateOfLoss;
        existing.UpdatedAt = DateTime.UtcNow;

        await _claimRepository.UpdateAsync(existing);
        await _unitOfWork.SaveChangesAsync();
        
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var claim = await GetByIdAsync(id);
        if (claim == null)
            throw new NotFoundException($"Claim {id} not found");

        // Only allow deletion of draft/submitted claims
        if (claim.Status != ClaimStatus.SUBMITTED)
            throw new ValidationException("Can only delete submitted claims");

        await _claimRepository.DeleteAsync(claim);
        await _unitOfWork.SaveChangesAsync();
        
        return true;
    }

    public async Task<Claim> ApproveAsync(int id, string? notes)
    {
        var claim = await GetByIdAsync(id);
        if (claim == null)
            throw new NotFoundException($"Claim {id} not found");

        if (claim.Status != ClaimStatus.UNDER_REVIEW)
            throw new ValidationException("Claim must be under review to approve");

        claim.Status = ClaimStatus.APPROVED;
        claim.ApprovedAt = DateTime.UtcNow;
        claim.Notes = notes;
        claim.UpdatedAt = DateTime.UtcNow;

        await _claimRepository.UpdateAsync(claim);
        await _unitOfWork.SaveChangesAsync();
        
        return claim;
    }

    public async Task<Claim> RejectAsync(int id, string reason)
    {
        if (string.IsNullOrWhiteSpace(reason))
            throw new ValidationException("Rejection reason is required");

        var claim = await GetByIdAsync(id);
        if (claim == null)
            throw new NotFoundException($"Claim {id} not found");

        if (claim.Status != ClaimStatus.UNDER_REVIEW)
            throw new ValidationException("Claim must be under review to reject");

        claim.Status = ClaimStatus.REJECTED;
        claim.RejectionReason = reason;
        claim.UpdatedAt = DateTime.UtcNow;

        await _claimRepository.UpdateAsync(claim);
        await _unitOfWork.SaveChangesAsync();
        
        return claim;
    }

    private async Task<string> GenerateClaimNumberAsync()
    {
        var count = await _claimRepository.CountAsync() + 1;
        return $"CLM-{DateTime.UtcNow:yyyyMMdd}-{count:D4}";
    }
}