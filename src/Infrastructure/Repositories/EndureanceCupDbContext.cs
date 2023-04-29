namespace Infrastructure.Repositories;

using Domain.Users;
using Infrastructure.Repositories.Users.Configurations;
using Microsoft.EntityFrameworkCore;

public class EndureanceCupDbContext : DbContext
{
    public EndureanceCupDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UserConfiguration());
    }
}