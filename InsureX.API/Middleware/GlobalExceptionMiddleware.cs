using System.Net;
using System.Text.Json;
using InsureX.Application.DTOs;
using InsureX.Application.Exceptions;

namespace InsureX.API.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public GlobalExceptionMiddleware(
        RequestDelegate next, 
        ILogger<GlobalExceptionMiddleware> logger,
        IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
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
        
        var traceId = context.TraceIdentifier;
        var statusCode = HttpStatusCode.InternalServerError;
        var message = "An unexpected error occurred";
        List<string>? errors = null;

        switch (exception)
        {
            case ValidationException validationEx:
                statusCode = HttpStatusCode.BadRequest;
                message = validationEx.Message;
                errors = validationEx.Errors;
                _logger.LogWarning(exception, "Validation error: {Message}", validationEx.Message);
                break;

            case NotFoundException notFoundEx:
                statusCode = HttpStatusCode.NotFound;
                message = notFoundEx.Message;
                _logger.LogWarning(exception, "Not found: {Message}", notFoundEx.Message);
                break;

            case UnauthorizedException unauthorizedEx:
                statusCode = HttpStatusCode.Unauthorized;
                message = unauthorizedEx.Message;
                _logger.LogWarning(exception, "Unauthorized: {Message}", unauthorizedEx.Message);
                break;

            case ForbiddenException forbiddenEx:
                statusCode = HttpStatusCode.Forbidden;
                message = forbiddenEx.Message;
                _logger.LogWarning(exception, "Forbidden: {Message}", forbiddenEx.Message);
                break;

            case ConflictException conflictEx:
                statusCode = HttpStatusCode.Conflict;
                message = conflictEx.Message;
                _logger.LogWarning(exception, "Conflict: {Message}", conflictEx.Message);
                break;

            case InvalidOperationException invalidOpEx:
                statusCode = HttpStatusCode.BadRequest;
                message = invalidOpEx.Message;
                _logger.LogWarning(exception, "Invalid operation: {Message}", invalidOpEx.Message);
                break;

            case ArgumentException argEx:
                statusCode = HttpStatusCode.BadRequest;
                message = argEx.Message;
                _logger.LogWarning(exception, "Argument error: {Message}", argEx.Message);
                break;

            default:
                _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
                if (_environment.IsDevelopment())
                {
                    message = exception.Message;
                    errors = new List<string> { exception.StackTrace ?? "No stack trace available" };
                }
                break;
        }

        context.Response.StatusCode = (int)statusCode;

        var response = ApiResponse.ErrorResponse(
            message, 
            errors, 
            (int)statusCode
        );
        response.TraceId = traceId;

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
    }
}

public static class GlobalExceptionMiddlewareExtensions
{
    public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app)
    {
        return app.UseMiddleware<GlobalExceptionMiddleware>();
    }
}
