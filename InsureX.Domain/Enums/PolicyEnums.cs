namespace InsureX.Domain.Enums;

public enum PolicyStatus
{
    Draft = 0,
    Pending = 1,
    Active = 2,
    Expired = 3,
    Cancelled = 4
}

public enum PolicyType
{
    Property = 1,
    Vehicle = 2,
    Liability = 3,
    Health = 4,
    Life = 5,
    Business = 6
}

public enum PaymentFrequency
{
    Monthly = 1,
    Quarterly = 2,
    SemiAnnually = 3,
    Annually = 4
}
