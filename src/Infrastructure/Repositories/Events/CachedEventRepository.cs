using Domain.Events;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Repositories.Events
{
    public class CachedEventRepository : IEventRepository
    {
        private readonly IEventRepository repository;
        private readonly IMemoryCache memoryCache;
        private readonly MemoryCacheEntryOptions cacheEntryOptions;
        private readonly HashSet<string> cacheKeys;

        public CachedEventRepository(IEventRepository repository, IMemoryCache memoryCache, HashSet<string> cacheKeys)
        {
            this.repository = repository;
            this.memoryCache = memoryCache;
            this.cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromSeconds(100))
                .SetAbsoluteExpiration(TimeSpan.FromSeconds(200));
            this.cacheKeys = cacheKeys;
        }
        public void Add(Event Event)
        {
            repository.Add(Event);
        }

        public async Task<bool> Exists(string title, CancellationToken cancellationToken)
        {
            var key = $"Exists-{title}";

            if (memoryCache.TryGetValue(key, out bool exist))
                return exist;

            exist = await repository.Exists(title, cancellationToken);

            memoryCache.Set(key, exist, cacheEntryOptions);
            
            if(!cacheKeys.Contains(key))
                cacheKeys.Add(key);

            return exist;
        }

        public async Task<List<Event>> GetAllReferencedEvents(int userId, CancellationToken CancellationToken)
        {
            var key = $"GetAllReferencedEvents-{userId}";

            if (memoryCache.TryGetValue(key, out List<Event> @events))
                return @events;

            @events = await repository.GetAllReferencedEvents(userId, CancellationToken);

            memoryCache.Set(key, @events, cacheEntryOptions);

            if (!cacheKeys.Contains(key))
                cacheKeys.Add(key);

            return @events;
        }

        public async Task<Event> GetById(int id, CancellationToken cancellationToken)
        {
            var key = $"GetByIdKey-{id}";

            if (memoryCache.TryGetValue(key, out Event @event))
                return @event;

            @event = await repository.GetById(id, cancellationToken);

            memoryCache.Set(key, @event, cacheEntryOptions);

            if (!cacheKeys.Contains(key))
                cacheKeys.Add(key);

            return @event;
        }


        public async Task<Event> GetByTitle(string title, CancellationToken cancellationToken)
        {
            var key = $"GetByTitle-{title}";

            if (memoryCache.TryGetValue(key, out Event @event))
                return @event;

            @event = await repository.GetByTitle(title, cancellationToken);

            memoryCache.Set(key, @event, cacheEntryOptions);

            if (!cacheKeys.Contains(key))
                cacheKeys.Add(key);

            return @event;
        }

        public void Remove(Event Event)
        {
            repository.Remove(Event);
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await repository.SaveChangesAsync(cancellationToken);

            foreach (var key in cacheKeys)
            {
                memoryCache.Remove(key);
            }

            cacheKeys.Clear();
        }
    }
}