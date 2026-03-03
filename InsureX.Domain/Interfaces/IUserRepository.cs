using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Domain.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByEmailWithTenantAsync(string email);
    Task<IEnumerable<User>> GetByTenantIdAsync(int tenantId);
    Task<IEnumerable<User>> GetByRoleAsync(UserRole role);
    Task<bool> EmailExistsAsync(string email, int? excludeId = null);
    Task<User?> GetByRefreshTokenAsync(string token);
    Task<User?> GetByEmailVerificationTokenAsync(string token);
    Task<User?> GetByPasswordResetTokenAsync(string token);
}
