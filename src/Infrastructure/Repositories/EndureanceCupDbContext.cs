namespace Infrastructure.Repositories;

using Domain.Events;
using Domain.Users;
using Infrastructure.Repositories.Events.Configurations;
using Infrastructure.Repositories.Users.Configurations;
using Microsoft.EntityFrameworkCore;

public class EndureanceCupDbContext : DbContext
{
    public EndureanceCupDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Participant> Participants { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new EventConfiguration());
        modelBuilder.ApplyConfiguration(new ParticipantConfiguration());
    }
}