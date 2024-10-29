using Domain.Events;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Repositories.Events.Configurations
{
    public class ActivityConfiguration : IEntityTypeConfiguration<Activity>
    {
        public void Configure(EntityTypeBuilder<Activity> builder)
        {
            builder.Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Property(x => x.CreatedAt).IsRequired();
            builder.Property(x => x.UpdatedAt).IsRequired();
            builder.Property(x => x.CompletedOn).IsRequired(false);

            builder.Property(x => x.Title).HasMaxLength(255).IsRequired();
            builder.Property(x => x.OwnerUserId).IsRequired();
            builder.Property(x => x.EventId).IsRequired();

            builder.HasMany<Result>("_results").WithOne().HasForeignKey(x => x.ActivityId).OnDelete(DeleteBehavior.Cascade).IsRequired();
            builder.Ignore(x => x.Results);

            builder.HasKey(x => x.Id).IsClustered(true);
            builder.HasIndex("EventId", "Id").IsClustered(false).IsUnique();
            builder.HasIndex(x => x.OwnerUserId).IsClustered(false).IsUnique(false);
        }
    }
}