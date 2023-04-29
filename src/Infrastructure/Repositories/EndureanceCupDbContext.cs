namespace Infrastructure.Repositories;

using Domain.Cup;
using Domain.Users;
using Infrastructure.Repositories.Cups.Configurations;
using Infrastructure.Repositories.Users.Configurations;
using Microsoft.EntityFrameworkCore;

public class EndureanceCupDbContext : DbContext
{
    public EndureanceCupDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Cup> Cups { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new CupConfiguration());
    }
}