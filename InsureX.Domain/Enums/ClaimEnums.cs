namespace InsureX.Domain.Enums;

public enum ClaimStatus
{
    Draft = 0,
    Submitted = 1,
    UnderReview = 2,
    Approved = 3,
    Rejected = 4,
    Paid = 5,
    Closed = 6
}

public enum ClaimType
{
    Property = 1,
    Vehicle = 2,
    Liability = 3,
    Health = 4,
    Life = 5,
    BusinessInterruption = 6
}
