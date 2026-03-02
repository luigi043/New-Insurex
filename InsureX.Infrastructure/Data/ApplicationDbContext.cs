using Microsoft.EntityFrameworkCore;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Application.Interfaces;

namespace InsureX.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    private readonly ITenantContext _tenantContext;

    public DbSet<Claim> Claims => Set<Claim>();
    public DbSet<ClaimDocument> ClaimDocuments => Set<ClaimDocument>();
    public DbSet<Asset> Assets => Set<Asset>();
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        ITenantContext tenantContext) : base(options)
    {
        _tenantContext = tenantContext;
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<Policy> Policies { get; set; }
    public DbSet<Asset> Assets { get; set; }
    public DbSet<Partner> Partners { get; set; }
    public DbSet<Claim> Claims { get; set; }
    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Tenant>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
        });

        modelBuilder.Entity<Policy>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.PolicyNumber).IsUnique();
            entity.Property(e => e.PolicyNumber).IsRequired().HasMaxLength(50);
        });
    }

    public override int SaveChanges()
    {
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await base.SaveChangesAsync(cancellationToken);
    }
}
