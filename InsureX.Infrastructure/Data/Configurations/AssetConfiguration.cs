using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using InsureX.Domain.Entities;

namespace InsureX.Infrastructure.Data.Configurations;

public class AssetConfiguration : IEntityTypeConfiguration<Asset>
{
    public void Configure(EntityTypeBuilder<Asset> builder)
    {
        builder.ToTable("Assets", "registry");
        
        builder.HasKey(a => a.Id);
        
        builder.Property(a => a.Name)
            .HasMaxLength(200)
            .IsRequired();
            
        builder.Property(a => a.Description)
            .HasMaxLength(1000);
            
        builder.Property(a => a.Value)
            .HasPrecision(18, 2);
            
        builder.Property(a => a.Location)
            .HasMaxLength(500);
            
        builder.Property(a => a.InsuranceCertificateNumber)
            .HasMaxLength(100);
            
        // Add indexes
        builder.HasIndex(a => new { a.TenantId, a.Status })
            .HasDatabaseName("IX_Assets_Tenant_Status");
    }
}