using InsureX.Domain.Entities; using InsureX.Domain.Enums;
namespace InsureX.Application.Interfaces;
public interface IClaimService {
    Task<Claim?> GetByIdAsync(int id); Task<IEnumerable<Claim>> GetAllAsync();
    Task<IEnumerable<Claim>> GetByPolicyIdAsync(int policyId); Task<IEnumerable<Claim>> GetByStatusAsync(ClaimStatus status);
    Task<Claim> CreateAsync(Claim claim); Task<Claim> UpdateAsync(Claim claim); Task<bool> DeleteAsync(int id);
    Task<Claim> ApproveAsync(int id, string? notes = null); Task<Claim> RejectAsync(int id, string reason);
    Task<Claim> SubmitAsync(int policyId, decimal amount, string description, DateTime incidentDate);
}

public interface IClaimService {
    Task<Claim?> GetByIdAsync(int id);
    Task<IEnumerable<Claim>> GetAllAsync();
    Task<IEnumerable<Claim>> GetByPolicyIdAsync(int policyId);
    Task<IEnumerable<Claim>> GetByStatusAsync(ClaimStatus status);
    Task<Claim> CreateAsync(Claim claim);
    Task UpdateAsync(Claim claim);
    Task DeleteAsync(int id);
    Task ApproveAsync(int id, string? notes);
    Task RejectAsync(int id, string reason);
    Task SubmitAsync(int policyId, decimal amount, string description, DateTime dateOfLoss);
}