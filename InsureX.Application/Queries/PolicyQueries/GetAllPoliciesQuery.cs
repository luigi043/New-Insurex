using InsureX.Application.DTOs.Policy;
using MediatR;

namespace InsureX.Application.Queries.PolicyQueries;

public record GetAllPoliciesQuery(int Page = 1, int PageSize = 10) : IRequest<PaginatedList<PolicyDto>>;
