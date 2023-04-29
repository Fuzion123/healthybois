using Domain.Cup;
using Domain.Users;
using Infrastructure.Repositories.Cups;
using Infrastructure.Repositories.Cups.Configurations;
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
            services.AddTransient<ICupRepository, EFCoreCupRepository>();

            return services;
        }

        public static IServiceCollection AddEFCoreConfigurations(this IServiceCollection services)
        {
            services.AddScoped<UserConfiguration>();
            services.AddScoped<CupConfiguration>();

            return services;
        }
    }
}
