using InsureX.Domain.Entities;

namespace InsureX.Domain.Interfaces
{
    public interface ITenantRepository
    {
        Task<Tenant?> GetByIdAsync(Guid id);
        Task<Tenant?> GetByNameAsync(string name);
        Task<IEnumerable<Tenant>> GetAllAsync();
        Task<Tenant> AddAsync(Tenant tenant);
        Task UpdateAsync(Tenant tenant);
        Task DeleteAsync(Guid id);
        Task<bool> ExistsAsync(string name);
    }

    public class Tenant : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}