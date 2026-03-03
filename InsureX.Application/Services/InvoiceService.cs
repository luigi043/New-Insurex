using InsureX.Application.DTOs.Filters;
using InsureX.Application.DTOs;
using InsureX.Application.Exceptions;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace InsureX.Application.Services;

public class InvoiceService : IInvoiceService
{
    private readonly IInvoiceRepository _invoiceRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<InvoiceService> _logger;

    public InvoiceService(
        IInvoiceRepository invoiceRepository,
        ITenantContext tenantContext,
        IUnitOfWork unitOfWork,
        ILogger<InvoiceService> logger)
    {
        _invoiceRepository = invoiceRepository;
        _tenantContext = tenantContext;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PagedResult<Invoice>> GetAllAsync(PaginationRequest request)
    {
        var query = _invoiceRepository.QueryByTenant(_tenantContext.TenantId);
        
        // Apply search
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            query = query.Where(i => 
                i.InvoiceNumber.Contains(request.SearchTerm) ||
                (i.Description != null && i.Description.Contains(request.SearchTerm)));
        }
        
        // Apply sorting
        query = ApplySorting(query, request.SortBy, request.SortDescending);
        
        var totalCount = await Task.FromResult(query.Count());
        var items = query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();
        
        return new PagedResult<Invoice>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public async Task<Invoice?> GetByIdAsync(int id)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(id);
        if (invoice == null || invoice.TenantId != _tenantContext.TenantId)
            return null;
        return invoice;
    }

    public async Task<Invoice?> GetByInvoiceNumberAsync(string invoiceNumber)
    {
        var invoice = await _invoiceRepository.GetByInvoiceNumberAsync(invoiceNumber);
        if (invoice == null || invoice.TenantId != _tenantContext.TenantId)
            return null;
        return invoice;
    }

    public async Task<IEnumerable<Invoice>> GetByStatusAsync(InvoiceStatus status)
    {
        return await _invoiceRepository.GetByStatusAndTenantAsync(status, _tenantContext.TenantId);
    }

    public async Task<PagedResult<Invoice>> GetByPolicyIdAsync(int policyId, PaginationRequest request)
    {
        var query = _invoiceRepository.QueryByTenant(_tenantContext.TenantId)
            .Where(i => i.PolicyId == policyId);
        
        var totalCount = await Task.FromResult(query.Count());
        var items = query
            .OrderByDescending(i => i.IssueDate)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();
        
        return new PagedResult<Invoice>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public async Task<PagedResult<Invoice>> GetOverdueInvoicesAsync(PaginationRequest request)
    {
        var now = DateTime.UtcNow;
        var query = _invoiceRepository.QueryByTenant(_tenantContext.TenantId)
            .Where(i => i.Status != InvoiceStatus.Paid && 
                       i.Status != InvoiceStatus.Cancelled &&
                       i.DueDate < now);
        
        var totalCount = await Task.FromResult(query.Count());
        var items = query
            .OrderBy(i => i.DueDate)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();
        
        return new PagedResult<Invoice>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public async Task<PagedResult<Invoice>> FilterAsync(InvoiceFilterRequest request)
    {
        var query = _invoiceRepository.QueryByTenant(_tenantContext.TenantId);
        
        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<InvoiceStatus>(request.Status, out var status))
            query = query.Where(i => i.Status == status);
        
        if (request.PolicyId.HasValue)
            query = query.Where(i => i.PolicyId == request.PolicyId.Value);
        
        if (request.PartnerId.HasValue)
            query = query.Where(i => i.PartnerId == request.PartnerId.Value);
        
        if (request.IsOverdue.HasValue && request.IsOverdue.Value)
        {
            var now = DateTime.UtcNow;
            query = query.Where(i => i.Status != InvoiceStatus.Paid && 
                                    i.Status != InvoiceStatus.Cancelled &&
                                    i.DueDate < now);
        }
        
        if (request.FromDueDate.HasValue)
            query = query.Where(i => i.DueDate >= request.FromDueDate.Value);
        
        if (request.ToDueDate.HasValue)
            query = query.Where(i => i.DueDate <= request.ToDueDate.Value);
        
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            query = query.Where(i => 
                i.InvoiceNumber.Contains(request.SearchTerm) ||
                (i.Description != null && i.Description.Contains(request.SearchTerm)));
        }
        
        // Apply sorting
        query = ApplySorting(query, request.SortBy, request.SortDescending);
        
        var totalCount = await Task.FromResult(query.Count());
        var items = query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();
        
        return new PagedResult<Invoice>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public async Task<Invoice> CreateAsync(Invoice invoice)
    {
        // Validation
        if (string.IsNullOrWhiteSpace(invoice.InvoiceNumber))
            throw new ValidationException("Invoice number is required");

        if (invoice.Amount <= 0)
            throw new ValidationException("Invoice amount must be greater than zero");

        if (invoice.DueDate <= DateTime.UtcNow)
            throw new ValidationException("Due date must be in the future");

        // Check for duplicate invoice number
        var existing = await _invoiceRepository.GetByInvoiceNumberAsync(invoice.InvoiceNumber);
        if (existing != null)
            throw new ValidationException("Invoice with this number already exists");

        invoice.TenantId = _tenantContext.TenantId;
        invoice.Status = InvoiceStatus.Draft;
        invoice.IssueDate = DateTime.UtcNow;
        invoice.PaidAmount = 0;
        invoice.SetCreated("system");

        await _invoiceRepository.AddAsync(invoice);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Invoice {InvoiceNumber} created", invoice.InvoiceNumber);

        return invoice;
    }

    public async Task<Invoice> UpdateAsync(Invoice invoice)
    {
        var existingInvoice = await GetByIdAsync(invoice.Id);
        if (existingInvoice == null)
            throw new NotFoundException("Invoice not found");

        if (existingInvoice.Status == InvoiceStatus.Paid)
            throw new ValidationException("Cannot update a paid invoice");

        if (existingInvoice.Status == InvoiceStatus.Cancelled)
            throw new ValidationException("Cannot update a cancelled invoice");

        existingInvoice.Amount = invoice.Amount;
        existingInvoice.TaxAmount = invoice.TaxAmount;
        existingInvoice.DueDate = invoice.DueDate;
        existingInvoice.Description = invoice.Description;
        existingInvoice.Notes = invoice.Notes;
        existingInvoice.InternalNotes = invoice.InternalNotes;
        existingInvoice.SetUpdated("system");

        await _invoiceRepository.UpdateAsync(existingInvoice);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Invoice {InvoiceNumber} updated", existingInvoice.InvoiceNumber);

        return existingInvoice;
    }

    public async Task DeleteAsync(int id)
    {
        var invoice = await GetByIdAsync(id);
        if (invoice == null)
            throw new NotFoundException("Invoice not found");

        if (invoice.Status != InvoiceStatus.Draft)
            throw new ValidationException("Can only delete invoices in Draft status");

        await _invoiceRepository.DeleteAsync(invoice);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Invoice {InvoiceNumber} deleted", invoice.InvoiceNumber);
    }

    public async Task<Invoice> MarkAsSentAsync(int invoiceId, string sentToEmail)
    {
        var invoice = await GetByIdAsync(invoiceId);
        if (invoice == null)
            throw new NotFoundException("Invoice not found");

        if (invoice.Status != InvoiceStatus.Draft)
            throw new ValidationException("Can only mark draft invoices as sent");

        invoice.MarkAsSent(sentToEmail);
        invoice.SetUpdated("system");

        await _invoiceRepository.UpdateAsync(invoice);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Invoice {InvoiceNumber} marked as sent to {Email}", 
            invoice.InvoiceNumber, sentToEmail);

        return invoice;
    }

    public async Task<Invoice> RecordPaymentAsync(int invoiceId, decimal amount, PaymentMethod method, string? reference = null)
    {
        var invoice = await GetByIdAsync(invoiceId);
        if (invoice == null)
            throw new NotFoundException("Invoice not found");

        if (invoice.Status == InvoiceStatus.Paid)
            throw new ValidationException("Invoice is already fully paid");

        if (invoice.Status == InvoiceStatus.Cancelled)
            throw new ValidationException("Cannot record payment for cancelled invoice");

        if (amount <= 0)
            throw new ValidationException("Payment amount must be greater than zero");

        if (amount > invoice.Balance)
            throw new ValidationException("Payment amount cannot exceed invoice balance");

        // Create payment record
        var payment = new Payment
        {
            InvoiceId = invoiceId,
            Amount = amount,
            PaymentMethod = method,
            PaymentDate = DateTime.UtcNow,
            TransactionId = reference,
            TenantId = _tenantContext.TenantId,
            PaymentReference = await GeneratePaymentReferenceAsync()
        };
        payment.SetCreated("system");

        invoice.RecordPayment(amount);
        invoice.SetUpdated("system");

        await _invoiceRepository.UpdateAsync(invoice);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Payment of {Amount:C} recorded for invoice {InvoiceNumber}", 
            amount, invoice.InvoiceNumber);

        return invoice;
    }

    public async Task<Invoice> CancelAsync(int invoiceId, string reason)
    {
        var invoice = await GetByIdAsync(invoiceId);
        if (invoice == null)
            throw new NotFoundException("Invoice not found");

        if (invoice.Status == InvoiceStatus.Paid)
            throw new ValidationException("Cannot cancel a paid invoice");

        if (invoice.Status == InvoiceStatus.Cancelled)
            throw new ValidationException("Invoice is already cancelled");

        invoice.Status = InvoiceStatus.Cancelled;
        invoice.InternalNotes = $"Cancelled: {reason}";
        invoice.SetUpdated("system");

        await _invoiceRepository.UpdateAsync(invoice);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Invoice {InvoiceNumber} cancelled. Reason: {Reason}", 
            invoice.InvoiceNumber, reason);

        return invoice;
    }

    public async Task<decimal> GetTotalOutstandingAsync()
    {
        return await _invoiceRepository.GetTotalOutstandingAsync(_tenantContext.TenantId);
    }

    public async Task<decimal> GetTotalPaidAsync()
    {
        return await _invoiceRepository.GetTotalPaidAsync(_tenantContext.TenantId);
    }

    private async Task<string> GeneratePaymentReferenceAsync()
    {
        var year = DateTime.UtcNow.Year;
        var timestamp = DateTime.UtcNow.Ticks;
        return $"PAY-{year}-{timestamp % 1000000:D6}";
    }

    private IQueryable<Invoice> ApplySorting(IQueryable<Invoice> query, string? sortBy, bool descending)
    {
        return sortBy?.ToLower() switch
        {
            "invoicenumber" => descending ? query.OrderByDescending(i => i.InvoiceNumber) : query.OrderBy(i => i.InvoiceNumber),
            "status" => descending ? query.OrderByDescending(i => i.Status) : query.OrderBy(i => i.Status),
            "amount" => descending ? query.OrderByDescending(i => i.Amount) : query.OrderBy(i => i.Amount),
            "duedate" => descending ? query.OrderByDescending(i => i.DueDate) : query.OrderBy(i => i.DueDate),
            "issuedate" => descending ? query.OrderByDescending(i => i.IssueDate) : query.OrderBy(i => i.IssueDate),
            _ => query.OrderByDescending(i => i.CreatedAt)
        };
    }
}


