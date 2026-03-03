using InsureX.Application.DTOs.Filters;
using InsureX.Application.DTOs;
using InsureX.Domain.Entities;
using InsureX.Domain.Enums;

namespace InsureX.Application.Interfaces;

public interface IPartnerService
{
    Task<PagedResult<Partner>> GetAllAsync(PaginationRequest request);
    Task<Partner?> GetByIdAsync(int id);
    Task<IEnumerable<Partner>> GetByTypeAsync(PartnerType type);
    Task<IEnumerable<Partner>> GetByStatusAsync(PartnerStatus status);
    Task<PagedResult<Partner>> FilterAsync(PartnerFilterRequest request);
    Task<Partner> CreateAsync(Partner partner);
    Task<Partner> UpdateAsync(Partner partner);
    Task DeleteAsync(int id);
    Task<Partner> ActivateAsync(int partnerId);
    Task<Partner> DeactivateAsync(int partnerId);
    Task<bool> EmailExistsAsync(string email, int? excludeId = null);
}

