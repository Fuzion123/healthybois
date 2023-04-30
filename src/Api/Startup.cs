using Microsoft.EntityFrameworkCore;
using WebApi.Authorization;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using WebApi.Settings;
using Infrastructure.Repositories;
using Service.Users.Dependencies;
using WebApi.Middleware;
using Service.Users;
using Infrastructure;
using Serilog;
using Service.Events;

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

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(config => config.AddConsole());

            var appSettings = new AppSettings();

            configuration.Bind(appSettings);

            services.AddTransient(x => appSettings);

            services.AddDbContext<EndureanceCupDbContext>(options =>
            {
                options.UseSqlServer(appSettings.ConnectionStrings.Database, sql =>
                {
                    sql.MigrationsAssembly(appSettings.EntityFrameworkMigrationsProjectName);

                    sql.EnableRetryOnFailure(3);
                });
            });

            services.AddCors();
            services.AddControllers();

            // configure automapper with all automapper profiles from this assembly
            services.AddAutoMapper(typeof(Program));

            // configure strongly typed settings object
            services.Configure<AppSettings>(configuration.GetSection("AppSettings"));

            // configure DI for application services
            services.AddScoped<IJwtUtils, JwtUtils>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<EventService>();
            services.AddEFCoreRepositories();
            services.AddEFCoreConfigurations();
            services.AddHttpContextAccessor();

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
                app.UseCors(x => x
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());

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

                app.UseAuthorization();

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                });
            }
        }
    }
}
