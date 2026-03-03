namespace InsureX.Domain.Enums;

public enum ClaimStatus
{
    Submitted = 0,
    UnderReview = 1,
    Approved = 2,
    Rejected = 3,
    Paid = 4,
    Closed = 5
}

public enum ClaimType
{
    PropertyDamage = 0,
    Liability = 1,
    Theft = 2,
    Accident = 3,
    NaturalDisaster = 4,
    Other = 5
}
