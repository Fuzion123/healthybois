using Domain.Users;

namespace Service.Users.Models;

public class AuthenticateResponse
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public string Token { get; set; }
    public Uri ProfilePictureUrl { get; set; }
    public Role Role { get; set; }
    public bool IsAdmin => Role == Role.Admin;
}