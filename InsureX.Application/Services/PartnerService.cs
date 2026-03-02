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
        partner.TenantId = _tenantContext.CurrentTenantId;
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
