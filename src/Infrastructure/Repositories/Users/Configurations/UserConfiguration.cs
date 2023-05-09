
using Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Repositories.Users.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Property(x => x.CreatedAt).IsRequired();
            builder.Property(x => x.UpdatedAt).IsRequired();
            builder.Property<byte[]>("RowVersion").IsRowVersion().IsRequired(); // this supercedes the 'Version' property

            builder.Property(x => x.FirstName).HasMaxLength(255).IsRequired();
            builder.Property(x => x.LastName).HasMaxLength(255).IsRequired();
            builder.Property(x => x.UserName).HasMaxLength(255).IsRequired();
            builder.Property(x => x.PasswordHash).HasMaxLength(255).IsRequired();
            //builder.Property(x => x.ProfilePicture).HasMaxLength(255).IsRequired(false);

            builder.HasKey(x => x.Id).IsClustered(true);
            builder.HasIndex(x => x.UserName).IsClustered(false).IsUnique();
        }
    }
}