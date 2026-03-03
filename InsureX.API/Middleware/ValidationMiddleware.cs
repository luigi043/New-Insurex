using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using InsureX.Application.DTOs;

namespace InsureX.API.Middleware;

public class ValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ValidationMiddleware> _logger;

    public ValidationMiddleware(RequestDelegate next, ILogger<ValidationMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Method == "POST" || context.Request.Method == "PUT" || context.Request.Method == "PATCH")
        {
            context.Request.EnableBuffering();
            
            // Check content type
            var contentType = context.Request.ContentType;
            if (contentType != null && contentType.Contains("application/json"))
            {
                try
                {
                    using var reader = new StreamReader(context.Request.Body, leaveOpen: true);
                    var body = await reader.ReadToEndAsync();
                    context.Request.Body.Position = 0;

                    if (!string.IsNullOrWhiteSpace(body))
                    {
                        // Basic JSON validation
                        try
                        {
                            JsonDocument.Parse(body);
                        }
                        catch (JsonException ex)
                        {
                            _logger.LogWarning("Invalid JSON in request body: {Message}", ex.Message);
                            await WriteErrorResponse(context, "Invalid JSON format in request body");
                            return;
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error reading request body for validation");
                }
            }
        }

        await _next(context);
    }

    private static async Task WriteErrorResponse(HttpContext context, string message)
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        context.Response.ContentType = "application/json";
        
        var response = ApiResponse.ErrorResponse(message, statusCode: 400);
        await context.Response.WriteAsJsonAsync(response);
    }
}

public static class ValidationMiddlewareExtensions
{
    public static IApplicationBuilder UseRequestValidation(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ValidationMiddleware>();
    }
}
