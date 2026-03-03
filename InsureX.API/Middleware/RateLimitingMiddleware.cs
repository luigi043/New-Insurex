using System.Collections.Concurrent;

namespace InsureX.API.Middleware;

public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RateLimitingMiddleware> _logger;
    private static readonly ConcurrentDictionary<string, ClientRequestInfo> _clients = new();

    private readonly int _maxRequests = 100; // Max requests per window
    private readonly TimeSpan _window = TimeSpan.FromMinutes(1);

    public RateLimitingMiddleware(RequestDelegate next, ILogger<RateLimitingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var clientId = GetClientIdentifier(context);
        var now = DateTime.UtcNow;

        var clientInfo = _clients.GetOrAdd(clientId, _ => new ClientRequestInfo());

        lock (clientInfo)
        {
            // Remove old requests outside the window
            clientInfo.Requests.RemoveAll(r => now - r > _window);
            
            if (clientInfo.Requests.Count >= _maxRequests)
            {
                _logger.LogWarning("Rate limit exceeded for client {ClientId}", clientId);
                context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                context.Response.Headers.Append("Retry-After", "60");
                return;
            }

            clientInfo.Requests.Add(now);
        }

        await _next(context);
    }

    private string GetClientIdentifier(HttpContext context)
    {
        // Use authenticated user ID if available, otherwise use IP
        var userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userId))
            return $"user:{userId}";

        return $"ip:{context.Connection.RemoteIpAddress?.ToString() ?? "unknown"}";
    }

    private class ClientRequestInfo
    {
        public List<DateTime> Requests { get; } = new();
    }
}
