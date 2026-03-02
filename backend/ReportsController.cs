using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InsureX.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsureX.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        // GET api/reports/overview?period=month
        [HttpGet("overview")]
        public async Task<IActionResult> Overview([FromQuery] string period = "month")
        {
            var (from, to) = GetDateRange(period);
            var result = await _reportService.GetOverviewAsync(from, to);
            return Ok(result);
        }

        // GET api/reports/export/policies?period=month
        [HttpGet("export/policies")]
        public async Task<IActionResult> ExportPolicies([FromQuery] string period = "month")
        {
            var (from, to) = GetDateRange(period);
            var rows = await _reportService.GetPoliciesForExportAsync(from, to);
            return CsvResult(rows, $"policies_{period}_{DateTime.UtcNow:yyyyMMdd}.csv");
        }

        // GET api/reports/export/claims?period=month
        [HttpGet("export/claims")]
        public async Task<IActionResult> ExportClaims([FromQuery] string period = "month")
        {
            var (from, to) = GetDateRange(period);
            var rows = await _reportService.GetClaimsForExportAsync(from, to);
            return CsvResult(rows, $"claims_{period}_{DateTime.UtcNow:yyyyMMdd}.csv");
        }

        // GET api/reports/export/assets
        [HttpGet("export/assets")]
        public async Task<IActionResult> ExportAssets()
        {
            var rows = await _reportService.GetAssetsForExportAsync();
            return CsvResult(rows, $"assets_{DateTime.UtcNow:yyyyMMdd}.csv");
        }

        // ── Helpers ───────────────────────────────────────────────────────────

        private static (DateTime from, DateTime to) GetDateRange(string period)
        {
            var to = DateTime.UtcNow;
            var from = period switch
            {
                "week" => to.AddDays(-7),
                "quarter" => to.AddMonths(-3),
                "year" => to.AddYears(-1),
                _ => to.AddMonths(-1), // "month" default
            };
            return (from, to);
        }

        private FileContentResult CsvResult(IEnumerable<IEnumerable<string>> rows, string fileName)
        {
            var sb = new StringBuilder();
            foreach (var row in rows)
            {
                sb.AppendLine(string.Join(",", row.Select(cell =>
                    $"\"{cell?.Replace("\"", "\"\"")}\"")));
            }
            var bytes = Encoding.UTF8.GetPreamble()
                .Concat(Encoding.UTF8.GetBytes(sb.ToString()))
                .ToArray();
            return File(bytes, "text/csv", fileName);
        }
    }
}
