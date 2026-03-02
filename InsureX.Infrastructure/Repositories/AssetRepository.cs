   using InsureX.Domain.Entities;
   using InsureX.Domain.Interfaces;
   using InsureX.Infrastructure.Data;
   using Microsoft.EntityFrameworkCore;

   namespace InsureX.Infrastructure.Repositories
   {
       public class AssetRepository : IAssetRepository
       {
           private readonly ApplicationDbContext _context;

           public AssetRepository(ApplicationDbContext context)
           {
               _context = context;
           }

           public async Task<Asset?> GetByIdAsync(Guid id)
               => await _context.Assets.FindAsync(id);

           public async Task<IEnumerable<Asset>> GetAllAsync()
               => await _context.Assets.ToListAsync();

           public async Task<IEnumerable<Asset>> GetByPolicyIdAsync(Guid policyId)
               => await _context.Assets.Where(a => a.PolicyId == policyId).ToListAsync();

           public async Task<IEnumerable<Asset>> GetByTypeAsync(AssetType type)
               => await _context.Assets.Where(a => a.Type == type).ToListAsync();

           public async Task<IEnumerable<Asset>> GetByStatusAsync(AssetStatus status)
               => await _context.Assets.Where(a =>