using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.Users.Edits
{
    public class UserEditLastName
    {
        [Required(AllowEmptyStrings = false)]
        public string LastName { get; set; }
    }
}
