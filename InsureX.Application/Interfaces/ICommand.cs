// This file is deprecated. Use MediatR.IRequest<T> directly instead.
// Keep this file as a reference but don't use it.

using MediatR;

namespace InsureX.Application.Interfaces
{
    // Use MediatR.IRequest<T> instead
    public interface ICommand<out TResponse> : IRequest<TResponse> { }
    
    // Use MediatR.IRequest instead
    public interface ICommand : IRequest { }
}
