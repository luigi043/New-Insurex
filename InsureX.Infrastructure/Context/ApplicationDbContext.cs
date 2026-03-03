using System.Linq.Expressions;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace InsureX.Infrastructure.Context;

public class ApplicationDbContext : DbContext, IUnitOfWork
{
    private readonly ITenantContext? _tenantContext;
    private IDbContextTransaction? _currentTransaction;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ITenantContext tenantContext) 
        : base(options)
    {
        _tenantContext = tenantContext;
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Policy> Policies => Set<Policy>();
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<PolicyAsset> PolicyAssets => Set<PolicyAsset>();
    public DbSet<Claim> Claims => Set<Claim>();
    public DbSet<ClaimStatusHistory> ClaimStatusHistories => Set<ClaimStatusHistory>();
    public DbSet<Partner> Partners => Set<Partner>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceLineItem> InvoiceLineItems => Set<InvoiceLineItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<ClaimInvestigationNote> ClaimInvestigationNotes => Set<ClaimInvestigationNote>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply global query filter for soft delete
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                var method = typeof(ApplicationDbContext)
                    .GetMethod(nameof(SetSoftDeleteFilter), System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static)
                    ?.MakeGenericMethod(entityType.ClrType);
                
                method?.Invoke(null, new object[] { modelBuilder });
            }
        }

        // Apply tenant filter
        if (_tenantContext?.IsValid == true)
        {
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var clrType = entityType.ClrType;
                if (clrType.GetProperty("TenantId") != null)
                {
                    var method = typeof(ApplicationDbContext)
                        .GetMethod(nameof(SetTenantFilter), System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static)
                        ?.MakeGenericMethod(clrType);
                    
                    method?.Invoke(null, new object[] { modelBuilder, _tenantContext.TenantId });
                }
            }
        }

        // Configure entities
        ConfigureUser(modelBuilder);
        ConfigureTenant(modelBuilder);
        ConfigurePolicy(modelBuilder);
        ConfigureAsset(modelBuilder);
        ConfigureClaim(modelBuilder);
        ConfigurePartner(modelBuilder);
        ConfigureInvoice(modelBuilder);
        ConfigureClaimInvestigationNote(modelBuilder);
    }

    private static void SetSoftDeleteFilter<TEntity>(ModelBuilder builder) where TEntity : BaseEntity
    {
        builder.Entity<TEntity>().HasQueryFilter(e => !e.IsDeleted);
    }

    private static void SetTenantFilter<TEntity>(ModelBuilder builder, int tenantId) where TEntity : class
    {
        var parameter = Expression.Parameter(typeof(TEntity), "e");
        var property = Expression.Property(parameter, "TenantId");
        var constant = Expression.Constant(tenantId);
        var equality = Expression.Equal(property, constant);
        var lambda = Expression.Lambda<Func<TEntity, bool>>(equality, parameter);
        
        builder.Entity<TEntity>().HasQueryFilter(lambda);
    }

    private void ConfigureUser(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.TenantId);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.PasswordHash).HasMaxLength(500);
            entity.HasOne(e => e.Tenant).WithMany(t => t.Users).HasForeignKey(e => e.TenantId);
        });
    }

    private void ConfigureTenant(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Tenant>(entity =>
        {
            entity.HasIndex(e => e.Name);
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.ContactEmail).HasMaxLength(255);
        });
    }

    private void ConfigurePolicy(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Policy>(entity =>
        {
            entity.HasIndex(e => e.PolicyNumber).IsUnique();
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.Status);
            entity.Property(e => e.PolicyNumber).HasMaxLength(50);
            entity.Property(e => e.PremiumAmount).HasPrecision(18, 2);
            entity.Property(e => e.CoverageAmount).HasPrecision(18, 2);
            entity.Property(e => e.Deductible).HasPrecision(18, 2);
        });

        modelBuilder.Entity<PolicyAsset>(entity =>
        {
            entity.HasKey(e => new { e.PolicyId, e.AssetId });
            entity.HasOne(e => e.Policy).WithMany(p => p.PolicyAssets).HasForeignKey(e => e.PolicyId);
            entity.HasOne(e => e.Asset).WithMany(a => a.PolicyAssets).HasForeignKey(e => e.AssetId);
        });
    }

    private void ConfigureAsset(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Asset>(entity =>
        {
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.SerialNumber);
            entity.Property(e => e.Value).HasPrecision(18, 2);
            entity.Property(e => e.Name).HasMaxLength(200);
        });
    }

    private void ConfigureClaim(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Claim>(entity =>
        {
            entity.HasIndex(e => e.ClaimNumber).IsUnique();
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.PolicyId);
            entity.Property(e => e.ClaimNumber).HasMaxLength(50);
            entity.Property(e => e.ClaimedAmount).HasPrecision(18, 2);
            entity.Property(e => e.ApprovedAmount).HasPrecision(18, 2);
            entity.Property(e => e.DeductibleApplied).HasPrecision(18, 2);
        });

        modelBuilder.Entity<ClaimStatusHistory>(entity =>
        {
            entity.HasIndex(e => e.ClaimId);
            entity.HasOne(e => e.Claim).WithMany(c => c.StatusHistory).HasForeignKey(e => e.ClaimId);
        });
    }

    private void ConfigurePartner(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Partner>(entity =>
        {
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Email);
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.CommissionRate).HasPrecision(5, 2);
        });
    }

    private void ConfigureInvoice(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasIndex(e => e.InvoiceNumber).IsUnique();
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.DueDate);
            entity.Property(e => e.InvoiceNumber).HasMaxLength(50);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.TaxAmount).HasPrecision(18, 2);
            entity.Property(e => e.PaidAmount).HasPrecision(18, 2);
        });

        modelBuilder.Entity<InvoiceLineItem>(entity =>
        {
            entity.HasIndex(e => e.InvoiceId);
            entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
            entity.Property(e => e.Discount).HasPrecision(18, 2);
            entity.Property(e => e.TaxRate).HasPrecision(5, 2);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasIndex(e => e.InvoiceId);
            entity.HasIndex(e => e.PaymentReference);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.ExchangeRate).HasPrecision(18, 6);
            entity.Property(e => e.OriginalAmount).HasPrecision(18, 2);
        });
    }

    private void ConfigureClaimInvestigationNote(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ClaimInvestigationNote>(entity =>
        {
            entity.HasIndex(e => e.ClaimId);
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.NoteType);
            entity.HasIndex(e => e.IsInternal);
            entity.HasIndex(e => e.NoteDate);
            entity.Property(e => e.Subject).HasMaxLength(500);
            entity.Property(e => e.NoteType).HasMaxLength(100);
            entity.HasOne(e => e.Claim)
                .WithMany(c => c.InvestigationNotes)
                .HasForeignKey(e => e.ClaimId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.CreatedByUser)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    // Unit of Work implementation
    public async Task BeginTransactionAsync()
    {
        if (_currentTransaction != null)
            throw new InvalidOperationException("A transaction is already in progress");

        _currentTransaction = await Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        try
        {
            await SaveChangesAsync();
            if (_currentTransaction != null)
                await _currentTransaction.CommitAsync();
        }
        catch
        {
            await RollbackTransactionAsync();
            throw;
        }
        finally
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.DisposeAsync();
                _currentTransaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_currentTransaction != null)
        {
            await _currentTransaction.RollbackAsync();
            await _currentTransaction.DisposeAsync();
            _currentTransaction = null;
        }
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Update audit fields
        var entries = ChangeTracker.Entries<BaseEntity>();
        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
                if (string.IsNullOrEmpty(entry.Entity.CreatedBy))
                    entry.Entity.CreatedBy = "system";
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
                if (string.IsNullOrEmpty(entry.Entity.UpdatedBy))
                    entry.Entity.UpdatedBy = "system";
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
