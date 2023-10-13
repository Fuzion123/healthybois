namespace Service.Users.Dependencies
{
    public class ValidateTokenResponse
    {
        public int? UserId { get; set; }
        public string PasswordHash { get; set; }
    }
}
