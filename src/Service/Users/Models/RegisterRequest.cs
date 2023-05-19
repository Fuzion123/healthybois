namespace Service.Users.Models;

using System.ComponentModel.DataAnnotations;

public class RegisterRequest
{
    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }
    
    [Required]
    public string Email { get; set; }

    [Required]
    public string Username { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    public ProfilePicture ProfilePicture { get; set; }
}

public class ProfilePicture
{
    public string Name { get; set; }
    public string Type { get; set; }
    public string Base64 { get; set; }
}