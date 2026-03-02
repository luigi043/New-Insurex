using InsureX.Application.DTOs.Policy;
using MediatR;

namespace InsureX.Application.Queries.Policy;

public record GetPolicyByIdQuery(int Id) : IRequest<PolicyDto?>;
