using Domain.Users;
using Infrastructure.Repositories.Users;
using Infrastructure.Repositories.Users.Configurations;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddEFCoreRepositories(this IServiceCollection services)
        {
            services.AddTransient<IUserRepository, EFCoreUserRepository>();

            return services;
        }

        public static IServiceCollection AddEFCoreConfigurations(this IServiceCollection services)
        {
            services.AddScoped<UserConfiguration>();

            return services;
        }
    }
}
