using Microsoft.EntityFrameworkCore;
using InsureX.Domain.Entities;

namespace InsureX.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; set; }
    DbSet<Tenant> Tenants { get; set; }
    DbSet<Policy> Policies { get; set; }
    DbSet<Asset> Assets { get; set; }
    DbSet<Partner> Partners { get; set; }
    DbSet<Claim> Claims { get; set; }
    DbSet<Transaction> Transactions { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    int SaveChanges();
}
