using InsureX.Application.Commands.PolicyCommands;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using MediatR;

namespace InsureX.Application.Handlers.PolicyHandlers;

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
        var policy = new Policy
        {
            PolicyNumber = request.PolicyNumber,
            Type = Enum.Parse<PolicyType>(request.PolicyType),
            PremiumAmount = request.Premium,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            TenantId = request.TenantId,
            Status = PolicyStatus.Draft
        };

        await _policyRepository.AddAsync(policy);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return policy;
    }
}

