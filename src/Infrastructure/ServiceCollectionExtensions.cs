using Domain.Events;
using Domain.Users;
using Infrastructure.EmailService;
using Infrastructure.Repositories;
using Infrastructure.Repositories.Events;
using Infrastructure.Repositories.Events.Configurations;
using Infrastructure.Repositories.Users;
using Infrastructure.Repositories.Users.Configurations;
using Microsoft.Extensions.DependencyInjection;
using Service.Email;

namespace Infrastructure
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddEFCoreRepositories(this IServiceCollection services)
        {
            services.AddTransient<IUserRepository, EFCoreUserRepository>();
            services.AddTransient<IEventRepository, EFCoreEventRepository>();

            return services;
        }

        public static IServiceCollection AddEFCoreConfigurations(this IServiceCollection services)
        {
            services.AddScoped<UserConfiguration>();
            services.AddScoped<EventConfiguration>();

            return services;
        }

        public static IServiceCollection AddEndureanceCupDbContext(this IServiceCollection services)
        {
            services.AddScoped<EndureanceCupDbContext>();

            return services;
        }

        public static IServiceCollection AddAzureEmailService(this IServiceCollection services, AzureEmailSettings azureEmailSettings)
        {
            if (azureEmailSettings == null || string.IsNullOrEmpty(azureEmailSettings.AzureEmailAccount))
            {
                throw new ArgumentException($"'{nameof(azureEmailSettings.AzureEmailAccount)}' cannot be null or empty.", nameof(azureEmailSettings.AzureEmailAccount));
            }

            services.AddScoped(z => azureEmailSettings);
            services.AddScoped<IEmailService, AzureEmailService>();
            services.AddScoped<IRecoverCodeService, RecoverCodeService>();

            return services;
        }
    }
}
