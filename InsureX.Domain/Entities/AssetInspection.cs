// InsureX.Domain/Entities/AssetInspection.cs
namespace InsureX.Domain.Entities;

public enum InspectionStatus { Scheduled, Completed, Cancelled }

public class AssetInspection
{
    public Guid             Id            { get; set; } = Guid.NewGuid();
    public int              AssetId       { get; set; }
    public DateTime         ScheduledDate { get; set; }
    public string           Inspector     { get; set; } = string.Empty;
    public InspectionStatus Status        { get; set; } = InspectionStatus.Scheduled;
    public string?          Notes         { get; set; }
    public DateTime?        CompletedDate { get; set; }

    public virtual Asset Asset { get; set; } = null!;
}
