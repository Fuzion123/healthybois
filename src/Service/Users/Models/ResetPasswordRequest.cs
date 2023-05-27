
namespace Service.Users.Models
{
    public class ResetPasswordRequest
    {
        public string NewPassword { get; set; }
        public string NewPasswordConfirm { get; set; }
    }
}
