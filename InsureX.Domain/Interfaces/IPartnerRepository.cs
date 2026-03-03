using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Domain.Interfaces;

public interface IPartnerRepository : IRepository<Partner>
{
    Task<Partner?> GetByEmailAsync(string email);
    Task<IEnumerable<Partner>> GetByTypeAsync(PartnerType type);
    Task<IEnumerable<Partner>> GetByTypeAndTenantAsync(PartnerType type, int tenantId);
    Task<IEnumerable<Partner>> GetByStatusAsync(PartnerStatus status);
    Task<Partner?> GetByRegistrationNumberAsync(string registrationNumber);
    Task<IEnumerable<Partner>> GetActivePartnersAsync(int tenantId);
    Task<bool> EmailExistsAsync(string email, int? excludeId = null);
}
