using System;
using System.Collections.Generic;

namespace InsureX.Domain.Entities;

public class Partner : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string PartnerType { get; set; } = string.Empty; // Financer, Insurer, Broker
    public string? ContactPerson { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Logo { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Navigation Properties
    public virtual ICollection<Policy> Policies { get; set; } = new List<Policy>();
}
