using Domain.Cup;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Repositories.Cups.Configurations
{
    public class ParticipantConfiguration : IEntityTypeConfiguration<Participant>
    {
        public void Configure(EntityTypeBuilder<Participant> builder)
        {
            builder.Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Property(x => x.CreatedAt).IsRequired();
            builder.Property(x => x.UpdatedAt).IsRequired();
            builder.Property<byte[]>("RowVersion").IsRowVersion().IsRequired(); // this supercedes the 'Version' property

            builder.Property(x => x.UserId).HasMaxLength(255).IsRequired();

            builder.HasKey(x => x.Id).IsClustered(true);
            builder.HasIndex(x => x.UserId).IsClustered(false).IsUnique();
        }
    }
}