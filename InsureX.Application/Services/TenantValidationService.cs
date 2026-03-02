using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Application.Services;

public interface ITenantValidationService
{
    Task ValidatePolicyDatesAsync(Guid tenantId);
    Task CheckExpiredPoliciesAsync(Guid tenantId);
}

public class TenantValidationService : ITenantValidationService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<TenantValidationService> _logger;

    public TenantValidationService(ApplicationDbContext context, ILogger<TenantValidationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    // Validate date ranges
    public async Task ValidatePolicyDatesAsync(Guid tenantId)
    {
        var invalidPolicies = await _context.Policies
            .Where(p => p.TenantId == tenantId && p.EndDate <= p.StartDate)
            .ToListAsync();
        
        if (invalidPolicies.Any())
        {
            _logger.LogWarning("Found {Count} policies with invalid dates for tenant {TenantId}", 
                invalidPolicies.Count, tenantId);
            
            foreach (var policy in invalidPolicies)
            {
                _logger.LogWarning("Policy {PolicyNumber} has EndDate {EndDate} <= StartDate {StartDate}", 
                    policy.PolicyNumber, policy.EndDate, policy.StartDate);
            }
        }
    }

    // Check for expired policies
    public async Task CheckExpiredPoliciesAsync(Guid tenantId)
    {
        var expired = await _context.Policies
            .Where(p => p.TenantId == tenantId && 
                       p.EndDate < DateTime.UtcNow && 
                       p.Status == PolicyStatus.Active)
            .ToListAsync();
        
        if (expired.Any())
        {
            _logger.LogWarning("Found {Count} active but expired policies for tenant {TenantId}", 
                expired.Count, tenantId);
            
            // Auto-update expired policies
            foreach (var policy in expired)
            {
                policy.Status = PolicyStatus.Expired;
                policy.UpdatedAt = DateTime.UtcNow;
            }
            
            await _context.SaveChangesAsync();
            _logger.LogInformation("Updated {Count} policies to Expired status", expired.Count);
        }
    }
}