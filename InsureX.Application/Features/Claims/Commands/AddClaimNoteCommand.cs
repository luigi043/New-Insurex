using InsureX.Application.Exceptions;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using MediatR;

namespace InsureX.Application.Features.Claims.Commands;

public record AddClaimNoteCommand(
    int    ClaimId,
    int    AuthorId,
    string AuthorName,
    string Content,
    bool   IsInternal) : IRequest<Guid>;

public class AddClaimNoteHandler : IRequestHandler<AddClaimNoteCommand, Guid>
{
    private readonly IApplicationDbContext _db;

    public AddClaimNoteHandler(IApplicationDbContext db) => _db = db;

    public async Task<Guid> Handle(AddClaimNoteCommand req, CancellationToken ct)
    {
        var claim = await _db.Claims.FindAsync(new object[] { req.ClaimId }, ct)
            ?? throw new NotFoundException($"Claim {req.ClaimId} not found");

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
