using InsureX.Domain.Entities;
namespace InsureX.Domain.Interfaces;
public interface IPartnerRepository {
    Task<Partner?> GetByIdAsync(int id); Task<Partner?> GetByEmailAsync(string email); Task<IEnumerable<Partner>> GetAllAsync();
    Task<IEnumerable<Partner>> GetByTypeAsync(string partnerType); Task AddAsync(Partner partner);
    Task UpdateAsync(Partner partner); Task DeleteAsync(int id);
}
