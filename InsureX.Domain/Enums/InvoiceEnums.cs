namespace InsureX.Domain.Enums;

public enum InvoiceStatus
{
    Draft = 0,
    Sent = 1,
    Paid = 2,
    Overdue = 3,
    Cancelled = 4,
    PartiallyPaid = 5
}

public enum PaymentMethod
{
    CreditCard = 0,
    BankTransfer = 1,
    Cash = 2,
    Check = 3,
    DirectDebit = 4
}
