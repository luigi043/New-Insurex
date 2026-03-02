using InsureX.Domain.Entities;
using InsureX.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InsureX.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClaimsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ClaimsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetClaims(
        [FromQuery] Guid? policyId = null,
        [FromQuery] ClaimStatus? status = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Claims
            .Include(c => c.Policy)
            .Include(c => c.Client)
            .AsNoTracking()
            .AsQueryable();

        if (policyId.HasValue)
            query = query.Where(c => c.PolicyId == policyId.Value);
        
        if (status.HasValue)
            query = query.Where(c => c.Status == status.Value);

        var totalCount = await query.CountAsync();
        
        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new {
                c.Id,
                c.ClaimNumber,
                c.Status,
                c.ClaimedAmount,
                c.ApprovedAmount,
                c.IncidentDate,
                c.CreatedAt,
                PolicyNumber = c.Policy.PolicyNumber,
                ClientName = c.Client.FirstName + " " + c.Client.LastName
            })
            .ToListAsync();

        return Ok(new { items, totalCount, pageNumber, pageSize });
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetClaim(Guid id)
    {
        var claim = await _context.Claims
            .Include(c => c.Policy)
            .Include(c => c.Client)
            .Include(c => c.Documents)
            .Include(c => c.StatusHistory)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (claim == null) return NotFound();

        return Ok(claim);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Client")]
    public async Task<ActionResult> CreateClaim([FromBody] CreateClaimRequest request)
    {
        var policy = await _context.Policies.FindAsync(request.PolicyId);
        if (policy == null) return NotFound("Policy not found");

        var year = DateTime.UtcNow.Year;
        var count = await _context.Claims.CountAsync(c => c.CreatedAt.Year == year) + 1;
        var claimNumber = $"CLM-{year}-{count:D6}";
        
        var claim = new Claim
        {
            ClaimNumber = claimNumber,
            PolicyId = request.PolicyId,
            ClientId = policy.ClientId,
            IncidentDate = request.IncidentDate,
            Description = request.Description,
            IncidentLocation = request.IncidentLocation,
            ClaimedAmount = request.ClaimedAmount,
            Type = request.Type,
            Status = ClaimStatus.Submitted
        };

        _context.Claims.Add(claim);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetClaim), new { id = claim.Id }, claim);
    }

    [HttpPost("{id:guid}/process")]
    [Authorize(Roles = "Admin,Insurer")]
    public async Task<ActionResult> ProcessClaim(Guid id, [FromBody] ProcessClaimRequest request)
    {
        var claim = await _context.Claims.FindAsync(id);
        if (claim == null) return NotFound();

        claim.Status = request.NewStatus;
        
        if (request.NewStatus == ClaimStatus.Approved)
            claim.ApprovedAmount = request.ApprovedAmount;
        
        if (request.NewStatus == ClaimStatus.Rejected)
            claim.RejectionReason = request.Reason;

        await _context.SaveChangesAsync();

        return Ok(claim);
    }
}

public class CreateClaimRequest
{
    public Guid PolicyId { get; set; }
    public DateTime IncidentDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? IncidentLocation { get; set; }
    public decimal ClaimedAmount { get; set; }
    public ClaimType Type { get; set; }
}

public class ProcessClaimRequest
{
    public ClaimStatus NewStatus { get; set; }
    public decimal? ApprovedAmount { get; set; }
    public string? Reason { get; set; }
}