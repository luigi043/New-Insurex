using InsureX.Domain.Entities;

namespace InsureX.Domain.Interfaces;

public interface ITenantRepository
{
    Task<Tenant?> GetByIdAsync(int id);
    Task<Tenant?> GetByNameAsync(string name);
    Task<IEnumerable<Tenant>> GetAllAsync();
    Task<Tenant> AddAsync(Tenant tenant);
    Task UpdateAsync(Tenant tenant);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(string name);
}
