namespace Service.Users;

using Domain.Users;
using Service.Users.Models;

public interface IUserService
{
    Task<AuthenticateResponse> Authenticate(AuthenticateRequest model, CancellationToken cancellationToken);
    Task<List<User>> GetAll(CancellationToken cancellationToken);
    Task<User> GetById(int id, CancellationToken cancellationToken);
    Task Register(RegisterRequest model, CancellationToken cancellationToken);
    Task Update(int id, UpdateRequest model, CancellationToken cancellationToken);
    Task Delete(int id, CancellationToken cancellationToken);
}
