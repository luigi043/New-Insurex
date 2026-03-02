using InsureX.Domain.Entities;
namespace InsureX.Application.Interfaces;
public interface IPartnerService {
    Task<Partner?> GetByIdAsync(int id); Task<IEnumerable<Partner>> GetAllAsync(); Task<IEnumerable<Partner>> GetByTypeAsync(string partnerType);
    Task<Partner> CreateAsync(Partner partner); Task<Partner> UpdateAsync(Partner partner); Task<bool> DeleteAsync(int id);
}
