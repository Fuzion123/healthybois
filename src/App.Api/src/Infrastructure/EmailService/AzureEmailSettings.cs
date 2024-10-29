
namespace Infrastructure.EmailService
{
    public class AzureEmailSettings
    {
        public string AzureEmailAccount { get; set; }
        public string ResetPasswordUrl { get; set; }
        public TimeSpan ResetPasswordExpireTimeSpan { get; set; } = TimeSpan.FromMinutes(5);
        public int RetryMaxCount { get; set; } = 5;
    }
}
