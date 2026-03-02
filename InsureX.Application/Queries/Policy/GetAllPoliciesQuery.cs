using InsureX.Application.DTOs.Policy;
using InsureX.Application.Interfaces;

namespace InsureX.Application.Queries.Policy;

public record GetAllPoliciesQuery(
    int Page = 1,
    int PageSize = 10,
    string? SearchTerm = null,
    string? Status = null,
    int? TenantId = null
) : IQuery<PaginatedList<PolicyDto>>;
