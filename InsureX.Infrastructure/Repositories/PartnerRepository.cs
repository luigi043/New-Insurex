using InsureX.Domain.Entities; using InsureX.Domain.Interfaces; using InsureX.Infrastructure.Data; using Microsoft.EntityFrameworkCore;
namespace InsureX.Infrastructure.Repositories;
public class PartnerRepository : IPartnerRepository {
    private readonly ApplicationDbContext _context;
    public PartnerRepository(ApplicationDbContext context) => _context = context;
    public async Task<Partner?> GetByIdAsync(int id) => await _context.Partners.FindAsync(id);
    public async Task<Partner?> GetByEmailAsync(string email) => await _context.Partners.FirstOrDefaultAsync(p => p.Email == email);
    public async Task<IEnumerable<Partner>> GetAllAsync() => await _context.Partners.ToListAsync();
    public async Task<IEnumerable<Partner>> GetByTypeAsync(string partnerType) => await _context.Partners.Where(p => p.PartnerType == partnerType).ToListAsync();
    public async Task AddAsync(Partner partner) => await _context.Partners.AddAsync(partner);
    public Task UpdateAsync(Partner partner) { _context.Partners.Update(partner); return Task.CompletedTask; }
    public async Task DeleteAsync(int id) { var p = await _context.Partners.FindAsync(id); if (p != null) _context.Partners.Remove(p); }
}
