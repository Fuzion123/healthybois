namespace Service.Users.Dependencies;

using Domain.Users;

public interface IJwtUtils
{
    public string GenerateToken(User user);
    public int? ValidateToken(string token);
}
