using System.Linq.Expressions;
using InsureX.Domain.Entities;

namespace InsureX.Domain.Interfaces;

public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> GetAllByTenantAsync(int tenantId);
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<T> AddAsync(T entity);
    Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
    Task DeleteRangeAsync(IEnumerable<T> entities);
    Task<bool> ExistsAsync(int id);
    Task<int> CountAsync();
    Task<int> CountAsync(Expression<Func<T, bool>> predicate);
    IQueryable<T> Query();
    IQueryable<T> QueryByTenant(int tenantId);
}


