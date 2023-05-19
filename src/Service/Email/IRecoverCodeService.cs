
namespace Service.Email
{
    public interface IRecoverCodeService
    {
        public Task<string> GenerateRecoverCodeForEmail(string email, CancellationToken cancellationToken);
        public Task<PasswordRecover> GetRecoverCode(string code, CancellationToken cancellationToken);
        public Task RemoveRecoverCode(string code, CancellationToken cancellationToken);
    }
}
