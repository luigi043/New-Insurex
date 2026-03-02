using MediatR;
using Microsoft.EntityFrameworkCore;
using InsureX.Domain.Entities;
using InsureX.Infrastructure.Data;
using InsureX.Application.Interfaces;

namespace InsureX.API.Features.Claims.ProcessClaim;

public record ClaimResponse(
    Guid Id,
    string ClaimNumber,
    ClaimStatus Status,
    decimal ClaimedAmount,
    DateTime IncidentDate,
    DateTime CreatedAt
);

public record ProcessClaimCommand(
    Guid ClaimId,
    ClaimAction Action,
    decimal? ApprovedAmount = null,
    string? RejectionReason = null,
    string? Notes = null
) : IRequest<ClaimResponse>;

public enum ClaimAction { Review, RequestAdditionalInfo, Approve, Reject, Pay, Close }

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
            .Include(c => c.Policy).ThenInclude(p => p.Client)
            .FirstOrDefaultAsync(c => c.Id == request.ClaimId, cancellationToken)
            ?? throw new KeyNotFoundException("Claim not found");

        var oldStatus = claim.Status;
        var userId = _currentUser.UserId?.ToString() ?? "System";

        switch (request.Action)
        {
            case ClaimAction.Review:
                claim.Status = ClaimStatus.UnderReview;
                claim.ReviewedAt = DateTime.UtcNow;
                claim.ReviewedBy = userId;
                break;
            case ClaimAction.RequestAdditionalInfo:
                claim.Status = ClaimStatus.AdditionalInfoRequired;
                break;
            case ClaimAction.Approve:
                if (!request.ApprovedAmount.HasValue) throw new InvalidOperationException("Approved amount is required");
                claim.Status = ClaimStatus.Approved;
                claim.ApprovedAmount = request.ApprovedAmount.Value;
                claim.ApprovedAt = DateTime.UtcNow;
                claim.ApprovedBy = userId;
                await _emailService.SendClaimApprovedNotificationAsync(claim);
                break;
            case ClaimAction.Reject:
                if (string.IsNullOrWhiteSpace(request.RejectionReason)) throw new InvalidOperationException("Rejection reason is required");
                claim.Status = ClaimStatus.Rejected;
                claim.RejectionReason = request.RejectionReason;
                await _emailService.SendClaimRejectedNotificationAsync(claim);
                break;
            case ClaimAction.Pay:
                if (claim.Status != ClaimStatus.Approved) throw new InvalidOperationException("Claim must be approved before payment");
                claim.Status = ClaimStatus.Paid;
                claim.PaidAt = DateTime.UtcNow;
                claim.PaymentReference = $"PAY-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
                await _emailService.SendClaimPaidNotificationAsync(claim);
                break;
            case ClaimAction.Close:
                claim.Status = ClaimStatus.Closed;
                break;
        }

        claim.StatusHistory.Add(new ClaimStatusHistory
        {
            ClaimId = claim.Id,
            OldStatus = oldStatus,
            NewStatus = claim.Status,
            ChangedBy = userId,
            Reason = request.Notes ?? $"Status changed to {claim.Status}"
        });

        if (!string.IsNullOrWhiteSpace(request.Notes))
            claim.Notes.Add(new ClaimNote { Content = request.Notes, Author = userId, IsInternal = true });

        await _context.SaveChangesAsync(cancellationToken);

        return new ClaimResponse(claim.Id, claim.ClaimNumber, claim.Status, claim.ClaimedAmount, claim.IncidentDate, claim.CreatedAt);
    }
}
