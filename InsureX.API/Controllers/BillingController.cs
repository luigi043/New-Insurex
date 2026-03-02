// InsureX.API/Controllers/BillingController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;

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
    public async Task<IActionResult> GetInvoices() => Ok(await _invoiceService.GetAllAsync());

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
    public async Task<IActionResult> RecordPayment(int id, [FromBody] Payment payment)
    {
        var recorded = await _invoiceService.RecordPaymentAsync(id, payment);
        return Ok(recorded);
    }
}