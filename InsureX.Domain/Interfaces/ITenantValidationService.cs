namespace InsureX.Domain.Interfaces;

public interface ITenantValidationService
{
    Task ValidatePolicyDatesAsync(Guid tenantId);
    Task CheckExpiredPoliciesAsync(Guid tenantId);
}