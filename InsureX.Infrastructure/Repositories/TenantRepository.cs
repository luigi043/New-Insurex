using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class TenantRepository : ITenantRepository
{
    private readonly ApplicationDbContext _context;

    public TenantRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Tenant?> GetByIdAsync(int id)
    {
        return await _context.Tenants
            .Include(t => t.Settings)
            .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);
    }

    public async Task<Tenant?> GetByNameAsync(string name)
    {
        return await _context.Tenants
            .FirstOrDefaultAsync(t => t.Name == name && !t.IsDeleted);
    }

    public async Task<IEnumerable<Tenant>> GetAllAsync()
    {
        return await _context.Tenants
            .Where(t => !t.IsDeleted)
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<Tenant> AddAsync(Tenant tenant)
    {
        await _context.Tenants.AddAsync(tenant);
        return tenant;
    }

    public Task UpdateAsync(Tenant tenant)
    {
        _context.Tenants.Update(tenant);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(int id)
    {
        var tenant = await _context.Tenants.FindAsync(id);
        if (tenant != null)
        {
            tenant.IsDeleted = true;
            _context.Tenants.Update(tenant);
        }
    }

    public async Task<bool> ExistsAsync(string name)
    {
        return await _context.Tenants.AnyAsync(t => t.Name == name && !t.IsDeleted);
    }
}
