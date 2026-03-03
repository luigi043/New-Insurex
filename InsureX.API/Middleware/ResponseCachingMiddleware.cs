using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Caching.Memory;

namespace InsureX.API.Middleware;

public class ResponseCachingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMemoryCache _cache;
    private readonly ILogger<ResponseCachingMiddleware> _logger;
    private readonly ResponseCachingOptions _options;

    public ResponseCachingMiddleware(
        RequestDelegate next,
        IMemoryCache cache,
        ILogger<ResponseCachingMiddleware> logger,
        ResponseCachingOptions? options = null)
    {
        _next = next;
        _cache = cache;
        _logger = logger;
        _options = options ?? new ResponseCachingOptions();
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Only cache GET requests
        if (context.Request.Method != HttpMethods.Get)
        {
            await _next(context);
            return;
        }

        // Skip caching for authenticated-only endpoints if configured
        var path = context.Request.Path.Value?.ToLower() ?? "";

        // Check if path is in cacheable paths
        if (!IsCacheablePath(path))
        {
            await _next(context);
            return;
        }

        var cacheKey = GenerateCacheKey(context);

        if (_cache.TryGetValue(cacheKey, out CachedResponse? cachedResponse) && cachedResponse != null)
        {
            _logger.LogDebug("Cache hit for {Path}", path);
            context.Response.ContentType = cachedResponse.ContentType;
            context.Response.StatusCode = cachedResponse.StatusCode;
            context.Response.Headers["X-Cache"] = "HIT";
            await context.Response.WriteAsync(cachedResponse.Body);
            return;
        }

        // Capture the response
        var originalBodyStream = context.Response.Body;
        using var memoryStream = new MemoryStream();
        context.Response.Body = memoryStream;

        await _next(context);

        memoryStream.Position = 0;
        var responseBody = await new StreamReader(memoryStream).ReadToEndAsync();

        // Only cache successful responses
        if (context.Response.StatusCode == 200)
        {
            var cached = new CachedResponse
            {
                Body = responseBody,
                ContentType = context.Response.ContentType ?? "application/json",
                StatusCode = context.Response.StatusCode
            };

            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromSeconds(_options.DefaultCacheDurationSeconds))
                .SetSlidingExpiration(TimeSpan.FromSeconds(_options.SlidingExpirationSeconds))
                .SetSize(1);

            _cache.Set(cacheKey, cached, cacheEntryOptions);
            context.Response.Headers["X-Cache"] = "MISS";
        }

        memoryStream.Position = 0;
        await memoryStream.CopyToAsync(originalBodyStream);
    }

    private bool IsCacheablePath(string path)
    {
        return _options.CacheablePaths.Any(p => path.StartsWith(p));
    }

    private static string GenerateCacheKey(HttpContext context)
    {
        var keyBuilder = new StringBuilder();
        keyBuilder.Append(context.Request.Path);
        keyBuilder.Append(context.Request.QueryString);

        // Include tenant ID in cache key for multi-tenancy
        var tenantId = context.Request.Headers["X-Tenant-ID"].FirstOrDefault()
            ?? context.User?.FindFirst("tenant_id")?.Value
            ?? "default";
        keyBuilder.Append($"|tenant:{tenantId}");

        var keyBytes = SHA256.HashData(Encoding.UTF8.GetBytes(keyBuilder.ToString()));
        return $"response_cache:{Convert.ToHexString(keyBytes)}";
    }
}

public class CachedResponse
{
    public string Body { get; set; } = string.Empty;
    public string ContentType { get; set; } = "application/json";
    public int StatusCode { get; set; } = 200;
}

public class ResponseCachingOptions
{
    public int DefaultCacheDurationSeconds { get; set; } = 60;
    public int SlidingExpirationSeconds { get; set; } = 30;
    public List<string> CacheablePaths { get; set; } = new()
    {
        "/api/dashboard",
        "/api/reports/overview",
        "/health"
    };
}

public static class ResponseCachingMiddlewareExtensions
{
    public static IApplicationBuilder UseResponseCaching(this IApplicationBuilder app, ResponseCachingOptions? options = null)
    {
        return app.UseMiddleware<ResponseCachingMiddleware>(options ?? new ResponseCachingOptions());
    }
}
