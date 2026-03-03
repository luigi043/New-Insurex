namespace InsureX.Domain.Enums;

public enum PartnerType
{
    Agency = 0,
    Broker = 1,
    Insurer = 2,
    Financer = 3,
    ServiceProvider = 4,
    ThirdPartyAdministrator = 5
}

public enum PartnerStatus
{
    Active = 0,
    Inactive = 1,
    Suspended = 2,
    Blacklisted = 3
}
