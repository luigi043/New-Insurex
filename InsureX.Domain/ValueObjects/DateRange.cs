namespace InsureX.Domain.ValueObjects;

public record DateRange
{
    public DateTime Start { get; }
    public DateTime End { get; }

    private DateRange() { } // EF Core

    public DateRange(DateTime start, DateTime end)
    {
        if (end <= start)
            throw new ArgumentException("End date must be after start date");
        
        Start = start;
        End = end;
    }

    public int DurationInDays => (End - Start).Days;
    public bool IsActive => DateTime.UtcNow >= Start && DateTime.UtcNow <= End;
    public bool IsExpired => DateTime.UtcNow > End;
    public bool IsFuture => DateTime.UtcNow < Start;

    public bool Overlaps(DateRange other)
    {
        return Start < other.End && other.Start < End;
    }
}
