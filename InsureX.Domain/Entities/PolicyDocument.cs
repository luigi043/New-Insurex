

using InsureX.Domain.Entities;
namespace InsureX.Domain.Entities;

public class PolicyDocument : BaseEntity
{
    public Guid PolicyId { get; set; }
    public Policy Policy { get; set; } = null!;
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string? Description { get; set; }
}