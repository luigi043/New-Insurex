// InsureX.API/Middleware/ExceptionHandlingMiddleware.cs
using InsureX.Application.Exceptions;
using System.Net;
using System.Text.Json;

namespace InsureX.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var response = new ErrorResponse();
        
        switch (exception)
        {
            case ValidationException validationEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response.Message = validationEx.Message;
                response.Code = "VALIDATION_ERROR";
                break;
                
            case NotFoundException notFoundEx:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                response.Message = notFoundEx.Message;
                response.Code = "NOT_FOUND";
                break;
                
            case UnauthorizedAccessException:
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                response.Message = "Unauthorized access";
                response.Code = "UNAUTHORIZED";
                break;
                
            default:
                _logger.LogError(exception, "Unhandled exception occurred");
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response.Message = "An unexpected error occurred";
                response.Code = "INTERNAL_ERROR";
                break;
        }
        
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}

public class ErrorResponse
{
    public string Message { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}