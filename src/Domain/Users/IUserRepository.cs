
namespace Domain.Users
{
    public interface IUserRepository
    {
        public Task<User> GetById(int id, CancellationToken cancellation);
        public Task<User> GetByUserName(string userName, CancellationToken cancellation);
        public Task<List<User>> GetAll(CancellationToken cancellationToken);
        public Task<bool> Exists(string userName, string email, CancellationToken cancellationToken);
        public Task<bool> Exists(string userName, CancellationToken cancellationToken);
        public Task<bool> Exists(int userId, CancellationToken cancellationToken);
        public void Add(User user);
        public void Remove(User user);
        public Task SaveChangesAsync(CancellationToken cancellationToken);
    }
}
