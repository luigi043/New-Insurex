using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class AuditRepository : IAuditRepository
{
    private readonly ApplicationDbContext _context;

    public AuditRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(AuditEntry entry)
    {
        await _context.Set<AuditEntry>().AddAsync(entry);
        await _context.SaveChangesAsync();
    }

    public async Task AddRangeAsync(IEnumerable<AuditEntry> entries)
    {
        await _context.Set<AuditEntry>().AddRangeAsync(entries);
        await _context.SaveChangesAsync();
    }

    public async Task<AuditEntry?> GetByIdAsync(long id)
    {
        return await _context.Set<AuditEntry>().FindAsync(id);
    }

    public async Task<IEnumerable<AuditEntry>> GetByEntityAsync(string entityType, string entityId)
    {
        return await _context.Set<AuditEntry>()
            .Where(a => a.EntityType == entityType && a.EntityId == entityId)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<AuditEntry>> GetByUserAsync(int userId, DateTime? from = null, DateTime? to = null)
    {
        var query = _context.Set<AuditEntry>().Where(a => a.UserId == userId);

        if (from.HasValue)
            query = query.Where(a => a.Timestamp >= from.Value);
        if (to.HasValue)
            query = query.Where(a => a.Timestamp <= to.Value);

        return await query.OrderByDescending(a => a.Timestamp).ToListAsync();
    }

    public async Task<IEnumerable<AuditEntry>> GetByTenantAsync(int tenantId, DateTime? from = null, DateTime? to = null)
    {
        var query = _context.Set<AuditEntry>().Where(a => a.TenantId == tenantId);

        if (from.HasValue)
            query = query.Where(a => a.Timestamp >= from.Value);
        if (to.HasValue)
            query = query.Where(a => a.Timestamp <= to.Value);

        return await query.OrderByDescending(a => a.Timestamp).ToListAsync();
    }

    public async Task<(IEnumerable<AuditEntry> Items, int TotalCount)> SearchAsync(
        int? tenantId = null,
        int? userId = null,
        string? entityType = null,
        string? action = null,
        DateTime? from = null,
        DateTime? to = null,
        string? searchTerm = null,
        int pageNumber = 1,
        int pageSize = 20)
    {
        var query = _context.Set<AuditEntry>().AsQueryable();

        if (tenantId.HasValue)
            query = query.Where(a => a.TenantId == tenantId.Value);
        if (userId.HasValue)
            query = query.Where(a => a.UserId == userId.Value);
        if (!string.IsNullOrWhiteSpace(entityType))
            query = query.Where(a => a.EntityType == entityType);
        if (!string.IsNullOrWhiteSpace(action))
            query = query.Where(a => a.Action == action);
        if (from.HasValue)
            query = query.Where(a => a.Timestamp >= from.Value);
        if (to.HasValue)
            query = query.Where(a => a.Timestamp <= to.Value);
        if (!string.IsNullOrWhiteSpace(searchTerm))
            query = query.Where(a =>
                a.EntityType.Contains(searchTerm) ||
                a.EntityId.Contains(searchTerm) ||
                (a.UserEmail != null && a.UserEmail.Contains(searchTerm)) ||
                (a.NewValues != null && a.NewValues.Contains(searchTerm)));

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(a => a.Timestamp)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<IEnumerable<string>> GetDistinctEntityTypesAsync(int tenantId)
    {
        return await _context.Set<AuditEntry>()
            .Where(a => a.TenantId == tenantId)
            .Select(a => a.EntityType)
            .Distinct()
            .OrderBy(t => t)
            .ToListAsync();
    }

    public async Task<IEnumerable<string>> GetDistinctActionsAsync(int tenantId)
    {
        return await _context.Set<AuditEntry>()
            .Where(a => a.TenantId == tenantId)
            .Select(a => a.Action)
            .Distinct()
            .OrderBy(a => a)
            .ToListAsync();
    }

    public async Task<int> GetCountByDateRangeAsync(int tenantId, DateTime from, DateTime to)
    {
        return await _context.Set<AuditEntry>()
            .Where(a => a.TenantId == tenantId && a.Timestamp >= from && a.Timestamp <= to)
            .CountAsync();
    }
}
