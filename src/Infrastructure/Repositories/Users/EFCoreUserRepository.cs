using Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Users
{
    public class EFCoreUserRepository : IUserRepository
    {
        private readonly EndureanceCupDbContext dbContext;

        public EFCoreUserRepository(EndureanceCupDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public void Add(User user)
        {
            dbContext.Users.Add(user);
        }

        public async Task<bool> Exists(string userName, CancellationToken cancellationToken)
        {
            return await dbContext.Users.AnyAsync(x => x.UserName == userName || x.Email == userName, cancellationToken);
        }

        public async Task<bool> Exists(string userName, string email, CancellationToken cancellationToken)
        {
            return await dbContext.Users.AnyAsync(x => x.UserName == userName || x.UserName == email || x.Email == email || x.Email == userName, cancellationToken);
        }

        public async Task<bool> Exists(int userId, CancellationToken cancellationToken)
        {
            return await dbContext.Users.AnyAsync(x => x.Id == userId, cancellationToken);
        }

        public async Task<List<User>> GetAll(CancellationToken cancellationToken)
        {
            return await dbContext.Users.Where(x => true).ToListAsync();
        }

        public async Task<User> GetById(int id, CancellationToken cancellation)
        {
            return await dbContext.Users.FirstOrDefaultAsync(x => x.Id == id, cancellation);
        }

        public async Task<List<User>> GetByIds(int[] userIds, CancellationToken cancellationToken)
        {
            return await dbContext.Users.Where(x => userIds.Contains(x.Id)).ToListAsync();
        }

        public async Task<User> GetByUserName(string userName, CancellationToken cancellation)
        {
            return await dbContext.Users.FirstOrDefaultAsync(x => x.UserName == userName || x.Email == userName, cancellation);
        }

        public void Remove(User user)
        {
            dbContext.Remove(user);
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<User>> Search(string term, CancellationToken cancellationToken)
        {
            var users = await dbContext.Users
                .Where(x => EF.Functions.Like(x.FirstName, $"%{term}%") || EF.Functions.Like(x.LastName, $"%{term}%"))
                .ToListAsync(cancellationToken);

            return users;
        }
    }
}
