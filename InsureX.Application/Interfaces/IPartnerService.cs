using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Application.Interfaces;

public interface IPartnerService
{
    Task<Partner?> GetByIdAsync(Guid id);
    Task<IEnumerable<Partner>> GetAllAsync();
    Task<IEnumerable<Partner>> GetByTypeAsync(PartnerType type);
    Task<Partner> CreateAsync(Partner partner);
    Task<Partner> UpdateAsync(Partner partner);
    Task<bool> DeleteAsync(Guid id);
}