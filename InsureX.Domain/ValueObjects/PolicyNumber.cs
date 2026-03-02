namespace InsureX.Domain.ValueObjects;

public record PolicyNumber
{
    public string Value { get; }

    private PolicyNumber() { } // EF Core

    public PolicyNumber(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Policy number cannot be empty");
        
        if (!System.Text.RegularExpressions.Regex.IsMatch(value, @"^[A-Z0-9\-]+$"))
            throw new ArgumentException("Policy number can only contain uppercase letters, numbers, and hyphens");
        
        Value = value.ToUpper();
    }

    public override string ToString() => Value;
}
