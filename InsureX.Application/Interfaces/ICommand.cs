using MediatR;

namespace InsureX.Application.Interfaces;

// Marker interfaces for CQRS
public interface ICommand<out TResponse> : IRequest<TResponse> { }
public interface ICommand : IRequest { }

public interface IQuery<out TResponse> : IRequest<TResponse> { }
