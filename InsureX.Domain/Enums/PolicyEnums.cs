namespace InsureX.Domain.Enums;

public enum PolicyStatus
{
    Draft = 0,
    Active = 1,
    Lapsed = 2,
    Cancelled = 3,
    Reinstated = 4,
    Expired = 5,
    Pending = 6
}

public enum PolicyType
{
    Motor = 0,
    Property = 1,
    Liability = 2,
    Marine = 3,
    Aviation = 4,
    Engineering = 5,
    Miscellaneous = 6
}

public enum PaymentFrequency
{
    Monthly = 0,
    Quarterly = 1,
    SemiAnnually = 2,
    Annually = 3
}
