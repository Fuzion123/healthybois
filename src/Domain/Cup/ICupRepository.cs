
namespace Domain.Cup
{
    public interface ICupRepository
    {
        public Task<Cup> GetById(int id, CancellationToken cancellationToken);
        public Task<Cup> GetByTitle(string title, CancellationToken cancellationToken);
        public Task<List<Cup>> GetAllReferencedCups(int userId, CancellationToken CancellationToken);
        public void Add(Cup cup);   
        public void Remove(Cup cup);
        public Task SaveChangesAsync(CancellationToken cancellationToken);
        public Task<bool> Exists(string title, CancellationToken cancellationToken);
    }
}
