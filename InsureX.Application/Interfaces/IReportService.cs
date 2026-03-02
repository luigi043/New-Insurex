namespace InsureX.Application.Interfaces;

public interface IReportService
{
    Task<object> GetOverviewAsync(DateTime from, DateTime to);
    Task<IEnumerable<IEnumerable<string>>> GetPoliciesForExportAsync(DateTime from, DateTime to);
    Task<IEnumerable<IEnumerable<string>>> GetClaimsForExportAsync(DateTime from, DateTime to);
    Task<IEnumerable<IEnumerable<string>>> GetAssetsForExportAsync();
}
