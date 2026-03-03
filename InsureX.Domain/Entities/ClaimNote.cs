// ─────────────────────────────────────────────────────────────────────────────
// InsureX.Domain/Entities/ClaimNote.cs
// ─────────────────────────────────────────────────────────────────────────────
namespace InsureX.Domain.Entities;

public class ClaimNote
{
    public Guid   Id        { get; set; } = Guid.NewGuid();
    public Guid   ClaimId   { get; set; }
    public Guid   AuthorId  { get; set; }
    public string AuthorName{ get; set; } = string.Empty;
    public string Content   { get; set; } = string.Empty;
    public bool   IsInternal{ get; set; }          // adjuster-only note
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual Claim Claim { get; set; } = null!;
}


// ─────────────────────────────────────────────────────────────────────────────
// InsureX.Domain/Entities/AssetInspection.cs
// ─────────────────────────────────────────────────────────────────────────────
namespace InsureX.Domain.Entities;

public enum InspectionStatus { Scheduled, Completed, Cancelled }

public class AssetInspection
{
    public Guid             Id            { get; set; } = Guid.NewGuid();
    public Guid             AssetId       { get; set; }
    public DateTime         ScheduledDate { get; set; }
    public string           Inspector     { get; set; } = string.Empty;
    public InspectionStatus Status        { get; set; } = InspectionStatus.Scheduled;
    public string?          Notes         { get; set; }
    public DateTime?        CompletedDate { get; set; }

    public virtual Asset Asset { get; set; } = null!;
}


// ─────────────────────────────────────────────────────────────────────────────
// InsureX.Application/Claims/Commands/AddClaimNoteCommand.cs
// ─────────────────────────────────────────────────────────────────────────────
using MediatR;

namespace InsureX.Application.Claims.Commands;

public record AddClaimNoteCommand(
    Guid   ClaimId,
    Guid   AuthorId,
    string AuthorName,
    string Content,
    bool   IsInternal) : IRequest<Guid>;

public class AddClaimNoteHandler : IRequestHandler<AddClaimNoteCommand, Guid>
{
    private readonly IApplicationDbContext _db;

    public AddClaimNoteHandler(IApplicationDbContext db) => _db = db;

    public async Task<Guid> Handle(AddClaimNoteCommand req, CancellationToken ct)
    {
        var claim = await _db.Claims.FindAsync([req.ClaimId], ct)
            ?? throw new NotFoundException(nameof(Claim), req.ClaimId);

        var note = new ClaimNote
        {
            ClaimId    = req.ClaimId,
            AuthorId   = req.AuthorId,
            AuthorName = req.AuthorName,
            Content    = req.Content,
            IsInternal = req.IsInternal,
        };

        _db.ClaimNotes.Add(note);
        await _db.SaveChangesAsync(ct);
        return note.Id;
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// InsureX.API/Controllers/ClaimsController.cs  — NOTES endpoints (append only)
// ─────────────────────────────────────────────────────────────────────────────
// Add to existing ClaimsController:

[HttpGet("{id:guid}/notes")]
[Authorize]
public async Task<IActionResult> GetNotes(Guid id, CancellationToken ct)
{
    var notes = await _db.ClaimNotes
        .Where(n => n.ClaimId == id)
        .OrderBy(n => n.CreatedAt)
        .Select(n => new {
            n.Id, n.AuthorName, n.Content, n.IsInternal, n.CreatedAt
        })
        .ToListAsync(ct);

    return Ok(notes);
}

[HttpPost("{id:guid}/notes")]
[Authorize]
public async Task<IActionResult> AddNote(Guid id, [FromBody] AddNoteRequest req, CancellationToken ct)
{
    var noteId = await _mediator.Send(new AddClaimNoteCommand(
        id,
        User.GetUserId(),
        User.GetUserDisplayName(),
        req.Content,
        req.IsInternal
    ), ct);

    return Created($"/api/claims/{id}/notes/{noteId}", new { id = noteId });
}

public record AddNoteRequest(string Content, bool IsInternal = false);


// ─────────────────────────────────────────────────────────────────────────────
// InsureX.API/Controllers/AuthController.cs  — email verification endpoints
// ─────────────────────────────────────────────────────────────────────────────
// Add to existing AuthController:

[HttpGet("verify-email")]
[AllowAnonymous]
public async Task<IActionResult> VerifyEmail([FromQuery] string token, [FromQuery] string email,
    CancellationToken ct)
{
    var result = await _authService.VerifyEmailAsync(email, token, ct);
    if (!result.Succeeded)
        return BadRequest(new { message = "Invalid or expired verification link." });

    return Ok(new { message = "Email verified successfully. You can now log in." });
}

[HttpPost("resend-verification")]
[AllowAnonymous]
public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationRequest req,
    CancellationToken ct)
{
    // Fire-and-forget for security (don't reveal if email exists)
    _ = _authService.SendVerificationEmailAsync(req.Email, ct);
    return Ok(new { message = "If that email is registered, a verification link has been sent." });
}

public record ResendVerificationRequest(string Email);


// ─────────────────────────────────────────────────────────────────────────────
// InsureX.Infrastructure/Migrations  — add after new entities
// Run: dotnet ef migrations add AddClaimNotesAndAssetInspections
//      dotnet ef database update
// ─────────────────────────────────────────────────────────────────────────────

// In InsureX.Infrastructure/Persistence/ApplicationDbContext.cs — add:
public DbSet<ClaimNote>       ClaimNotes       => Set<ClaimNote>();
public DbSet<AssetInspection> AssetInspections => Set<AssetInspection>();

// In OnModelCreating:
modelBuilder.Entity<ClaimNote>(e => {
    e.HasIndex(n => n.ClaimId);
    e.HasOne(n => n.Claim).WithMany(c => c.Notes).HasForeignKey(n => n.ClaimId).OnDelete(DeleteBehavior.Cascade);
});

modelBuilder.Entity<AssetInspection>(e => {
    e.HasIndex(i => i.AssetId);
    e.Property(i => i.Status).HasConversion<string>();
    e.HasOne(i => i.Asset).WithMany(a => a.Inspections).HasForeignKey(i => i.AssetId).OnDelete(DeleteBehavior.Cascade);
});