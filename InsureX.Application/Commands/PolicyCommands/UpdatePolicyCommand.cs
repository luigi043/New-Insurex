using InsureX.Domain.Entities;
using MediatR;

namespace InsureX.Application.Commands.PolicyCommands;

public record UpdatePolicyCommand(
    int Id,
    string PolicyNumber,
    string PolicyType,
    decimal Premium,
    DateTime StartDate,
    DateTime EndDate,
    string Status,
    int? AssetId = null,
    int? PartnerId = null
) : IRequest<Policy>;
