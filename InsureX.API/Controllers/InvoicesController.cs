using InsureX.Application.DTOs;
using InsureX.Application.DTOs.Filters;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;
    private readonly ILogger<InvoicesController> _logger;

    public InvoicesController(IInvoiceService invoiceService, ILogger<InvoicesController> logger)
    {
        _invoiceService = invoiceService;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Insurer,Accountant,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<Invoice>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] PaginationRequest request)
    {
        var invoices = await _invoiceService.GetAllAsync(request);
        return Ok(ApiResponse<PagedResult<Invoice>>.SuccessResponse(invoices));
    }

    [HttpGet("filter")]
    [Authorize(Roles = "Admin,Insurer,Accountant,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<Invoice>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Filter([FromQuery] InvoiceFilterRequest request)
    {
        var invoices = await _invoiceService.FilterAsync(request);
        return Ok(ApiResponse<PagedResult<Invoice>>.SuccessResponse(invoices));
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,Insurer,Accountant,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<Invoice>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var invoice = await _invoiceService.GetByIdAsync(id);
        if (invoice == null)
            return NotFound(ApiResponse.ErrorResponse("Invoice not found"));
        
        return Ok(ApiResponse<Invoice>.SuccessResponse(invoice));
    }

    [HttpGet("number/{invoiceNumber}")]
    [Authorize(Roles = "Admin,Insurer,Accountant,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<Invoice>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByInvoiceNumber(string invoiceNumber)
    {
        var invoice = await _invoiceService.GetByInvoiceNumberAsync(invoiceNumber);
        if (invoice == null)
            return NotFound(ApiResponse.ErrorResponse("Invoice not found"));
        
        return Ok(ApiResponse<Invoice>.SuccessResponse(invoice));
    }

    [HttpGet("status/{status}")]
    [Authorize(Roles = "Admin,Insurer,Accountant,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Invoice>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByStatus(InvoiceStatus status)
    {
        var invoices = await _invoiceService.GetByStatusAsync(status);
        return Ok(ApiResponse<IEnumerable<Invoice>>.SuccessResponse(invoices));
    }

    [HttpGet("policy/{policyId:int}")]
    [Authorize(Roles = "Admin,Insurer,Accountant,Viewer")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<Invoice>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByPolicy(int policyId, [FromQuery] PaginationRequest request)
    {
        var invoices = await _invoiceService.GetByPolicyIdAsync(policyId, request);
        return Ok(ApiResponse<PagedResult<Invoice>>.SuccessResponse(invoices));
    }

    [HttpGet("overdue")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<Invoice>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOverdue([FromQuery] PaginationRequest request)
    {
        var invoices = await _invoiceService.GetOverdueInvoicesAsync(request);
        return Ok(ApiResponse<PagedResult<Invoice>>.SuccessResponse(invoices));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<Invoice>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] Invoice invoice)
    {
        var created = await _invoiceService.CreateAsync(invoice);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, 
            ApiResponse<Invoice>.SuccessResponse(created, "Invoice created successfully"));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<Invoice>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] Invoice invoice)
    {
        invoice.Id = id;
        var updated = await _invoiceService.UpdateAsync(invoice);
        return Ok(ApiResponse<Invoice>.SuccessResponse(updated, "Invoice updated successfully"));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        await _invoiceService.DeleteAsync(id);
        return Ok(ApiResponse.SuccessResponse("Invoice deleted successfully"));
    }

    [HttpPost("{id:int}/send")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<Invoice>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> MarkAsSent(int id, [FromBody] SendInvoiceRequest request)
    {
        var invoice = await _invoiceService.MarkAsSentAsync(id, request.SentToEmail);
        return Ok(ApiResponse<Invoice>.SuccessResponse(invoice, "Invoice marked as sent successfully"));
    }

    [HttpPost("{id:int}/payment")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<Invoice>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RecordPayment(int id, [FromBody] RecordPaymentRequest request)
    {
        var invoice = await _invoiceService.RecordPaymentAsync(id, request.Amount, request.Method, request.Reference);
        return Ok(ApiResponse<Invoice>.SuccessResponse(invoice, "Payment recorded successfully"));
    }

    [HttpPost("{id:int}/cancel")]
    [Authorize(Roles = "Admin,Insurer")]
    [ProducesResponseType(typeof(ApiResponse<Invoice>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Cancel(int id, [FromBody] CancelInvoiceRequest request)
    {
        var invoice = await _invoiceService.CancelAsync(id, request.Reason);
        return Ok(ApiResponse<Invoice>.SuccessResponse(invoice, "Invoice cancelled successfully"));
    }

    [HttpGet("summary/totals")]
    [Authorize(Roles = "Admin,Insurer,Accountant")]
    [ProducesResponseType(typeof(ApiResponse<InvoiceTotalsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTotals()
    {
        var outstanding = await _invoiceService.GetTotalOutstandingAsync();
        var paid = await _invoiceService.GetTotalPaidAsync();
        
        return Ok(ApiResponse<InvoiceTotalsDto>.SuccessResponse(new InvoiceTotalsDto
        {
            TotalOutstanding = outstanding,
            TotalPaid = paid
        }));
    }
}

public class SendInvoiceRequest
{
    public string SentToEmail { get; set; } = string.Empty;
}

public class RecordPaymentRequest
{
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public string? Reference { get; set; }
}

public class CancelInvoiceRequest
{
    public string Reason { get; set; } = string.Empty;
}

public class InvoiceTotalsDto
{
    public decimal TotalOutstanding { get; set; }
    public decimal TotalPaid { get; set; }
}
