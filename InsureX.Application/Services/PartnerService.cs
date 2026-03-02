using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Domain.Interfaces;

namespace InsureX.Application.Services;

public class PartnerService : IPartnerService
{
    private readonly IPartnerRepository _partnerRepository;
    private readonly ITenantContext _tenantContext;

    public PartnerService(IPartnerRepository partnerRepository, ITenantContext tenantContext)
    {
        _partnerRepository = partnerRepository;
        _tenantContext = tenantContext;
    }

    public async Task<Partner?> GetByIdAsync(Guid id)
    {
        return await _partnerRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Partner>> GetAllAsync()
    {
        return await _partnerRepository.GetAllAsync();
    }

    public async Task<IEnumerable<Partner>> GetByTypeAsync(PartnerType type)
    {
        return await _partnerRepository.GetByTypeAsync(type);
    }

    public async Task<Partner> CreateAsync(Partner partner)
    {
        partner.TenantId = _tenantContext.CurrentTenantId;partner.TenantId = _tenantContext.CurrentTenantId;
        partner.CreatedAt = DateTime.UtcNow;
        return await _partnerRepository.AddAsync(partner);
    }

    public async Task<Partner> UpdateAsync(Partner partner)
    {
        partner.UpdatedAt = DateTime.UtcNow;
        return await _partnerRepository.UpdateAsync(partner);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _partnerRepository.DeleteAsync(id);
    }
}
// InsureX.Application/Services/PartnerService.cs
using InsureX.Application.Interfaces;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;
using InsureX.Application.Exceptions;

namespace InsureX.Application.Services;

public class PartnerService : IPartnerService
{
    private readonly IPartnerRepository _partnerRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IUnitOfWork _unitOfWork;

    public PartnerService(
        IPartnerRepository partnerRepository,
        ITenantContext tenantContext,
        IUnitOfWork unitOfWork)
    {
        _partnerRepository = partnerRepository;
        _tenantContext = tenantContext;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<Partner>> GetAllAsync()
    {
        return await _partnerRepository.GetAllByTenantAsync(_tenantContext.TenantId);
    }

    public async Task<Partner?> GetByIdAsync(Guid id)
    {
        var partner = await _partnerRepository.GetByIdAsync(id);
        return partner?.TenantId == _tenantContext.TenantId ? partner : null;
    }

    public async Task<IEnumerable<Partner>> GetByTypeAsync(PartnerType type)
    {
        return await _partnerRepository.GetByTypeAndTenantAsync(type, _tenantContext.TenantId);
    }

    public async Task<Partner> CreateAsync(Partner partner)
    {
        // CRITICAL FIX: Set tenant ID before saving
        partner.TenantId = _tenantContext.TenantId;
        partner.CreatedAt = DateTime.UtcNow;
        partner.IsActive = true;

        // Validation
        if (string.IsNullOrWhiteSpace(partner.Name))
            throw new ValidationException("Partner name is required");
        
        if (string.IsNullOrWhiteSpace(partner.Email))
            throw new ValidationException("Partner email is required");

        await _partnerRepository.AddAsync(partner);
        await _unitOfWork.SaveChangesAsync();
        
        return partner;
    }

    public async Task<Partner> UpdateAsync(Partner partner)
    {
        var existing = await GetByIdAsync(partner.Id);
        if (existing == null)
            throw new NotFoundException($"Partner {partner.Id} not found");

        existing.Name = partner.Name;
        existing.Email = partner.Email;
        existing.Phone = partner.Phone;
        existing.Address = partner.Address;
        existing.Type = partner.Type;
        existing.CommissionRate = partner.CommissionRate;
        existing.IsActive = partner.IsActive;
        existing.UpdatedAt = DateTime.UtcNow;

        await _partnerRepository.UpdateAsync(existing);
        await _unitOfWork.SaveChangesAsync();
        
        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var partner = await GetByIdAsync(id);
        if (partner == null)
            throw new NotFoundException($"Partner {id} not found");

        await _partnerRepository.DeleteAsync(partner);
        await _unitOfWork.SaveChangesAsync();
        
        return true;
    }
}