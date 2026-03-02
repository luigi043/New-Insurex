using InsureX.Application.Commands.PolicyCommands;
using InsureX.Domain.Entities;
using InsureX.Domain.Interfaces;
using MediatR;

namespace InsureX.Application.Handlers.PolicyHandlers;

public class UpdatePolicyCommandHandler : IRequestHandler<UpdatePolicyCommand, Policy>
{
    private readonly IPolicyRepository _policyRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdatePolicyCommandHandler(
        IPolicyRepository policyRepository,
        IUnitOfWork unitOfWork)
    {
        _policyRepository = policyRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Policy> Handle(UpdatePolicyCommand request, CancellationToken cancellationToken)
    {
        var policy = await _policyRepository.GetByIdAsync(request.Id);
        if (policy == null)
            throw new Exception($"Policy {request.Id} not found");

        // Update logic here
        await _policyRepository.UpdateAsync(policy);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return policy;
    }
}
