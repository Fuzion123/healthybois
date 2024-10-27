using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.Users.Edits
{
    public class UserEditProfilePicture
    {
        [Required(AllowEmptyStrings = false)]
        public string Name { get; set; }
        [Required(AllowEmptyStrings = false)]
        public string Base64 { get; set; }
    }
}
