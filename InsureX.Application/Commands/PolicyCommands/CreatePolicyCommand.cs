using InsureX.Domain.Entities;
using MediatR;

namespace InsureX.Application.Commands.PolicyCommands;

public record CreatePolicyCommand(
    string PolicyNumber,
    string PolicyType,
    decimal Premium,
    DateTime StartDate,
    DateTime EndDate,
    int TenantId,
    int? AssetId = null,
    int? PartnerId = null
) : IRequest<Policy>;
