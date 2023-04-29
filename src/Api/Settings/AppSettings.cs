namespace WebApi.Settings;

public class AppSettings
{
    public string Secret { get; set; }
    public string EntityFrameworkMigrationsProjectName { get; set; }
    public ConnectionStrings ConnectionStrings { get; set; }
}