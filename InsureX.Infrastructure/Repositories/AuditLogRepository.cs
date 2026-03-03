using System.Globalization;
using System.Text;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Repositories;

public class AuditLogRepository : Repository<AuditLog>, IAuditLogRepository
{
    public AuditLogRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<AuditLog>> GetByTenantIdAsync(int tenantId, int skip = 0, int take = 100)
    {
        return await _dbSet
            .Where(a => a.TenantId == tenantId)
            .Include(a => a.User)
            .OrderByDescending(a => a.Timestamp)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetByUserIdAsync(int userId, int skip = 0, int take = 100)
    {
        return await _dbSet
            .Where(a => a.UserId == userId)
            .Include(a => a.User)
            .OrderByDescending(a => a.Timestamp)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetByEntityAsync(string entityType, int entityId)
    {
        return await _dbSet
            .Where(a => a.EntityType == entityType && a.EntityId == entityId)
            .Include(a => a.User)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetByActionAsync(int tenantId, string action, DateTime? from = null, DateTime? to = null)
    {
        var query = _dbSet
            .Where(a => a.TenantId == tenantId && a.Action == action);

        if (from.HasValue)
            query = query.Where(a => a.Timestamp >= from.Value);

        if (to.HasValue)
            query = query.Where(a => a.Timestamp <= to.Value);

        return await query
            .Include(a => a.User)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetByCategoryAsync(int tenantId, string category, DateTime? from = null, DateTime? to = null)
    {
        var query = _dbSet
            .Where(a => a.TenantId == tenantId && a.Category == category);

        if (from.HasValue)
            query = query.Where(a => a.Timestamp >= from.Value);

        if (to.HasValue)
            query = query.Where(a => a.Timestamp <= to.Value);

        return await query
            .Include(a => a.User)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetBySeverityAsync(int tenantId, string severity, DateTime? from = null, DateTime? to = null)
    {
        var query = _dbSet
            .Where(a => a.TenantId == tenantId && a.Severity == severity);

        if (from.HasValue)
            query = query.Where(a => a.Timestamp >= from.Value);

        if (to.HasValue)
            query = query.Where(a => a.Timestamp <= to.Value);

        return await query
            .Include(a => a.User)
            .OrderByDescending(a => a.Timestamp)
            .ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> FilterAsync(AuditLogFilter filter)
    {
        var query = _dbSet
            .Where(a => a.TenantId == filter.TenantId);

        if (filter.UserId.HasValue)
            query = query.Where(a => a.UserId == filter.UserId);

        if (!string.IsNullOrEmpty(filter.Action))
            query = query.Where(a => a.Action == filter.Action);

        if (!string.IsNullOrEmpty(filter.EntityType))
            query = query.Where(a => a.EntityType == filter.EntityType);

        if (filter.EntityId.HasValue)
            query = query.Where(a => a.EntityId == filter.EntityId);

        if (!string.IsNullOrEmpty(filter.Category))
            query = query.Where(a => a.Category == filter.Category);

        if (!string.IsNullOrEmpty(filter.Severity))
            query = query.Where(a => a.Severity == filter.Severity);

        if (filter.FromDate.HasValue)
            query = query.Where(a => a.Timestamp >= filter.FromDate.Value);

        if (filter.ToDate.HasValue)
            query = query.Where(a => a.Timestamp <= filter.ToDate.Value);

        if (!string.IsNullOrEmpty(filter.SearchTerm))
        {
            query = query.Where(a =>
                a.Action.Contains(filter.SearchTerm) ||
                a.EntityType.Contains(filter.SearchTerm) ||
                (a.AdditionalData != null && a.AdditionalData.Contains(filter.SearchTerm)));
        }

        return await query
            .Include(a => a.User)
            .OrderByDescending(a => a.Timestamp)
            .Skip(filter.Skip)
            .Take(filter.Take)
            .ToListAsync();
    }

    public async Task<Dictionary<string, int>> GetComplianceStatisticsAsync(int tenantId, DateTime from, DateTime to)
    {
        var stats = new Dictionary<string, int>();

        var logs = await _dbSet
            .Where(a => a.TenantId == tenantId && a.Timestamp >= from && a.Timestamp <= to)
            .ToListAsync();

        stats["TotalActions"] = logs.Count;
        stats["UserLogins"] = logs.Count(a => a.Action == "Login");
        stats["DataModifications"] = logs.Count(a => a.Action == "Update" || a.Action == "Delete");
        stats["PolicyChanges"] = logs.Count(a => a.EntityType == "Policy");
        stats["ClaimChanges"] = logs.Count(a => a.EntityType == "Claim");
        stats["CriticalEvents"] = logs.Count(a => a.Severity == "Critical");
        stats["SecurityEvents"] = logs.Count(a => a.Category == "Security");
        stats["ComplianceEvents"] = logs.Count(a => a.Category == "Compliance");
        stats["UniqueUsers"] = logs.Where(a => a.UserId.HasValue).Select(a => a.UserId).Distinct().Count();

        return stats;
    }

    public async Task<byte[]> ExportComplianceReportAsync(int tenantId, DateTime from, DateTime to)
    {
        var logs = await _dbSet
            .Where(a => a.TenantId == tenantId && a.Timestamp >= from && a.Timestamp <= to)
            .Include(a => a.User)
            .OrderBy(a => a.Timestamp)
            .ToListAsync();

        var stats = await GetComplianceStatisticsAsync(tenantId, from, to);

        var csv = new StringBuilder();
        csv.AppendLine("Compliance Audit Report");
        csv.AppendLine($"Period: {from:yyyy-MM-dd} to {to:yyyy-MM-dd}");
        csv.AppendLine($"Generated: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
        csv.AppendLine();
        csv.AppendLine("Summary Statistics");
        foreach (var stat in stats)
        {
            csv.AppendLine($"{stat.Key},{stat.Value}");
        }
        csv.AppendLine();
        csv.AppendLine("Timestamp,User,Action,Entity Type,Entity ID,Category,Severity,IP Address");

        foreach (var log in logs)
        {
            csv.AppendLine($"\"{log.Timestamp:yyyy-MM-dd HH:mm:ss}\"," +
                          $"\"{log.User?.Email ?? "System"}\"," +
                          $"\"{log.Action}\"," +
                          $"\"{log.EntityType}\"," +
                          $"\"{log.EntityId ?? 0}\"," +
                          $"\"{log.Category}\"," +
                          $"\"{log.Severity}\"," +
                          $"\"{log.IpAddress}\"");
        }

        return Encoding.UTF8.GetBytes(csv.ToString());
    }
}
