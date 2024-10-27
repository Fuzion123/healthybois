using Infrastructure;
using Infrastructure.JobStorage;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Service;
using Service.Activities;
using Service.Events;
using Service.Events.Mappers;
using Service.Participants;
using Service.Results;
using Service.Users;
using Service.Users.Dependencies;
using Startup.Authorization;
using Startup.Settings;
using WebApi.Authorization;
using WebApi.Middleware;
using WebApi.SignalR;

namespace WebApi
{
    public class Startup
    {
        private readonly IConfiguration configuration;
        private readonly IWebHostEnvironment webHostEnvironment;

        public Startup(IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            this.configuration = configuration;
            this.webHostEnvironment = webHostEnvironment;
        }

        // This method gets called by the runtime. Use this method to add services to the container!
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(config => config.AddConsole());

            var appSettings = new AppSettings();

            configuration.Bind(appSettings);

            services.AddSingleton(x => appSettings);

            services.AddDbContext<EndureanceCupDbContext>(options =>
            {
                options.UseSqlServer(appSettings.ConnectionStrings.Database, sql =>
                {
                    sql.MigrationsAssembly(appSettings.EntityFrameworkMigrationsProjectName);

                    sql.EnableRetryOnFailure(3);
                });
            });


            services.AddBlobJobStorage(appSettings.ConnectionStrings.AzureStorageAccount);

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder
                        .WithOrigins("https://happy-field-0e3c42103.3.azurestaticapps.net")
                        .WithOrigins("http://localhost:3000")
                        //.WithOrigins("http://localhost:4280")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();

                    //if (webHostEnvironment.IsProduction())
                    //{
                    //    builder.WithOrigins("https://happy-field-0e3c42103.3.azurestaticapps.net")
                    //        .AllowAnyHeader()
                    //        .AllowAnyMethod()
                    //        .AllowCredentials();
                    //}
                    //else
                    //{
                    //    builder.WithOrigins("http://localhost:3000")
                    //        .AllowAnyHeader()
                    //        .AllowAnyMethod()
                    //        .AllowCredentials();
                    //}
                });
            });

            services.AddControllers();

            // configure automapper with all automapper profiles from this assembly
            services.AddAutoMapper(typeof(Program));

            // configure strongly typed settings object
            services.AddSingleton(appSettings);

            // configure DI for application services
            services.AddScoped<IJwtUtils, JwtUtils>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<EventService>();
            services.AddEFCoreRepositories();
            services.AddEFCoreConfigurations();
            services.AddHttpContextAccessor();
            services.AddEndureanceCupDbContext();
            services.AddAzureEmailService(appSettings.AzureEmailSettings);
            services.AddTransient<PictureService>();
            services.AddTransient<EventMapper>();
            services.AddTransient<ActivityMapper>();
            services.AddTransient<ParticipantMapper>();
            services.AddTransient<ResultMapper>();
            services.AddSignalR();


            // caching
            //if (appSettings.UsingCachedRepositories)
            //{
            //    services.AddMemoryCache();
            //    services.AddSingleton<HashSet<string>>();
            //    services.Decorate<IEventRepository, CachedEventRepository>();
            //}

            // swagger
            services.AddSwaggerGen(setup =>
            {
                // Include 'SecurityScheme' to use JWT Authentication
                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    BearerFormat = "JWT",
                    Name = "JWT Authentication",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",

                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };

                setup.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

                setup.AddSecurityRequirement(new OpenApiSecurityRequirement { { jwtSecurityScheme, Array.Empty<string>() } });

            });

            services.ConfigureSwaggerGen(o =>
            {
                o.CustomSchemaIds(s => s.FullName);
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var dataContext = scope.ServiceProvider.GetRequiredService<EndureanceCupDbContext>();

                dataContext.Database.Migrate();
            }

            // configure HTTP request pipeline
            {
                // global cors policy

                //app.UseHttpsRedirection();
                //app.UseStaticFiles();

                app.UseSwagger();

                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Products integration app");
                });

                // global error handler
                app.UseMiddleware<ErrorHandlerMiddleware>();

                // custom jwt auth middleware
                app.UseMiddleware<JwtMiddleware>();

                app.UseRouting();

                app.UseCors();

                app.UseAuthorization();

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                    endpoints.MapHub<ChatHub>("/chat");
                });
            }
        }
    }
}
