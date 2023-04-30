using Domain.Events;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Repositories.Events.Configurations
{
    public class ResultConfiguration : IEntityTypeConfiguration<Result>
    {
        public void Configure(EntityTypeBuilder<Result> builder)
        {
            builder.Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Property(x => x.CreatedAt).IsRequired();
            builder.Property(x => x.UpdatedAt).IsRequired();
            builder.Property<byte[]>("RowVersion").IsRowVersion().IsRequired(); // this supercedes the 'Version' property

            builder.Property(x => x.ActivityId).IsRequired();
            builder.Property(x => x.ParticipantId).IsRequired();
            builder.Property(x => x.Score).IsRequired();

            builder.HasKey(x => x.Id).IsClustered(true);
            builder.HasIndex(x => new { x.ActivityId, x.ParticipantId }).IsClustered(false).IsUnique(false);
        }
    }
}