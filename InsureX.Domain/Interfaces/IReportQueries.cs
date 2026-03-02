using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using InsureX.Shared.DTOs;

namespace InsureX.Domain.Interfaces;

public interface IReportQueries
{
    Task<IEnumerable<ComplianceDashboardDto>> GetComplianceDashboardAsync(
        DateTime startDate, 
        DateTime endDate);

    Task<byte[]> ExportComplianceReportAsync(
        DateTime startDate, 
        DateTime endDate,
        ExportFormat format);
}
