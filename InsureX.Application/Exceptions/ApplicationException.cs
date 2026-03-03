namespace InsureX.Application.Exceptions;

public class ApplicationException : Exception
{
    public ApplicationException(string message) : base(message) { }
    public ApplicationException(string message, Exception innerException) : base(message, innerException) { }
}

public class NotFoundException : ApplicationException
{
    public NotFoundException(string message) : base(message) { }
}

public class ValidationException : ApplicationException
{
    public ValidationException(string message) : base(message) { }
    
    public List<string> Errors { get; set; } = new();
    
    public ValidationException(List<string> errors) : base("Validation failed")
    {
        Errors = errors;
    }
}

public class UnauthorizedException : ApplicationException
{
    public UnauthorizedException(string message) : base(message) { }
}

public class ForbiddenException : ApplicationException
{
    public ForbiddenException(string message) : base(message) { }
}

public class ConflictException : ApplicationException
{
    public ConflictException(string message) : base(message) { }
}
