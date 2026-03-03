using InsureX.Application.Exceptions;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace InsureX.Application.Services;

public class PolicyService : IPolicyService
{
    private readonly IPolicyRepository _policyRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<PolicyService> _logger;

    public PolicyService(
        IPolicyRepository policyRepository,
        ITenantContext tenantContext,
        IUnitOfWork unitOfWork,
        ILogger<PolicyService> logger)
    {
        _policyRepository = policyRepository;
        _tenantContext = tenantContext;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<IEnumerable<Policy>> GetAllAsync()
    {
        return await _policyRepository.GetAllByTenantAsync(_tenantContext.TenantId);
    }

    public async Task<Policy?> GetByIdAsync(int id)
    {
        var policy = await _policyRepository.GetByIdAsync(id);
        if (policy == null || policy.TenantId != _tenantContext.TenantId)
            return null;
        return policy;
    }

    public async Task<Policy?> GetByPolicyNumberAsync(string policyNumber)
    {
        var policy = await _policyRepository.GetByPolicyNumberAsync(policyNumber);
        if (policy == null || policy.TenantId != _tenantContext.TenantId)
            return null;
        return policy;
    }

    public async Task<IEnumerable<Policy>> GetByStatusAsync(PolicyStatus status)
    {
        return await _policyRepository.GetByStatusAndTenantAsync(status, _tenantContext.TenantId);
    }

    public async Task<IEnumerable<Policy>> GetByTypeAsync(PolicyType type)
    {
        return await _policyRepository.GetByTypeAsync(type);
    }

    public async Task<IEnumerable<Policy>> GetExpiringPoliciesAsync(DateTime from, DateTime to)
    {
        return await _policyRepository.GetExpiringPoliciesAsync(from, to);
    }

    public async Task<Policy> CreateAsync(Policy policy)
    {
        // Validation
        if (string.IsNullOrWhiteSpace(policy.PolicyNumber))
            throw new ValidationException("Policy number is required");

        if (policy.PremiumAmount <= 0)
            throw new ValidationException("Premium amount must be greater than zero");

        if (policy.CoverageAmount <= 0)
            throw new ValidationException("Coverage amount must be greater than zero");

        if (policy.EndDate <= policy.StartDate)
            throw new ValidationException("End date must be after start date");

        // Check for duplicate policy number
        var existing = await _policyRepository.GetByPolicyNumberAsync(policy.PolicyNumber);
        if (existing != null)
            throw new ValidationException("Policy with this number already exists");

        policy.TenantId = _tenantContext.TenantId;
        policy.Status = PolicyStatus.Draft;
        policy.SetCreated("system");

        await _policyRepository.AddAsync(policy);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Policy {PolicyNumber} created", policy.PolicyNumber);

        return policy;
    }

    public async Task<Policy> UpdateAsync(Policy policy)
    {
        var existingPolicy = await GetByIdAsync(policy.Id);
        if (existingPolicy == null)
            throw new NotFoundException("Policy not found");

        // Validation
        if (string.IsNullOrWhiteSpace(policy.PolicyNumber))
            throw new ValidationException("Policy number is required");

        if (policy.PremiumAmount <= 0)
            throw new ValidationException("Premium amount must be greater than zero");

        if (policy.CoverageAmount <= 0)
            throw new ValidationException("Coverage amount must be greater than zero");

        // Check for duplicate policy number
        if (policy.PolicyNumber != existingPolicy.PolicyNumber)
        {
            var existing = await _policyRepository.GetByPolicyNumberAsync(policy.PolicyNumber);
            if (existing != null)
                throw new ValidationException("Policy with this number already exists");
        }

        existingPolicy.PolicyNumber = policy.PolicyNumber;
        existingPolicy.Type = policy.Type;
        existingPolicy.PremiumAmount = policy.PremiumAmount;
        existingPolicy.CoverageAmount = policy.CoverageAmount;
        existingPolicy.Deductible = policy.Deductible;
        existingPolicy.StartDate = policy.StartDate;
        existingPolicy.EndDate = policy.EndDate;
        existingPolicy.PaymentFrequency = policy.PaymentFrequency;
        existingPolicy.InsuredId = policy.InsuredId;
        existingPolicy.BrokerId = policy.BrokerId;
        existingPolicy.UnderwriterId = policy.UnderwriterId;
        existingPolicy.Description = policy.Description;
        existingPolicy.TermsAndConditions = policy.TermsAndConditions;
        existingPolicy.Exclusions = policy.Exclusions;
        existingPolicy.Notes = policy.Notes;
        existingPolicy.SetUpdated("system");

        await _policyRepository.UpdateAsync(existingPolicy);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Policy {PolicyNumber} updated", existingPolicy.PolicyNumber);

        return existingPolicy;
    }

    public async Task DeleteAsync(int id)
    {
        var policy = await GetByIdAsync(id);
        if (policy == null)
            throw new NotFoundException("Policy not found");

        if (policy.Status != PolicyStatus.Draft)
            throw new ValidationException("Can only delete policies in Draft status");

        await _policyRepository.DeleteAsync(policy);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Policy {PolicyNumber} deleted", policy.PolicyNumber);
    }

    public async Task<Policy> ActivateAsync(int policyId)
    {
        var policy = await GetByIdAsync(policyId);
        if (policy == null)
            throw new NotFoundException("Policy not found");

        if (policy.Status != PolicyStatus.Draft && policy.Status != PolicyStatus.Pending)
            throw new ValidationException("Can only activate policies in Draft or Pending status");

        policy.Status = PolicyStatus.Active;
        policy.SetUpdated("system");

        await _policyRepository.UpdateAsync(policy);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Policy {PolicyNumber} activated", policy.PolicyNumber);

        return policy;
    }

    public async Task<Policy> CancelAsync(int policyId, string reason)
    {
        var policy = await GetByIdAsync(policyId);
        if (policy == null)
            throw new NotFoundException("Policy not found");

        if (policy.Status != PolicyStatus.Active && policy.Status != PolicyStatus.Pending)
            throw new ValidationException("Can only cancel active or pending policies");

        if (string.IsNullOrWhiteSpace(reason))
            throw new ValidationException("Cancellation reason is required");

        policy.Status = PolicyStatus.Cancelled;
        policy.CancelledAt = DateTime.UtcNow;
        policy.CancellationReason = reason;
        policy.SetUpdated("system");

        await _policyRepository.UpdateAsync(policy);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Policy {PolicyNumber} cancelled. Reason: {Reason}", policy.PolicyNumber, reason);

        return policy;
    }

    public async Task<Policy> RenewAsync(int policyId, DateTime newEndDate)
    {
        var policy = await GetByIdAsync(policyId);
        if (policy == null)
            throw new NotFoundException("Policy not found");

        if (newEndDate <= policy.EndDate)
            throw new ValidationException("New end date must be after current end date");

        policy.EndDate = newEndDate;
        policy.Status = PolicyStatus.Active;
        policy.SetUpdated("system");

        await _policyRepository.UpdateAsync(policy);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Policy {PolicyNumber} renewed until {EndDate}", policy.PolicyNumber, newEndDate);

        return policy;
    }

    public async Task<decimal> GetTotalPremiumAsync()
    {
        return await _policyRepository.GetTotalPremiumAsync(_tenantContext.TenantId);
    }

    public async Task<decimal> GetTotalCoverageAsync()
    {
        return await _policyRepository.GetTotalCoverageAsync(_tenantContext.TenantId);
    }

    public async Task<int> GetActivePolicyCountAsync()
    {
        return await _policyRepository.GetActivePolicyCountAsync(_tenantContext.TenantId);
    }
}
