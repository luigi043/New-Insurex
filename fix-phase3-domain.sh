#!/bin/bash
# Phase 3: Fix Domain Layer - Add Rich Domain Model
# Converts anemic entities to rich domain model with value objects and events

echo "🏛️ PHASE 3: Domain Layer Enrichment"
echo "==================================="

# 1. Create Base Entity with Domain Events
echo "📋 Step 1: Creating base entity with domain events..."

cat > InsureX.Domain/Entities/BaseEntity.cs << 'EOF'
namespace InsureX.Domain.Entities;

public abstract class BaseEntity
{
    public int Id { get; protected set; }
    public DateTime CreatedAt { get; protected set; }
    public DateTime? UpdatedAt { get; protected set; }
    public string CreatedBy { get; protected set; } = string.Empty;
    public string? UpdatedBy { get; protected set; }

    private readonly List<DomainEvent> _domainEvents = new();
    public IReadOnlyCollection<DomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    public void AddDomainEvent(DomainEvent eventItem)
    {
        _domainEvents.Add(eventItem);
    }

    public void RemoveDomainEvent(DomainEvent eventItem)
    {
        _domainEvents.Remove(eventItem);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }

    public void SetCreated(string createdBy)
    {
        CreatedAt = DateTime.UtcNow;
        CreatedBy = createdBy;
    }

    public void SetUpdated(string updatedBy)
    {
        UpdatedAt = DateTime.UtcNow;
        UpdatedBy = updatedBy;
    }
}

public abstract class DomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
    public string EventType { get; protected set; } = string.Empty;
}
EOF

echo "✅ Base entity with domain events created"

# 2. Create Value Objects
echo "📋 Step 2: Creating value objects..."

cat > InsureX.Domain/ValueObjects/Money.cs << 'EOF'
namespace InsureX.Domain.ValueObjects;

public record Money
{
    public decimal Amount { get; }
    public string Currency { get; }

    private Money() { } // EF Core protected constructor

    public Money(decimal amount, string currency = "USD")
    {
        if (amount < 0) throw new ArgumentException("Amount cannot be negative");
        if (string.IsNullOrWhiteSpace(currency)) throw new ArgumentException("Currency is required");
        
        Amount = amount;
        Currency = currency.ToUpper();
    }

    public static Money Zero(string currency = "USD") => new(0, currency);

    public Money Add(Money other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException("Cannot add money with different currencies");
        
        return new Money(Amount + other.Amount, Currency);
    }

    public override string ToString() => $"{Amount:C} {Currency}";
}
EOF

cat > InsureX.Domain/ValueObjects/PolicyNumber.cs << 'EOF'
namespace InsureX.Domain.ValueObjects;

public record PolicyNumber
{
    public string Value { get; }

    private PolicyNumber() { } // EF Core

    public PolicyNumber(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Policy number cannot be empty");
        
        if (!System.Text.RegularExpressions.Regex.IsMatch(value, @"^[A-Z0-9\-]+$"))
            throw new ArgumentException("Policy number can only contain uppercase letters, numbers, and hyphens");
        
        Value = value.ToUpper();
    }

    public override string ToString() => Value;
}
EOF

cat > InsureX.Domain/ValueObjects/DateRange.cs << 'EOF'
namespace InsureX.Domain.ValueObjects;

public record DateRange
{
    public DateTime Start { get; }
    public DateTime End { get; }

    private DateRange() { } // EF Core

    public DateRange(DateTime start, DateTime end)
    {
        if (end <= start)
            throw new ArgumentException("End date must be after start date");
        
        Start = start;
        End = end;
    }

    public int DurationInDays => (End - Start).Days;
    public bool IsActive => DateTime.UtcNow >= Start && DateTime.UtcNow <= End;
    public bool IsExpired => DateTime.UtcNow > End;
    public bool IsFuture => DateTime.UtcNow < Start;

    public bool Overlaps(DateRange other)
    {
        return Start < other.End && other.Start < End;
    }
}
EOF

echo "✅ Value objects created"

# 3. Create Domain Events
echo "📋 Step 3: Creating domain events..."

cat > InsureX.Domain/Events/PolicyCreatedEvent.cs << 'EOF'
using InsureX.Domain.Entities;

namespace InsureX.Domain.Events;

public class PolicyCreatedEvent : DomainEvent
{
    public int PolicyId { get; }
    public string PolicyNumber { get; }
    public int TenantId { get; }
    public DateTime StartDate { get; }
    public DateTime EndDate { get; }

    public PolicyCreatedEvent(Policy policy)
    {
        EventType = nameof(PolicyCreatedEvent);
        PolicyId = policy.Id;
        PolicyNumber = policy.PolicyNumber;
        TenantId = policy.TenantId;
        StartDate = policy.StartDate;
        EndDate = policy.EndDate;
    }
}
EOF

cat > InsureX.Domain/Events/PolicyExpiredEvent.cs << 'EOF'
using InsureX.Domain.Entities;

namespace InsureX.Domain.Events;

public class PolicyExpiredEvent : DomainEvent
{
    public int PolicyId { get; }
    public string PolicyNumber { get; }
    public int TenantId { get; }
    public DateTime ExpiredDate { get; }

    public PolicyExpiredEvent(Policy policy)
    {
        EventType = nameof(PolicyExpiredEvent);
        PolicyId = policy.Id;
        PolicyNumber = policy.PolicyNumber;
        TenantId = policy.TenantId;
        ExpiredDate = DateTime.UtcNow;
    }
}
EOF

cat > InsureX.Domain/Events/ClaimSubmittedEvent.cs << 'EOF'
using InsureX.Domain.Entities;

namespace InsureX.Domain.Events;

public class ClaimSubmittedEvent : DomainEvent
{
    public int ClaimId { get; }
    public int PolicyId { get; }
    public string PolicyNumber { get; }
    public decimal ClaimAmount { get; }
    public int TenantId { get; }

    public ClaimSubmittedEvent(Claim claim, Policy policy)
    {
        EventType = nameof(ClaimSubmittedEvent);
        ClaimId = claim.Id;
        PolicyId = policy.Id;
        PolicyNumber = policy.PolicyNumber;
        ClaimAmount = claim.Amount;
        TenantId = policy.TenantId;
    }
}
EOF

echo "✅ Domain events created"

# 4. Enrich Policy Entity
echo "📋 Step 4: Creating rich Policy entity..."

cat > InsureX.Domain/Entities/Policy.cs << 'EOF'
using InsureX.Domain.Events;
using InsureX.Domain.ValueObjects;

namespace InsureX.Domain.Entities;

public class Policy : BaseEntity
{
    public string PolicyNumber { get; private set; } = string.Empty;
    public string PolicyType { get; private set; } = string.Empty;
    public decimal Premium { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public string Status { get; private set; } = "Active";
    public int TenantId { get; private set; }
    public int? AssetId { get; private set; }
    public int? PartnerId { get; private set; }
    
    // Navigation properties
    public Asset? Asset { get; private set; }
    public Partner? Partner { get; private set; }
    public Tenant? Tenant { get; private set; }
    public ICollection<Claim> Claims { get; private set; } = new List<Claim>();

    // Domain logic methods
    public static Policy Create(
        string policyNumber,
        string policyType,
        decimal premium,
        DateTime startDate,
        DateTime endDate,
        int tenantId,
        int? assetId = null,
        int? partnerId = null)
    {
        var policy = new Policy
        {
            PolicyNumber = new PolicyNumber(policyNumber).Value,
            PolicyType = policyType,
            Premium = premium,
            StartDate = startDate,
            EndDate = endDate,
            TenantId = tenantId,
            AssetId = assetId,
            PartnerId = partnerId,
            Status = "Active"
        };

        policy.SetCreated("system");
        policy.AddDomainEvent(new PolicyCreatedEvent(policy));

        return policy;
    }

    public void UpdateDates(DateTime newStartDate, DateTime newEndDate)
    {
        if (newEndDate <= newStartDate)
            throw new InvalidOperationException("End date must be after start date");

        StartDate = newStartDate;
        EndDate = newEndDate;
        SetUpdated("system");
    }

    public void Expire()
    {
        if (Status == "Expired")
            throw new InvalidOperationException("Policy is already expired");

        Status = "Expired";
        SetUpdated("system");
        AddDomainEvent(new PolicyExpiredEvent(this));
    }

    public void Cancel(string reason)
    {
        if (Status != "Active")
            throw new InvalidOperationException($"Cannot cancel policy with status {Status}");

        Status = "Cancelled";
        SetUpdated("system");
    }

    public void Reinstate()
    {
        if (Status != "Expired" && Status != "Cancelled")
            throw new InvalidOperationException($"Cannot reinstate policy with status {Status}");

        Status = "Active";
        SetUpdated("system");
    }

    public bool IsActive() => Status == "Active" && DateTime.UtcNow <= EndDate;
    public bool IsExpired() => DateTime.UtcNow > EndDate || Status == "Expired";
    
    public Money GetPremium() => new(Premium);
    public DateRange GetCoveragePeriod() => new(StartDate, EndDate);
}
EOF

echo "✅ Rich Policy entity created"

# 5. Create Claim Entity
echo "📋 Step 5: Creating Claim entity..."

cat > InsureX.Domain/Entities/Claim.cs << 'EOF'
using InsureX.Domain.Events;

namespace InsureX.Domain.Entities;

public class Claim : BaseEntity
{
    public string ClaimNumber { get; private set; } = string.Empty;
    public int PolicyId { get; private set; }
    public decimal Amount { get; private set; }
    public string Description { get; private set; } = string.Empty;
    public string Status { get; private set; } = "Submitted";
    public DateTime IncidentDate { get; private set; }
    public string? ResolutionNotes { get; private set; }
    public DateTime? ResolvedAt { get; private set; }
    
    public Policy Policy { get; private set; } = null!;

    public static Claim Create(
        string claimNumber,
        int policyId,
        decimal amount,
        string description,
        DateTime incidentDate)
    {
        if (amount <= 0)
            throw new ArgumentException("Claim amount must be positive");

        var claim = new Claim
        {
            ClaimNumber = claimNumber,
            PolicyId = policyId,
            Amount = amount,
            Description = description,
            IncidentDate = incidentDate,
            Status = "Submitted"
        };

        claim.SetCreated("system");
        return claim;
    }

    public void Approve(string? notes = null)
    {
        if (Status != "Submitted" && Status != "UnderReview")
            throw new InvalidOperationException($"Cannot approve claim with status {Status}");

        Status = "Approved";
        ResolutionNotes = notes;
        ResolvedAt = DateTime.UtcNow;
        SetUpdated("system");
    }

    public void Reject(string reason)
    {
        if (Status != "Submitted" && Status != "UnderReview")
            throw new InvalidOperationException($"Cannot reject claim with status {Status}");

        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("Rejection reason is required");

        Status = "Rejected";
        ResolutionNotes = reason;
        ResolvedAt = DateTime.UtcNow;
        SetUpdated("system");
    }

    public void Review()
    {
        if (Status != "Submitted")
            throw new InvalidOperationException("Only submitted claims can be put under review");

        Status = "UnderReview";
        SetUpdated("system");
    }

    public void SubmitToPolicy(Policy policy)
    {
        if (!policy.IsActive())
            throw new InvalidOperationException("Cannot submit claim to inactive policy");

        AddDomainEvent(new ClaimSubmittedEvent(this, policy));
    }
}
EOF

echo "✅ Claim entity created"

# 6. Create Domain Service
echo "📋 Step 6: Creating domain service..."

cat > InsureX.Domain/Services/IPremiumCalculationService.cs << 'EOF'
using InsureX.Domain.Entities;
using InsureX.Domain.ValueObjects;

namespace InsureX.Domain.Services;

public interface IPremiumCalculationService
{
    Money CalculatePremium(Asset asset, string policyType, int coverageMonths);
}

public class PremiumCalculationService : IPremiumCalculationService
{
    public Money CalculatePremium(Asset asset, string policyType, int coverageMonths)
    {
        // Base rate by asset type
        var baseRate = asset.AssetType switch
        {
            "Vehicle" => 0.02m,      // 2% of value
            "Property" => 0.005m,    // 0.5% of value
            "Watercraft" => 0.03m,   // 3% of value
            "Aviation" => 0.05m,     // 5% of value
            "Machinery" => 0.025m,   // 2.5% of value
            _ => 0.01m               // 1% default
        };

        // Policy type multiplier
        var multiplier = policyType switch
        {
            "Comprehensive" => 1.5m,
            "ThirdParty" => 0.6m,
            "Basic" => 1.0m,
            _ => 1.0m
        };

        var monthlyPremium = asset.Value * baseRate * multiplier;
        var totalPremium = monthlyPremium * coverageMonths;

        return new Money(totalPremium);
    }
}
EOF

echo "✅ Domain service created"

# 7. Update Unit of Work to handle domain events
echo "📋 Step 7: Updating Unit of Work pattern..."

cat > InsureX.Domain/Interfaces/IUnitOfWork.cs << 'EOF'
namespace InsureX.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
EOF

cat > InsureX.Infrastructure/Data/UnitOfWork.cs << 'EOF'
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using MediatR;

namespace InsureX.Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private readonly IMediator _mediator;

    public UnitOfWork(ApplicationDbContext context, IMediator mediator)
    {
        _context = context;
        _mediator = mediator;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Dispatch domain events before saving
        await DispatchDomainEvents();
        
        return await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task DispatchDomainEvents()
    {
        var entitiesWithEvents = _context.ChangeTracker
            .Entries<BaseEntity>()
            .Where(e => e.Entity.DomainEvents.Any())
            .Select(e => e.Entity)
            .ToList();

        var domainEvents = entitiesWithEvents
            .SelectMany(e => e.DomainEvents)
            .ToList();

        entitiesWithEvents.ForEach(e => e.ClearDomainEvents());

        foreach (var domainEvent in domainEvents)
        {
            await _mediator.Publish(domainEvent);
        }
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
EOF

echo "✅ Unit of Work with domain event dispatch created"

echo ""
echo "🎉 PHASE 3 COMPLETE!"
echo "Next: Run ./fix-phase4-security.sh to add refresh tokens and security hardening"