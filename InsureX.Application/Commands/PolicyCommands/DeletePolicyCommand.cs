using MediatR;

namespace InsureX.Application.Commands.PolicyCommands;

public record DeletePolicyCommand(int Id) : IRequest<bool>;
