using InsureX.Application.DTOs;
using InsureX.Application.Exceptions;
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace InsureX.Application.Services;

public class PartnerService : IPartnerService
{
    private readonly IPartnerRepository _partnerRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<PartnerService> _logger;

    public PartnerService(
        IPartnerRepository partnerRepository,
        ITenantContext tenantContext,
        IUnitOfWork unitOfWork,
        ILogger<PartnerService> logger)
    {
        _partnerRepository = partnerRepository;
        _tenantContext = tenantContext;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<PagedResult<Partner>> GetAllAsync(PaginationRequest request)
    {
        var query = _partnerRepository.QueryByTenant(_tenantContext.TenantId);
        
        // Apply search
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            query = query.Where(p => 
                p.Name.Contains(request.SearchTerm) ||
                (p.TradingName != null && p.TradingName.Contains(request.SearchTerm)) ||
                (p.Email != null && p.Email.Contains(request.SearchTerm)));
        }
        
        // Apply sorting
        query = ApplySorting(query, request.SortBy, request.SortDescending);
        
        var totalCount = await Task.FromResult(query.Count());
        var items = query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();
        
        return new PagedResult<Partner>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public async Task<Partner?> GetByIdAsync(int id)
    {
        var partner = await _partnerRepository.GetByIdAsync(id);
        if (partner == null || partner.TenantId != _tenantContext.TenantId)
            return null;
        return partner;
    }

    public async Task<IEnumerable<Partner>> GetByTypeAsync(PartnerType type)
    {
        return await _partnerRepository.GetByTypeAndTenantAsync(type, _tenantContext.TenantId);
    }

    public async Task<IEnumerable<Partner>> GetByStatusAsync(PartnerStatus status)
    {
        return await _partnerRepository.GetByStatusAsync(status);
    }

    public async Task<PagedResult<Partner>> FilterAsync(PartnerFilterRequest request)
    {
        var query = _partnerRepository.QueryByTenant(_tenantContext.TenantId);
        
        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.Type) && Enum.TryParse<PartnerType>(request.Type, out var partnerType))
            query = query.Where(p => p.Type == partnerType);
        
        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<PartnerStatus>(request.Status, out var partnerStatus))
            query = query.Where(p => p.Status == partnerStatus);
        
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            query = query.Where(p => 
                p.Name.Contains(request.SearchTerm) ||
                (p.TradingName != null && p.TradingName.Contains(request.SearchTerm)) ||
                (p.Email != null && p.Email.Contains(request.SearchTerm)) ||
                (p.ContactPersonName != null && p.ContactPersonName.Contains(request.SearchTerm)));
        }
        
        // Apply sorting
        query = ApplySorting(query, request.SortBy, request.SortDescending);
        
        var totalCount = await Task.FromResult(query.Count());
        var items = query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();
        
        return new PagedResult<Partner>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public async Task<Partner> CreateAsync(Partner partner)
    {
        // Validation
        if (string.IsNullOrWhiteSpace(partner.Name))
            throw new ValidationException("Partner name is required");

        if (!string.IsNullOrWhiteSpace(partner.Email))
        {
            var existing = await _partnerRepository.GetByEmailAsync(partner.Email);
            if (existing != null)
                throw new ValidationException("Partner with this email already exists");
        }

        partner.TenantId = _tenantContext.TenantId;
        partner.Status = PartnerStatus.Active;
        partner.SetCreated("system");

        await _partnerRepository.AddAsync(partner);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Partner {PartnerName} created", partner.Name);

        return partner;
    }

    public async Task<Partner> UpdateAsync(Partner partner)
    {
        var existingPartner = await GetByIdAsync(partner.Id);
        if (existingPartner == null)
            throw new NotFoundException("Partner not found");

        // Validation
        if (string.IsNullOrWhiteSpace(partner.Name))
            throw new ValidationException("Partner name is required");

        // Check for duplicate email
        if (!string.IsNullOrWhiteSpace(partner.Email) && partner.Email != existingPartner.Email)
        {
            var existing = await _partnerRepository.GetByEmailAsync(partner.Email);
            if (existing != null)
                throw new ValidationException("Partner with this email already exists");
        }

        existingPartner.Name = partner.Name;
        existingPartner.TradingName = partner.TradingName;
        existingPartner.Type = partner.Type;
        existingPartner.RegistrationNumber = partner.RegistrationNumber;
        existingPartner.TaxId = partner.TaxId;
        existingPartner.Email = partner.Email;
        existingPartner.Phone = partner.Phone;
        existingPartner.Mobile = partner.Mobile;
        existingPartner.Fax = partner.Fax;
        existingPartner.Website = partner.Website;
        existingPartner.Address = partner.Address;
        existingPartner.City = partner.City;
        existingPartner.State = partner.State;
        existingPartner.PostalCode = partner.PostalCode;
        existingPartner.Country = partner.Country;
        existingPartner.ContactPersonName = partner.ContactPersonName;
        existingPartner.ContactPersonEmail = partner.ContactPersonEmail;
        existingPartner.ContactPersonPhone = partner.ContactPersonPhone;
        existingPartner.ContactPersonTitle = partner.ContactPersonTitle;
        existingPartner.BankName = partner.BankName;
        existingPartner.BankAccountNumber = partner.BankAccountNumber;
        existingPartner.BankBranchCode = partner.BankBranchCode;
        existingPartner.SwiftCode = partner.SwiftCode;
        existingPartner.IBAN = partner.IBAN;
        existingPartner.CommissionRate = partner.CommissionRate;
        existingPartner.Notes = partner.Notes;
        existingPartner.Documents = partner.Documents;
        existingPartner.ContractStartDate = partner.ContractStartDate;
        existingPartner.ContractEndDate = partner.ContractEndDate;
        existingPartner.SetUpdated("system");

        await _partnerRepository.UpdateAsync(existingPartner);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Partner {PartnerName} updated", existingPartner.Name);

        return existingPartner;
    }

    public async Task DeleteAsync(int id)
    {
        var partner = await GetByIdAsync(id);
        if (partner == null)
            throw new NotFoundException("Partner not found");

        await _partnerRepository.DeleteAsync(partner);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Partner {PartnerName} deleted", partner.Name);
    }

    public async Task<Partner> ActivateAsync(int partnerId)
    {
        var partner = await GetByIdAsync(partnerId);
        if (partner == null)
            throw new NotFoundException("Partner not found");

        partner.Status = PartnerStatus.Active;
        partner.SetUpdated("system");

        await _partnerRepository.UpdateAsync(partner);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Partner {PartnerName} activated", partner.Name);

        return partner;
    }

    public async Task<Partner> DeactivateAsync(int partnerId)
    {
        var partner = await GetByIdAsync(partnerId);
        if (partner == null)
            throw new NotFoundException("Partner not found");

        partner.Status = PartnerStatus.Inactive;
        partner.SetUpdated("system");

        await _partnerRepository.UpdateAsync(partner);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Partner {PartnerName} deactivated", partner.Name);

        return partner;
    }

    public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
    {
        return await _partnerRepository.EmailExistsAsync(email, excludeId);
    }

    private IQueryable<Partner> ApplySorting(IQueryable<Partner> query, string? sortBy, bool descending)
    {
        return sortBy?.ToLower() switch
        {
            "name" => descending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
            "type" => descending ? query.OrderByDescending(p => p.Type) : query.OrderBy(p => p.Type),
            "status" => descending ? query.OrderByDescending(p => p.Status) : query.OrderBy(p => p.Status),
            "email" => descending ? query.OrderByDescending(p => p.Email) : query.OrderBy(p => p.Email),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };
    }
}
