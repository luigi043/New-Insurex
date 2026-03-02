using MediatR;
using InsureX.Application.Interfaces;

namespace InsureX.API.Features.Reports.GenerateReport;

public record GenerateReportQuery(string Period = "month") : IRequest<object>;

public class GenerateReportHandler : IRequestHandler<GenerateReportQuery, object>
{
    private readonly IReportService _reportService;

    public GenerateReportHandler(IReportService reportService)
    {
        _reportService = reportService;
    }

    public async Task<object> Handle(GenerateReportQuery request, CancellationToken cancellationToken)
    {
        var to = DateTime.UtcNow;
        var from = request.Period switch
        {
            "week" => to.AddDays(-7),
            "quarter" => to.AddMonths(-3),
            "year" => to.AddYears(-1),
            _ => to.AddMonths(-1)
        };
        return await _reportService.GetOverviewAsync(from, to);
    }
}
