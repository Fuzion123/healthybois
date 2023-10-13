using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.Users.Edits
{
    public class UserEditPassword
    {
        [Required(AllowEmptyStrings = false)]
        public string Password { get; set; }
        [Required(AllowEmptyStrings = false)]
        public string PasswordConfirm { get; set; }
    }
}
