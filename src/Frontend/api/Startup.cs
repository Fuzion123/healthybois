using Infrastructure;
using Infrastructure.JobStorage;
using Infrastructure.Repositories;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Service;
using Service.Events;
using Service.Events.Mappers;
using Service.Users;
using Service.Users.Dependencies;
using Startup.Authorization;
using Startup.Settings;

[assembly: FunctionsStartup(typeof(api.Startup))]

namespace api
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var context = builder.GetContext();

            builder.Services.AddLogging();

            builder.Services.AddSingleton<MyDependency>();

            var appSettings = new AppSettings()
            {
                ConnectionStrings = new ConnectionStrings()
                {
                    AzureStorageAccount = context.Configuration["ConnectionStrings:AzureStorageAccount"],
                    Database = context.Configuration["ConnectionStrings:Database"]
                },
                Secret = context.Configuration["Authentication:Secret"]
            };

            builder.Services.AddTransient(x => appSettings);

            builder.Services.AddDbContext<EndureanceCupDbContext>(options =>
            {
                options.UseSqlServer(appSettings.ConnectionStrings.Database, sql =>
                {
                    sql.MigrationsAssembly(appSettings.EntityFrameworkMigrationsProjectName);

                    sql.EnableRetryOnFailure(3);
                });
            });

            builder.Services.AddBlobJobStorage(appSettings.ConnectionStrings.AzureStorageAccount);


            // configure strongly typed settings object
            builder.Services.AddSingleton(appSettings);

            // configure DI for application services
            builder.Services.AddScoped<IJwtUtils, JwtUtils>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<EventService>();
            builder.Services.AddEFCoreRepositories();
            builder.Services.AddEFCoreConfigurations();
            builder.Services.AddEndureanceCupDbContext();
            builder.Services.AddTransient<PictureService>();
            builder.Services.AddTransient<EventMapper>();
        }
    }


    public class MyDependency
    {
        public MyClass GetMyClass()
        {
            return new MyClass();
        }
    }

    public class MyClass
    {
        public string Name => "Frederik!";

    }
}