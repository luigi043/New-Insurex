// InsureX.Domain/Entities/ClaimNote.cs
namespace InsureX.Domain.Entities;

public class ClaimNote
{
    public Guid    Id         { get; set; } = Guid.NewGuid();
    public int     ClaimId    { get; set; }
    public int     AuthorId   { get; set; }
    public string  AuthorName { get; set; } = string.Empty;
    public string  Content    { get; set; } = string.Empty;
    public bool    IsInternal { get; set; } // adjuster-only note
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual Claim Claim { get; set; } = null!;
}
