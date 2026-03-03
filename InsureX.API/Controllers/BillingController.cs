// InsureX.API/Controllers/BillingController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InsureX.Application.DTOs;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BillingController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;

    public BillingController(IInvoiceService invoiceService)
    {
        _invoiceService = invoiceService;
    }

    [HttpGet("invoices")]
    public async Task<IActionResult> GetInvoices([FromQuery] PaginationRequest? request)
        => Ok(await _invoiceService.GetAllAsync(request ?? new PaginationRequest()));

    [HttpGet("invoices/{id:int}")]
    public async Task<IActionResult> GetInvoice(int id)
    {
        var invoice = await _invoiceService.GetByIdAsync(id);
        return invoice == null ? NotFound() : Ok(invoice);
    }

    [HttpPost("invoices")]
    [Authorize(Roles = "Admin,Billing")]
    public async Task<IActionResult> CreateInvoice([FromBody] Invoice invoice)
    {
        var created = await _invoiceService.CreateAsync(invoice);
        return CreatedAtAction(nameof(GetInvoice), new { id = created.Id }, created);
    }

    [HttpPost("invoices/{id:int}/payments")]
    public async Task<IActionResult> RecordPayment(int id, [FromBody] RecordBillingPaymentRequest request)
    {
        var recorded = await _invoiceService.RecordPaymentAsync(id, request.Amount, request.Method, request.Reference);
        return Ok(recorded);
    }
}

public class RecordBillingPaymentRequest
{
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public string? Reference { get; set; }
}