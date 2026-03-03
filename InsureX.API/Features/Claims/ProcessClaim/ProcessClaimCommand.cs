using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace InsureX.API.Features.Claims.ProcessClaim;

public record ClaimResponse(
    int Id,
    string ClaimNumber,
    ClaimStatus Status,
    decimal ClaimedAmount,
    DateTime IncidentDate,
    DateTime CreatedAt
);

public record ProcessClaimCommand(
    int ClaimId,
    ClaimAction Action,
    decimal? ApprovedAmount = null,
    string? RejectionReason = null,
    string? Notes = null
) : IRequest<ClaimResponse>;

public enum ClaimAction { Review, Approve, Reject, Pay, Close }

public class ProcessClaimHandler : IRequestHandler<ProcessClaimCommand, ClaimResponse>
{
    private readonly ApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IEmailService _emailService;

    public ProcessClaimHandler(ApplicationDbContext context, ICurrentUserService currentUser, IEmailService emailService)
    {
        _context = context;
        _currentUser = currentUser;
        _emailService = emailService;
    }

    public async Task<ClaimResponse> Handle(ProcessClaimCommand request, CancellationToken cancellationToken)
    {
        var claim = await _context.Claims
            .Include(c => c.StatusHistory)
            .FirstOrDefaultAsync(c => c.Id == request.ClaimId, cancellationToken)
            ?? throw new KeyNotFoundException("Claim not found");

        var oldStatus = claim.Status;
        var userId = _currentUser.UserId?.ToString() ?? "System";

        switch (request.Action)
        {
            case ClaimAction.Review:
                claim.Status = ClaimStatus.UnderReview;
                break;
            case ClaimAction.Approve:
                if (!request.ApprovedAmount.HasValue)
                    throw new InvalidOperationException("Approved amount is required");
                claim.Status        = ClaimStatus.Approved;
                claim.ApprovedAmount = request.ApprovedAmount.Value;
                claim.ApprovedAt    = DateTime.UtcNow;
                await _emailService.SendEmailAsync(
                    "noreply@insurex.com",
                    $"Claim {claim.ClaimNumber} Approved",
                    $"Your claim {claim.ClaimNumber} has been approved for {claim.ApprovedAmount:C}.",
                    isHtml: true);
                break;
            case ClaimAction.Reject:
                if (string.IsNullOrWhiteSpace(request.RejectionReason))
                    throw new InvalidOperationException("Rejection reason is required");
                claim.Status          = ClaimStatus.Rejected;
                claim.RejectionReason = request.RejectionReason;
                claim.RejectedAt      = DateTime.UtcNow;
                await _emailService.SendEmailAsync(
                    "noreply@insurex.com",
                    $"Claim {claim.ClaimNumber} Rejected",
                    $"Your claim {claim.ClaimNumber} has been rejected. Reason: {request.RejectionReason}",
                    isHtml: true);
                break;
            case ClaimAction.Pay:
                if (claim.Status != ClaimStatus.Approved)
                    throw new InvalidOperationException("Claim must be approved before payment");
                claim.Status           = ClaimStatus.Paid;
                claim.PaidAt           = DateTime.UtcNow;
                claim.PaymentReference = $"PAY-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
                await _emailService.SendEmailAsync(
                    "noreply@insurex.com",
                    $"Claim {claim.ClaimNumber} Paid",
                    $"Your claim {claim.ClaimNumber} payment has been processed. Reference: {claim.PaymentReference}",
                    isHtml: true);
                break;
            case ClaimAction.Close:
                claim.Status          = ClaimStatus.Closed;
                claim.ResolutionNotes = request.Notes;
                claim.ResolvedAt      = DateTime.UtcNow;
                break;
        }

        claim.StatusHistory.Add(new ClaimStatusHistory
        {
            ClaimId    = claim.Id,
            FromStatus = oldStatus,
            ToStatus   = claim.Status,
            ChangedAt  = DateTime.UtcNow,
            Notes      = request.Notes ?? $"Status changed to {claim.Status}"
        });

        await _context.SaveChangesAsync(cancellationToken);

        return new ClaimResponse(claim.Id, claim.ClaimNumber, claim.Status, claim.ClaimedAmount, claim.IncidentDate, claim.CreatedAt);
    }
}
