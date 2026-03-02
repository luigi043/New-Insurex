using InsureX.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Policy> Policies { get; }
    DbSet<Asset> Assets { get; }
    DbSet<Claim> Claims { get; }
    DbSet<Partner> Partners { get; }
    DbSet<Tenant> Tenants { get; }
    DbSet<Transaction> Transactions { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}