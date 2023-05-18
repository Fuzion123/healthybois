using Domain.Events;
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;

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

        public async Task<Activity> GetActivityById(int eventId, int activityId, CancellationToken cancellationToken)
        {
            return await dbContext.Activities
                .Include("_results")
                .FirstOrDefaultAsync(x => x.EventId == eventId && x.Id == activityId, cancellationToken)
                .ConfigureAwait(false);
        }

        public async Task<List<Activity>> GetAllActivities(int eventId, CancellationToken cancellationToken)
        {
            return await dbContext.Activities
                .Include("_results")
                .Where(x => x.EventId == eventId)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);
        }

        public async Task<List<Participant>> GetAllParticipants(int eventId, CancellationToken cancellationToken)
        {
            return await dbContext.Participants
                .Where(x => x.EventId == eventId)
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);
        }

        public async Task<List<Event>> GetAllReferencedEvents(int userId, CancellationToken cancellationToken)
        {
            return await dbContext.Events
                .Include("_participants")
                .Include("_activities")
                .Include("_activities._results")
                .Where(x => x.OwnerUserId == userId || EF.Property<List<Participant>>(x, "_participants").Any(v => v.UserId == userId))
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Result>> GetAllResults(int eventId, int activityId, CancellationToken cancellationToken)
        {
            return await dbContext.Activities
                .Include("_results")
                .Where(x => x.EventId == eventId && x.Id == activityId)
                .SelectMany(x => EF.Property<List<Result>>(x, "_results"))
                .ToListAsync(cancellationToken)
                .ConfigureAwait(false);
        }

        public async Task<Event> GetById(int id, CancellationToken cancellationToken)
        {
            return await dbContext.Events
                .Include("_participants")
                .Include("_activities")
                .Include("_activities._results")
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public Task<Event> GetByTitle(string title, CancellationToken cancellationToken)
        {
            return dbContext.Events
                .Include("_participants")
                .Include("_activities")
                .Include("_activities._results")
                .FirstOrDefaultAsync(x => x.Title == title, cancellationToken);    
        }

        public async Task<Participant> GetParticipantById(int eventId, int participantId, CancellationToken cancellationToken)
        {
            return await dbContext.Participants
                .FirstOrDefaultAsync(x => x.EventId == eventId && x.Id == participantId, cancellationToken)
                .ConfigureAwait(false);
        }

        public async Task<Result> GetResultById(int eventId, int activityId, int resultId, CancellationToken cancellationToken)
        {
            return await dbContext.Activities
                .Include("_results")
                .Where(x => x.EventId == eventId && x.Id == activityId)
                .SelectMany(x => EF.Property<List<Result>>(x, "_results"))
                .FirstOrDefaultAsync(x => x.Id == resultId, cancellationToken)
                .ConfigureAwait(false);
        }

        public async Task<Result> GetResultByParticipantId(int eventId, int activityId, int participantId, CancellationToken cancellationToken)
        {
            return await dbContext.Activities
                .Include("_results")
                .Where(x => x.EventId == eventId && x.Id == activityId)
                .SelectMany(x => EF.Property<List<Result>>(x, "_results"))
                .FirstOrDefaultAsync(x => x.ParticipantId == participantId, cancellationToken)
                .ConfigureAwait(false);
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
