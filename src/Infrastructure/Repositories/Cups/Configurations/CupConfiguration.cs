using Domain.Cup;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Repositories.Cups.Configurations
{
    public class CupConfiguration : IEntityTypeConfiguration<Cup>
    {
        public void Configure(EntityTypeBuilder<Cup> builder)
        {
            builder.Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Property(x => x.CreatedAt).IsRequired();
            builder.Property(x => x.UpdatedAt).IsRequired();
            builder.Property<byte[]>("RowVersion").IsRowVersion().IsRequired(); // this supercedes the 'Version' property

            builder.Property(x => x.Title).HasMaxLength(255).IsRequired();
            builder.Property(x => x.OwnerUserId).HasMaxLength(255).IsRequired();

            builder.HasMany<Participant>("_participants").WithOne().HasForeignKey(x => x.CupId).OnDelete(DeleteBehavior.Cascade).IsRequired();
            builder.Ignore(x => x.Participants);

            builder.HasKey(x => x.Id).IsClustered(true);
            builder.HasIndex(x => x.Title).IsClustered(false).IsUnique();
            builder.HasIndex(x => x.OwnerUserId).IsClustered(false).IsUnique(false);
        }
    }
}