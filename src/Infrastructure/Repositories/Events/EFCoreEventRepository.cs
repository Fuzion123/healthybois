using Domain.Events;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace Infrastructure.Repositories.Events
{
    public class EFCoreEventRepository : IEventRepository
    {
        private readonly EndureanceCupDbContext dbContext;

        public EFCoreEventRepository(EndureanceCupDbContext endureanceEventDbContext)
        {
            this.dbContext = endureanceEventDbContext;
        }

        public void Add(Event Event)
        {
            dbContext.Events.Add(Event);
        }

        public async Task<bool> Exists(string title, CancellationToken cancellationToken)
        {
            return await dbContext.Events.AnyAsync(x => x.Title == title, cancellationToken);
        }

        public async Task<List<Event>> GetAllReferencedEvents(int userId, CancellationToken cancellationToken)
        {
            return await dbContext.Events
                .Include("_participants")
                .Where(x => x.OwnerUserId == userId || EF.Property<List<Participant>>(x, "_participants").Any(v => v.UserId == userId))
                .ToListAsync(cancellationToken);
        }

        public async Task<Event> GetById(int id, CancellationToken cancellationToken)
        {
            return await dbContext.Events
                .Include("_participants")
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public Task<Event> GetByTitle(string title, CancellationToken cancellationToken)
        {
            return dbContext.Events
                .Include("_participants")
                .FirstOrDefaultAsync(x => x.Title == title, cancellationToken);    
        }

        public void Remove(Event Event)
        {
            dbContext.Events.Remove(Event);
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
