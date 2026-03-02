using InsureX.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Policy> Policies => Set<Policy>();
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<Claim> Claims => Set<Claim>();
    public DbSet<ClaimDocument> ClaimDocuments => Set<ClaimDocument>();
    public DbSet<ClaimNote> ClaimNotes => Set<ClaimNote>();
    public DbSet<ClaimStatusHistory> ClaimStatusHistories => Set<ClaimStatusHistory>();
    public DbSet<PolicyDocument> PolicyDocuments => Set<PolicyDocument>();
    public DbSet<Partner> Partners => Set<Partner>();
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).HasMaxLength(255);
        });

        // Policy configuration
        modelBuilder.Entity<Policy>(entity =>
        {
            entity.HasIndex(e => e.PolicyNumber).IsUnique();
            entity.HasOne(e => e.Client).WithMany(u => u.Policies).HasForeignKey(e => e.ClientId).OnDelete(DeleteBehavior.Restrict);
        });

        // Claim configuration
        modelBuilder.Entity<Claim>(entity =>
        {
            entity.HasIndex(e => e.ClaimNumber).IsUnique();
            entity.HasOne(e => e.Policy).WithMany(p => p.Claims).HasForeignKey(e => e.PolicyId);
            entity.HasOne(e => e.Client).WithMany(u => u.Claims).HasForeignKey(e => e.ClientId);
        });

        // Asset inheritance
        modelBuilder.Entity<Asset>(entity =>
        {
            entity.HasDiscriminator<AssetType>("Type")
                .HasValue<VehicleAsset>(AssetType.Vehicle)
                .HasValue<PropertyAsset>(AssetType.Property)
                .HasValue<WatercraftAsset>(AssetType.Watercraft)
                .HasValue<AviationAsset>(AssetType.Aviation)
                .HasValue<StockInventoryAsset>(AssetType.StockInventory)
                .HasValue<AccountsReceivableAsset>(AssetType.AccountsReceivable)
                .HasValue<MachineryAsset>(AssetType.Machinery)
                .HasValue<PlantEquipmentAsset>(AssetType.PlantEquipment)
                .HasValue<BusinessInterruptionAsset>(AssetType.BusinessInterruption)
                .HasValue<KeymanInsuranceAsset>(AssetType.KeymanInsurance)
                .HasValue<ElectronicEquipmentAsset>(AssetType.ElectronicEquipment);
        });
    }
}