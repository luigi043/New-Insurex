using System.Linq.Expressions;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.Storage;

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
    public DbSet<TenantSettings> TenantSettings => Set<TenantSettings>();
    public DbSet<AuditEntry> AuditEntries => Set<AuditEntry>();
    public DbSet<WorkflowDefinition> WorkflowDefinitions => Set<WorkflowDefinition>();
    public DbSet<WorkflowStep> WorkflowSteps => Set<WorkflowStep>();
    public DbSet<WorkflowInstance> WorkflowInstances => Set<WorkflowInstance>();
    public DbSet<WorkflowHistory> WorkflowHistories => Set<WorkflowHistory>();
    public DbSet<WorkflowApproval> WorkflowApprovals => Set<WorkflowApproval>();
    public DbSet<ReportDefinition> ReportDefinitions => Set<ReportDefinition>();

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
        ConfigureInvestigationNotes(modelBuilder);
        ConfigureTenantSettings(modelBuilder);
        ConfigureAuditEntry(modelBuilder);
        ConfigureWorkflow(modelBuilder);
        ConfigureReportDefinition(modelBuilder);
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

    private void ConfigureInvestigationNotes(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ClaimInvestigationNote>(entity =>
        {
            entity.HasIndex(e => e.ClaimId);
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.AuthorId);
            entity.HasIndex(e => e.Priority);
            entity.HasIndex(e => e.IsResolved);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.HasOne(e => e.Claim).WithMany(c => c.InvestigationNotes).HasForeignKey(e => e.ClaimId);
            entity.HasOne(e => e.Tenant).WithMany().HasForeignKey(e => e.TenantId).OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(e => e.Author).WithMany().HasForeignKey(e => e.AuthorId).OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(e => e.ResolvedBy).WithMany().HasForeignKey(e => e.ResolvedById).OnDelete(DeleteBehavior.NoAction);
        });
    }

    private void ConfigureTenantSettings(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TenantSettings>(entity =>
        {
            entity.HasIndex(e => new { e.TenantId, e.SettingKey }).IsUnique();
            entity.Property(e => e.SettingKey).HasMaxLength(100);
            entity.Property(e => e.SettingValue).HasMaxLength(2000);
            entity.Property(e => e.Category).HasMaxLength(50);
            entity.HasOne(e => e.Tenant).WithMany(t => t.Settings).HasForeignKey(e => e.TenantId);
        });
    }

    private void ConfigureAuditEntry(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditEntry>(entity =>
        {
            entity.ToTable("AuditEntries");
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.EntityType);
            entity.HasIndex(e => e.Timestamp);
            entity.HasIndex(e => new { e.EntityType, e.EntityId });
            entity.Property(e => e.EntityType).HasMaxLength(100);
            entity.Property(e => e.EntityId).HasMaxLength(50);
            entity.Property(e => e.Action).HasMaxLength(50);
            entity.Property(e => e.UserEmail).HasMaxLength(255);
            entity.Property(e => e.IpAddress).HasMaxLength(50);
            entity.Property(e => e.RequestPath).HasMaxLength(500);
            entity.Property(e => e.CorrelationId).HasMaxLength(100);
        });
    }

    private void ConfigureWorkflow(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<WorkflowDefinition>(entity =>
        {
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.EntityType);
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.EntityType).HasMaxLength(100);
            entity.HasOne(e => e.Tenant).WithMany().HasForeignKey(e => e.TenantId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<WorkflowStep>(entity =>
        {
            entity.HasIndex(e => e.WorkflowDefinitionId);
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.FromStatus).HasMaxLength(50);
            entity.Property(e => e.ToStatus).HasMaxLength(50);
            entity.Property(e => e.RequiredRole).HasMaxLength(50);
            entity.HasOne(e => e.WorkflowDefinition).WithMany(d => d.Steps).HasForeignKey(e => e.WorkflowDefinitionId);
        });

        modelBuilder.Entity<WorkflowInstance>(entity =>
        {
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => new { e.EntityType, e.EntityId });
            entity.Property(e => e.EntityType).HasMaxLength(100);
            entity.Property(e => e.CurrentStatus).HasMaxLength(50);
            entity.HasOne(e => e.WorkflowDefinition).WithMany(d => d.Instances).HasForeignKey(e => e.WorkflowDefinitionId);
            entity.HasOne(e => e.Tenant).WithMany().HasForeignKey(e => e.TenantId).OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(e => e.CurrentStep).WithMany().HasForeignKey(e => e.CurrentStepId).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<WorkflowHistory>(entity =>
        {
            entity.HasIndex(e => e.WorkflowInstanceId);
            entity.Property(e => e.FromStatus).HasMaxLength(50);
            entity.Property(e => e.ToStatus).HasMaxLength(50);
            entity.Property(e => e.Action).HasMaxLength(100);
            entity.HasOne(e => e.WorkflowInstance).WithMany(i => i.History).HasForeignKey(e => e.WorkflowInstanceId);
            entity.HasOne(e => e.WorkflowStep).WithMany().HasForeignKey(e => e.WorkflowStepId).OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(e => e.PerformedBy).WithMany().HasForeignKey(e => e.PerformedById).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<WorkflowApproval>(entity =>
        {
            entity.HasIndex(e => e.WorkflowInstanceId);
            entity.HasIndex(e => e.ApproverId);
            entity.HasOne(e => e.WorkflowInstance).WithMany(i => i.Approvals).HasForeignKey(e => e.WorkflowInstanceId);
            entity.HasOne(e => e.WorkflowStep).WithMany().HasForeignKey(e => e.WorkflowStepId).OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(e => e.Approver).WithMany().HasForeignKey(e => e.ApproverId).OnDelete(DeleteBehavior.NoAction);
        });
    }

    private void ConfigureReportDefinition(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ReportDefinition>(entity =>
        {
            entity.HasIndex(e => e.TenantId);
            entity.HasIndex(e => e.Category);
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.Category).HasMaxLength(50);
            entity.Property(e => e.DefaultSortColumn).HasMaxLength(100);
            entity.Property(e => e.CronExpression).HasMaxLength(100);
            entity.Property(e => e.ScheduledFormat).HasMaxLength(20);
            entity.HasOne(e => e.Tenant).WithMany().HasForeignKey(e => e.TenantId).OnDelete(DeleteBehavior.NoAction);
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
        var auditEntries = new List<AuditEntry>();

        // Update audit fields and capture audit trail
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
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

            // Skip audit entries for AuditEntry itself to avoid recursion
            if (entry.Entity.GetType() == typeof(AuditEntry))
                continue;

            var auditEntry = CreateAuditEntry(entry);
            if (auditEntry != null)
                auditEntries.Add(auditEntry);
        }

        var result = await base.SaveChangesAsync(cancellationToken);

        // Save audit entries (post-save to capture generated IDs)
        if (auditEntries.Count > 0)
        {
            foreach (var auditEntry in auditEntries.Where(a => a.Action == "Create"))
            {
                // Update entity ID for newly created entities
                var trackedEntry = ChangeTracker.Entries<BaseEntity>()
                    .FirstOrDefault(e => e.Entity.GetType().Name == auditEntry.EntityType &&
                                        e.Entity.Id.ToString() != "0");
                if (trackedEntry != null)
                    auditEntry.EntityId = trackedEntry.Entity.Id.ToString();
            }

            AuditEntries.AddRange(auditEntries);
            await base.SaveChangesAsync(cancellationToken);
        }

        return result;
    }

    private AuditEntry? CreateAuditEntry(Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<BaseEntity> entry)
    {
        if (entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
            return null;

        var entityType = entry.Entity.GetType().Name;
        var tenantId = entry.Entity.GetType().GetProperty("TenantId")?.GetValue(entry.Entity) as int?;

        var audit = new AuditEntry
        {
            EntityType = entityType,
            EntityId = entry.Entity.Id.ToString(),
            TenantId = tenantId ?? _tenantContext?.TenantId,
            Timestamp = DateTime.UtcNow
        };

        switch (entry.State)
        {
            case EntityState.Added:
                audit.Action = "Create";
                audit.NewValues = System.Text.Json.JsonSerializer.Serialize(
                    entry.Properties.Where(p => p.CurrentValue != null)
                        .ToDictionary(p => p.Metadata.Name, p => p.CurrentValue));
                break;

            case EntityState.Modified:
                var changedProps = entry.Properties.Where(p => p.IsModified).ToList();
                if (changedProps.Count == 0) return null;

                audit.Action = entry.Entity.IsDeleted ? "SoftDelete" : "Update";
                audit.OldValues = System.Text.Json.JsonSerializer.Serialize(
                    changedProps.ToDictionary(p => p.Metadata.Name, p => p.OriginalValue));
                audit.NewValues = System.Text.Json.JsonSerializer.Serialize(
                    changedProps.ToDictionary(p => p.Metadata.Name, p => p.CurrentValue));
                audit.AffectedColumns = System.Text.Json.JsonSerializer.Serialize(
                    changedProps.Select(p => p.Metadata.Name));
                break;

            case EntityState.Deleted:
                audit.Action = "Delete";
                audit.OldValues = System.Text.Json.JsonSerializer.Serialize(
                    entry.Properties.ToDictionary(p => p.Metadata.Name, p => p.OriginalValue));
                break;

            default:
                return null;
        }

        return audit;
    }
}
