using Domain.Cup;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace Infrastructure.Repositories.Cups
{
    public class EFCoreCupRepository : ICupRepository
    {
        private readonly EndureanceCupDbContext dbContext;

        public EFCoreCupRepository(EndureanceCupDbContext endureanceCupDbContext)
        {
            this.dbContext = endureanceCupDbContext;
        }

        public void Add(Cup cup)
        {
            dbContext.Cups.Add(cup);
        }

        public async Task<bool> Exists(string title, CancellationToken cancellationToken)
        {
            return await dbContext.Cups.AnyAsync(x => x.Title == title, cancellationToken);
        }

        public async Task<List<Cup>> GetAllReferencedCups(int userId, CancellationToken cancellationToken)
        {
            return await dbContext.Cups
                .Include("_participants")
                .Where(x => x.OwnerUserId == userId || EF.Property<List<Participant>>(x, "_participants").Any(v => v.UserId == userId))
                .ToListAsync(cancellationToken);
        }

        public async Task<Cup> GetById(int id, CancellationToken cancellationToken)
        {
            return await dbContext.Cups
                .Include("_participants")
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public Task<Cup> GetByTitle(string title, CancellationToken cancellationToken)
        {
            return dbContext.Cups
                .Include("_participants")
                .FirstOrDefaultAsync(x => x.Title == title, cancellationToken);    
        }

        public void Remove(Cup cup)
        {
            dbContext.Cups.Remove(cup);
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
