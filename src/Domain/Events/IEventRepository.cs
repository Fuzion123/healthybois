namespace Domain.Events
{
    public interface IEventRepository
    {
        public Task<Event> GetById(int id, CancellationToken cancellationToken);
        public Task<Event> GetByTitle(string title, CancellationToken cancellationToken);
        public Task<List<Event>> GetAllReferencedEvents(int userId, CancellationToken CancellationToken);
        public void Add(Event Event);
        public void Remove(Event Event);
        public Task SaveChangesAsync(CancellationToken cancellationToken);
        public Task<bool> Exists(string title, CancellationToken cancellationToken);
        public Task<Activity> GetActivityById(int eventId, int activityId, CancellationToken cancellationToken);
        public Task<List<Activity>> GetAllActivities(int eventId, CancellationToken cancellationToken);
        public Task<Participant> GetParticipantById(int eventId, int participantId, CancellationToken cancellationToken);
        public Task<List<Participant>> GetAllParticipants(int eventId, CancellationToken cancellationToken);
        public Task<Result> GetResultById(int eventId, int activityId, int resultId, CancellationToken cancellationToken);
        public Task<Result> GetResultByParticipantId(int eventId, int activityId, int participantId, CancellationToken cancellationToken);
        public Task<List<Result>> GetAllResults(int eventId, int activityId, CancellationToken cancellationToken);
    }
}
