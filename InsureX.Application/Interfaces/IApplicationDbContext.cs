using Microsoft.EntityFrameworkCore;
using InsureX.Domain.Entities;

namespace InsureX.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Tenant> Tenants { get; }
    DbSet<Policy> Policies { get; }
    DbSet<Claim> Claims { get; }
    DbSet<Asset> Assets { get; }
    DbSet<Partner> Partners { get; }
    DbSet<Invoice> Invoices { get; }
    DbSet<Payment> Payments { get; }
    DbSet<Transaction> Transactions { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
