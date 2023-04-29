﻿using Domain.Users;
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
            return await dbContext.Users.AnyAsync(x => x.UserName == userName, cancellationToken);
        }

        public async Task<List<User>> GetAll(CancellationToken cancellationToken)
        {
            return await dbContext.Users.Where(x => true).ToListAsync();
        }

        public async Task<User> GetById(int id, CancellationToken cancellation)
        {
            return await dbContext.Users.FirstOrDefaultAsync(x => x.Id == id, cancellation);
        }

        public async Task<User> GetByUserName(string userName, CancellationToken cancellation)
        {
            return await dbContext.Users.FirstOrDefaultAsync(x => x.UserName == userName, cancellation);    
        }

        public void Remove(User user)
        {
            dbContext.Remove(user);
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
