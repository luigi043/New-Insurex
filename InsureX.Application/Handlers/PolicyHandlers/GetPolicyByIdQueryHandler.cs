using InsureX.Application.DTOs.Policy;
using InsureX.Application.Queries.PolicyQueries;
using InsureX.Domain.Interfaces;
using MediatR;

namespace InsureX.Application.Handlers.PolicyHandlers;

public class GetPolicyByIdQueryHandler : IRequestHandler<GetPolicyByIdQuery, PolicyDto?>
{
    private readonly IPolicyRepository _policyRepository;

    public GetPolicyByIdQueryHandler(IPolicyRepository policyRepository)
    {
        _policyRepository = policyRepository;
    }

    public async Task<PolicyDto?> Handle(GetPolicyByIdQuery request, CancellationToken cancellationToken)
    {
        var policy = await _policyRepository.GetByIdAsync(request.Id);
        
        if (policy == null) return null;

        return new PolicyDto
        {
            Id = policy.Id,
            PolicyNumber = policy.PolicyNumber,
            PolicyType = policy.PolicyType,
            Premium = policy.Premium,
            StartDate = policy.StartDate,
            EndDate = policy.EndDate,
            Status = policy.Status,
            TenantId = policy.TenantId
        };
    }
}

