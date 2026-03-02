using FluentValidation;
using InsureX.Application.Commands.Policy;

namespace InsureX.Application.Validators.Policy;

public class CreatePolicyCommandValidator : AbstractValidator<CreatePolicyCommand>
{
    public CreatePolicyCommandValidator()
    {
        RuleFor(x => x.PolicyNumber)
            .NotEmpty().WithMessage("Policy number is required")
            .MaximumLength(50);

        RuleFor(x => x.PolicyType)
            .NotEmpty();

        RuleFor(x => x.Premium)
            .GreaterThan(0);

        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate);

        RuleFor(x => x.TenantId)
            .GreaterThan(0);
    }
}
