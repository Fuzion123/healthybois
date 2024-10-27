
namespace Service.Email
{
    public interface IEmailService
    {
        public Task ForgotPassword(string email, string recoverCode, CancellationToken cancellationToken);
        public Task Invite(string email, CancellationToken cancellationToken);
    }
}
