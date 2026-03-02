using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InsureX.Application.Interfaces;
using InsureX.Application.DTOs.Auth;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto loginDto)
    {
        try
        {
            var result = await _authService.LoginAsync(loginDto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex) { return Unauthorized(new { message = ex.Message }); }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto registerDto)
    {
        try
        {
            var result = await _authService.RegisterAsync(registerDto);
            return Ok(result);
        }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { message = "An error occurred during registration" });
        }
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        var user = User.Identity;
        return Ok(new
        {
            IsAuthenticated = user?.IsAuthenticated ?? false,
            Name = user?.Name,
            Claims = User.Claims.Select(c => new { c.Type, c.Value })
        });
    }

    [HttpGet("test")]
    public IActionResult Test() => Ok(new { message = "API is working!", timestamp = DateTime.UtcNow });

    [HttpGet("health")]
    public IActionResult Health() => Ok(new { status = "Healthy", timestamp = DateTime.UtcNow });

    [HttpGet("info")]
    public IActionResult Info() => Ok(new { application = "InsureX API", version = "1.0.0", framework = ".NET 8.0" });
}
