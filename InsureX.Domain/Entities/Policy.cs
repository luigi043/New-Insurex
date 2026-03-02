namespace InsureX.Domain.Entities
{
    public class Policy : BaseEntity
    {
        public string PolicyNumber { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public PolicyType Type { get; set; }
        public decimal CoverageAmount { get; set; }
        public decimal Premium { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public PolicyStatus Status { get; set; } = PolicyStatus.Draft;
        public Guid ClientId { get; set; }
        public User Client { get; set; } = null!;
        public Guid? InsurerId { get; set; }
        public User? Insurer { get; set; }
        
        public ICollection<Asset> Assets { get; set; } = new List<Asset>();
        public ICollection<Claim> Claims { get; set; } = new List<Claim>();
        public ICollection<PolicyDocument> Documents { get; set; } = new List<PolicyDocument>();
    }

    public enum PolicyType
    {
        Vehicle,
        Property,
        Watercraft,
        Aviation,
        StockInventory,
        AccountsReceivable,
        Machinery,
        PlantEquipment,
        BusinessInterruption,
        KeymanInsurance,
        ElectronicEquipment,
        GeneralLiability
    }

    public enum PolicyStatus
    {
        Draft,
        PendingApproval,
        Active,
        Expired,
        Cancelled,
        Suspended
    }

    public class PolicyDocument : BaseEntity
    {
        public Guid PolicyId { get; set; }
        public Policy Policy { get; set; } = null!;
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
    public Tenant? Tenant { get; set; }
        public string? Description { get; set; }
    }
}