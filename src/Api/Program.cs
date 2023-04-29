using Serilog;
using Serilog.Events;

namespace WebApi
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .CreateLogger();

            try
            {
                CreateHostBuilder(args).Build().Run();
            }
#pragma warning disable CA1031 // Do not catch general exception types
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly");
            }
#pragma warning restore CA1031 // Do not catch general exception types
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureAppConfiguration((context, builder) => AppConfiguration(context, builder, args));

                    webBuilder.UseSerilog((host, loggerConfig) =>
                    {
                        loggerConfig.ReadFrom.Configuration(host.Configuration);
                    });

                    webBuilder.UseStartup<Startup>();
                });

        /// <summary>
        /// 
        /// </summary>
        /// <param name="hostingContext"></param>
        /// <param name="configBuilder"></param>
        /// <param name="args"></param>
        public static void AppConfiguration(WebHostBuilderContext hostingContext, IConfigurationBuilder configBuilder, string[] args)
        {
            var env = hostingContext.HostingEnvironment;

            configBuilder
                .AddEnvironmentVariables();

            configBuilder
                .AddJsonFile("appsettings.json", optional: false)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: false);

            if (args.Any())
                configBuilder.AddCommandLine(args);
        }
    }
}
