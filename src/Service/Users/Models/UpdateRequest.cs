using Domain.Pictures.Inputs;

namespace Service.Users.Models;


public enum EditType
{
    Full,
    UserName,
    Email,
    FirstName,
    LastName,
    Password,
    ProfilePicture
}

public class UpdateRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string PasswordConfirm { get; set; }
    public PictureInput ProfilePicture { get; set; }
    public EditType EditType { get; set; } = EditType.Full;
}