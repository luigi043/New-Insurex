using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class PartnerRepository : Repository<Partner>, IPartnerRepository
{
    public PartnerRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Partner?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .FirstOrDefaultAsync(p => p.Email == email);
    }

    public async Task<IEnumerable<Partner>> GetByTypeAsync(PartnerType type)
    {
        return await _dbSet
            .Where(p => p.Type == type)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Partner>> GetByTypeAndTenantAsync(PartnerType type, int tenantId)
    {
        return await _dbSet
            .Where(p => p.Type == type && p.TenantId == tenantId)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Partner>> GetByStatusAsync(PartnerStatus status)
    {
        return await _dbSet
            .Where(p => p.Status == status)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<Partner?> GetByRegistrationNumberAsync(string registrationNumber)
    {
        return await _dbSet
            .FirstOrDefaultAsync(p => p.RegistrationNumber == registrationNumber);
    }

    public async Task<IEnumerable<Partner>> GetActivePartnersAsync(int tenantId)
    {
        return await _dbSet
            .Where(p => p.TenantId == tenantId && p.Status == PartnerStatus.Active)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
    {
        var query = _dbSet.Where(p => p.Email == email);
        
        if (excludeId.HasValue)
            query = query.Where(p => p.Id != excludeId.Value);
        
        return await query.AnyAsync();
    }

    public override async Task<Partner?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(p => p.PoliciesAsInsured)
            .Include(p => p.PoliciesAsBroker)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
}
