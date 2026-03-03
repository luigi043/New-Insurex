using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Application.Interfaces;

public interface IPartnerService
{
    Task<IEnumerable<Partner>> GetAllAsync();
    Task<Partner?> GetByIdAsync(int id);
    Task<IEnumerable<Partner>> GetByTypeAsync(PartnerType type);
    Task<IEnumerable<Partner>> GetByStatusAsync(PartnerStatus status);
    Task<Partner> CreateAsync(Partner partner);
    Task<Partner> UpdateAsync(Partner partner);
    Task DeleteAsync(int id);
    Task<Partner> ActivateAsync(int partnerId);
    Task<Partner> DeactivateAsync(int partnerId);
    Task<bool> EmailExistsAsync(string email, int? excludeId = null);
}
