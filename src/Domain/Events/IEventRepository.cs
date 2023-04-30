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
    }
}
