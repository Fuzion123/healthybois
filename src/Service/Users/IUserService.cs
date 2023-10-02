namespace Service.Users;

using Service.Users.Models;
using WebApi.Models.Users;

public interface IUserService
{
    Task<AuthenticateResponse> Authenticate(AuthenticateRequest model, CancellationToken cancellationToken);
    Task<List<UserDto>> GetAll(CancellationToken cancellationToken);
    Task<UserDto> GetById(int id, CancellationToken cancellationToken);
    Task Register(RegisterRequest model, CancellationToken cancellationToken);
    Task Update(int id, UpdateRequest model, CancellationToken cancellationToken);
    Task Delete(int id, CancellationToken cancellationToken);
    Task ResetPassword(string email, ResetPasswordRequest request, CancellationToken cancellationToken);
    Task<List<UserSearchResponseDto>> Search(string term, CancellationToken cancellationToken);
    Task<bool> IsUserNameTaken(string userName, string email, CancellationToken cancellation);
}
