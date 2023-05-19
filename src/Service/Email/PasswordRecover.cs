namespace Service.Email
{
    public class PasswordRecover
    {
        public string Email { get; set; }
        public string Code { get; set; }
        public DateTime ExpiresAt { get; set; }
        public int RetryCount { get; set; }
    }
}
