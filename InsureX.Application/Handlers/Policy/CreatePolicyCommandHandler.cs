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
        var policy = new Policy
        {
            PolicyNumber = request.PolicyNumber,
            PolicyType = request.PolicyType,
            Premium = request.Premium,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            TenantId = request.TenantId,
            AssetId = request.AssetId,
            PartnerId = request.PartnerId,
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };

        await _policyRepository.AddAsync(policy, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return policy;
    }
}
