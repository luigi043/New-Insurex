using InsureX.Application.DTOs.Policy;
using InsureX.Application.Interfaces;

namespace InsureX.Application.Queries.Policy;

public record GetPolicyByIdQuery(int Id) : IQuery<PolicyDto?>;
