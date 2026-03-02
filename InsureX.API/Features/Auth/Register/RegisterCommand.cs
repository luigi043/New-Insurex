
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using InsureX.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Api.Features.Auth.Register;

public record RegisterCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string PhoneNumber,
    UserRole Role = UserRole.Client
) : IRequest<AuthResponse>;

public class RegisterHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    public RegisterHandler(
        ApplicationDbContext context,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email, cancellationToken))
            throw new InvalidOperationException("Email already registered");

        var user = new User
        {
            Email = request.Email,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            Role = request.Role,
            Status = UserStatus.Active
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        var token = _jwtService.GenerateToken(user);

        return new AuthResponse(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Role,
            token,
            "Registration successful"
        );
    }
}

public record AuthResponse(Guid UserId, string Email, string FirstName, string LastName, UserRole Role, string Token, string Message);