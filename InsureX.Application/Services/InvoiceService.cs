// InsureX.Application/Services/InvoiceService.cs
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Application.Exceptions;

namespace InsureX.Application.Services;

public class InvoiceService : IInvoiceService
{
    private readonly IInvoiceRepository _invoiceRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IUnitOfWork _unitOfWork;

    public InvoiceService(
        IInvoiceRepository invoiceRepository,
        IPaymentRepository paymentRepository,
        ITenantContext tenantContext,
        IUnitOfWork unitOfWork)
    {
        _invoiceRepository = invoiceRepository;
        _paymentRepository = paymentRepository;
        _tenantContext = tenantContext;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<Invoice>> GetAllAsync()
    {
        return await _invoiceRepository.GetAllByTenantAsync(_tenantContext.TenantId);
    }

    public async Task<Invoice?> GetByIdAsync(int id)
    {
        var invoice = await _invoiceRepository.GetByIdWithPaymentsAsync(id);
        return invoice?.TenantId == _tenantContext.TenantId ? invoice : null;
    }

    public async Task<Invoice> CreateAsync(Invoice invoice)
    {
        invoice.TenantId = _tenantContext.TenantId;
        invoice.InvoiceNumber = await GenerateInvoiceNumberAsync();
        invoice.Status = InvoiceStatus.DRAFT;
        invoice.IssueDate = DateTime.UtcNow;

        if (invoice.DueDate <= invoice.IssueDate)
            throw new ValidationException("Due date must be after issue date");

        await _invoiceRepository.AddAsync(invoice);
        await _unitOfWork.SaveChangesAsync();
        
        return invoice;
    }

    public async Task<Payment> RecordPaymentAsync(int invoiceId, Payment payment)
    {
        var invoice = await GetByIdAsync(invoiceId);
        if (invoice == null)
            throw new NotFoundException($"Invoice {invoiceId} not found");

        if (invoice.Status == InvoiceStatus.PAID || invoice.Status == InvoiceStatus.CANCELLED)
            throw new ValidationException("Cannot record payment for paid or cancelled invoice");

        payment.InvoiceId = invoiceId;
        await _paymentRepository.AddAsync(payment);

        // Update invoice status
        var totalPaid = invoice.Payments.Sum(p => p.Amount) + payment.Amount;
        
        if (totalPaid >= invoice.TotalAmount)
        {
            invoice.Status = InvoiceStatus.PAID;
            invoice.PaidDate = DateTime.UtcNow;
        }
        else if (totalPaid > 0)
        {
            invoice.Status = InvoiceStatus.PARTIAL;
        }

        await _invoiceRepository.UpdateAsync(invoice);
        await _unitOfWork.SaveChangesAsync();
        
        return payment;
    }

    private async Task<string> GenerateInvoiceNumberAsync()
    {
        var count = await _invoiceRepository.CountAsync() + 1;
        return $"INV-{DateTime.UtcNow:yyyyMMdd}-{count:D4}";
    }
}