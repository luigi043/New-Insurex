using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByEmailWithTenantAsync(string email)
    {
        return await _dbSet
            .Include(u => u.Tenant)
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<IEnumerable<User>> GetByTenantIdAsync(int tenantId)
    {
        return await _dbSet
            .Where(u => u.TenantId == tenantId)
            .OrderBy(u => u.LastName)
            .ThenBy(u => u.FirstName)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetByRoleAsync(UserRole role)
    {
        return await _dbSet
            .Where(u => u.Role == role)
            .OrderBy(u => u.LastName)
            .ThenBy(u => u.FirstName)
            .ToListAsync();
    }

    public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
    {
        var query = _dbSet.Where(u => u.Email == email);
        
        if (excludeId.HasValue)
            query = query.Where(u => u.Id != excludeId.Value);
        
        return await query.AnyAsync();
    }

    public async Task<User?> GetByRefreshTokenAsync(string token)
    {
        return await _dbSet
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.RefreshTokens.Any(rt => rt.Token == token && !rt.IsRevoked));
    }

    public async Task<User?> GetByEmailVerificationTokenAsync(string token)
    {
        return await _dbSet
            .FirstOrDefaultAsync(u => u.EmailVerificationToken == token);
    }

    public async Task<User?> GetByPasswordResetTokenAsync(string token)
    {
        return await _dbSet
            .FirstOrDefaultAsync(u => u.PasswordResetToken == token);
    }

    public override async Task<User?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(u => u.Tenant)
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Id == id);
    }
}
