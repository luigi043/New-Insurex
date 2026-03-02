using InsureX.Application.Commands.Policy;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using MediatR;

namespace InsureX.Application.Handlers.Policy;

public class CreatePolicyCommandHandler : IRequestHandler<CreatePolicyCommand, Policy>
{
    private readonly IPolicyRepository _policyRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreatePolicyCommandHandler(
        IPolicyRepository policyRepository,
        IUnitOfWork unitOfWork)
    {
        _policyRepository = policyRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Policy> Handle(CreatePolicyCommand request, CancellationToken cancellationToken)
    {
        var policy = Policy.Create(
            request.PolicyNumber,
            request.PolicyType,
            request.Premium,
            request.StartDate,
            request.EndDate,
            request.TenantId,
            request.AssetId,
            request.PartnerId);

        await _policyRepository.AddAsync(policy, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return policy;
    }
}
