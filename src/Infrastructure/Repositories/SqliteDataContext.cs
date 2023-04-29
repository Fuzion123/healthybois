namespace Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;

public class SqliteDataContext : EndureanceCupDbContext
{

    public SqliteDataContext(DbContextOptions options) : base(options)
    {
    }
}