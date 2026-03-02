using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;

namespace InsureX.Application.Commands.Policy;

public record CreatePolicyCommand(
    string PolicyNumber,
    string PolicyType,
    decimal Premium,
    DateTime StartDate,
    DateTime EndDate,
    int TenantId,
    int? AssetId = null,
    int? PartnerId = null
) : ICommand<Policy>;
