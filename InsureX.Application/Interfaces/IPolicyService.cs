using InsureX.Application.DTOs.Policy;

namespace InsureX.Application.Interfaces;

public interface IPolicyService
{
    Task<List<PolicyDto>> GetAllPoliciesAsync(PolicySearchDto? search = null);
    Task<PolicyDto> GetPolicyByIdAsync(Guid id);
    Task<PolicyDto> CreatePolicyAsync(CreatePolicyDto createDto, Guid userId);
    Task<PolicyDto> UpdatePolicyAsync(UpdatePolicyDto updateDto);
    Task<bool> DeletePolicyAsync(Guid id);
    Task<bool> UpdatePolicyStatusAsync(Guid id, string status);
    Task<List<PolicyDto>> GetPoliciesExpiringAsync(int days);
}
