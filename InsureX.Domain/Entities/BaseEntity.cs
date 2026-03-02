using InsureX.Domain.Interfaces;

namespace InsureX.Domain.Entities
{
    public abstract class BaseEntity : ITenantScoped
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
        public string UpdatedBy { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public Guid TenantId { get; set; }
    }
}