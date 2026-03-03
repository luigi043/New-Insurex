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

    public async Task<IEnumerable<Partner>> GetAllAsync()
    {
        return await _partnerRepository.GetAllByTenantAsync(_tenantContext.TenantId);
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
}
