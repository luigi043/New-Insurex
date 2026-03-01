using System;

namespace InsureX.Domain.Entities;

public class Tenant : BaseEntity
{
    // Change Id to Guid (inherited from BaseEntity, but we need to ensure BaseEntity uses Guid)
    public new Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? ConnectionString { get; set; }
    public bool IsActive { get; set; } = true;
    public string? LogoUrl { get; set; }
    public string? PrimaryColor { get; set; }
    public string? SecondaryColor { get; set; }
}
