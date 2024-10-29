using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.Users.Edits
{
    public class UserEditFirstName
    {
        [Required(AllowEmptyStrings = false)]
        public string FirstName { get; set; }
    }
}
