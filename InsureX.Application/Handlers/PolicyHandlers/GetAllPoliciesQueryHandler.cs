using InsureX.Application.DTOs.Policy;
using InsureX.Application.Queries.PolicyQueries;
using InsureX.Domain.Interfaces;
using MediatR;

namespace InsureX.Application.Handlers.PolicyHandlers;

public class GetAllPoliciesQueryHandler : IRequestHandler<GetAllPoliciesQuery, PaginatedList<PolicyDto>>
{
    private readonly IPolicyRepository _policyRepository;

    public GetAllPoliciesQueryHandler(IPolicyRepository policyRepository)
    {
        _policyRepository = policyRepository;
    }

    public async Task<PaginatedList<PolicyDto>> Handle(GetAllPoliciesQuery request, CancellationToken cancellationToken)
    {
        var policies = await _policyRepository.GetAllAsync();
        var totalCount = await _policyRepository.CountAsync();
        
        var items = policies.Select(p => new PolicyDto
        {
            Id = p.Id,
            PolicyNumber = p.PolicyNumber,
            PolicyType = p.PolicyType,
            Premium = p.Premium,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            Status = p.Status,
            TenantId = p.TenantId
        }).ToList();

        return new PaginatedList<PolicyDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}
