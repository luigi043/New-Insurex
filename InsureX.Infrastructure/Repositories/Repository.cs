using System.Linq.Expressions;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<IEnumerable<T>> GetAllByTenantAsync(int tenantId)
    {
        return await _dbSet.Where(e => EF.Property<int>(e, "TenantId") == tenantId).ToListAsync();
    }

    public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.Where(predicate).ToListAsync();
    }

    public virtual async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities)
    {
        await _dbSet.AddRangeAsync(entities);
        await _context.SaveChangesAsync();
        return entities;
    }

    public virtual async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }

    public virtual async Task DeleteAsync(T entity)
    {
        // Soft delete
        entity.IsDeleted = true;
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }

    public virtual async Task DeleteRangeAsync(IEnumerable<T> entities)
    {
        foreach (var entity in entities)
        {
            entity.IsDeleted = true;
        }
        _dbSet.UpdateRange(entities);
        await _context.SaveChangesAsync();
    }

    public virtual async Task<bool> ExistsAsync(int id)
    {
        return await _dbSet.AnyAsync(e => e.Id == id);
    }

    public virtual async Task<int> CountAsync()
    {
        return await _dbSet.CountAsync();
    }

    public virtual async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.CountAsync(predicate);
    }

    public virtual IQueryable<T> Query()
    {
        return _dbSet.AsQueryable();
    }

    public virtual IQueryable<T> QueryByTenant(int tenantId)
    {
        return _dbSet.Where(e => EF.Property<int>(e, "TenantId") == tenantId);
    }
}
