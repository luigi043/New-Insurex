using System.Text.RegularExpressions;

namespace InsureX.Application.Utilities;

public static partial class InputSanitizer
{
    /// <summary>
    /// Removes potentially dangerous HTML/script tags from input
    /// </summary>
    public static string SanitizeHtml(string? input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        // Remove script tags and their content
        var result = ScriptTagRegex().Replace(input, string.Empty);

        // Remove event handlers
        result = EventHandlerRegex().Replace(result, string.Empty);

        // Remove javascript: protocol
        result = JavascriptProtocolRegex().Replace(result, string.Empty);

        // Remove HTML tags
        result = HtmlTagRegex().Replace(result, string.Empty);

        return result.Trim();
    }

    /// <summary>
    /// Validates and sanitizes email addresses
    /// </summary>
    public static bool IsValidEmail(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        return EmailRegex().IsMatch(email);
    }

    /// <summary>
    /// Removes SQL injection patterns from input
    /// </summary>
    public static string SanitizeSqlInput(string? input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        // Remove common SQL injection patterns
        var result = SqlInjectionRegex().Replace(input, string.Empty);

        // Remove single quotes (common SQL injection vector)
        result = result.Replace("'", "''");

        return result.Trim();
    }

    /// <summary>
    /// Validates that a string contains only alphanumeric characters and allowed special chars
    /// </summary>
    public static bool IsAlphanumericWithAllowed(string? input, string allowedChars = "-_. ")
    {
        if (string.IsNullOrWhiteSpace(input))
            return false;

        return input.All(c => char.IsLetterOrDigit(c) || allowedChars.Contains(c));
    }

    [GeneratedRegex(@"<script[^>]*>[\s\S]*?</script>", RegexOptions.IgnoreCase)]
    private static partial Regex ScriptTagRegex();

    [GeneratedRegex(@"on\w+\s*=\s*""[^""]*""", RegexOptions.IgnoreCase)]
    private static partial Regex EventHandlerRegex();

    [GeneratedRegex(@"javascript\s*:", RegexOptions.IgnoreCase)]
    private static partial Regex JavascriptProtocolRegex();

    [GeneratedRegex(@"<[^>]+>")]
    private static partial Regex HtmlTagRegex();

    [GeneratedRegex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]
    private static partial Regex EmailRegex();

    [GeneratedRegex(@"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b)", RegexOptions.IgnoreCase)]
    private static partial Regex SqlInjectionRegex();
}
