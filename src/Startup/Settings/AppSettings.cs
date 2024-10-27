using Infrastructure.EmailService;

namespace Startup.Settings;

public class AppSettings
{
    public string Secret { get; set; }
    public string EntityFrameworkMigrationsProjectName { get; set; }
    public ConnectionStrings ConnectionStrings { get; set; }
    public AzureEmailSettings AzureEmailSettings { get; set; }
    public bool UsingCachedRepositories { get; set; } = true;
}