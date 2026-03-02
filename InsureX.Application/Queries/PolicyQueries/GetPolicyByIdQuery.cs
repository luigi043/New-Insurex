using InsureX.Application.DTOs.Policy;
using MediatR;

namespace InsureX.Application.Queries.PolicyQueries;

public record GetPolicyByIdQuery(int Id) : IRequest<PolicyDto?>;
