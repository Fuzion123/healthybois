using Service;
using Service.Email;

namespace Infrastructure.EmailService
{
    public class RecoverCodeService : IRecoverCodeService
    {
        private readonly AzureEmailSettings azureEmailSettings;
        private readonly IJobStorage jobStorage;

        public RecoverCodeService(AzureEmailSettings azureEmailSettings, IJobStorage jobStorage)
        {
            this.azureEmailSettings = azureEmailSettings;
            this.jobStorage = jobStorage;
        }

        public async Task<string> GenerateRecoverCodeForEmail(string email, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentException($"'{nameof(email)}' cannot be null or empty.", nameof(email));
            }

            var expiresAt = DateTime.Now.Add(azureEmailSettings.ResetPasswordExpireTimeSpan);

            var code = Guid.NewGuid().ToString();

            var blobName = code;

            var recoverObj = new PasswordRecover()
            {
                Code = code,
                ExpiresAt = expiresAt,
                Email = email
            };

            if (await jobStorage.Exists(blobName, cancellationToken))
            {
                await jobStorage.Delete(email, cancellationToken);
            }

            await jobStorage.Add(blobName, recoverObj, cancellationToken);

            return code;
        }

        public async Task<PasswordRecover> GetRecoverCode(string code, CancellationToken cancellationToken)
        {
            if(!(await jobStorage.Exists(code, cancellationToken)))
            {
                throw new Exception("No recover code was found, please submit a recover of an user before trying to reset password");
            }

            var recoverObj = await jobStorage.Get<PasswordRecover>(code, cancellationToken);

            if (recoverObj == null)
            {
                throw new Exception();
            }

            if (DateTime.Now > recoverObj.ExpiresAt)
            {
                throw new Exception($"Recover code has expired after {azureEmailSettings.ResetPasswordExpireTimeSpan.ToString("mm':'ss")}, please send a new recover email and try again.");
            }

            if (recoverObj.RetryCount > azureEmailSettings.RetryMaxCount)
            {
                await jobStorage.Delete(code, cancellationToken);

                throw new Exception("You have tried to reset your password too many times. Please try to resend a new recover email and try again.");
            }

            ++recoverObj.RetryCount;

            await jobStorage.Delete(code, cancellationToken);

            await jobStorage.Add(code, recoverObj, cancellationToken);

            return recoverObj;
        }

        public async Task RemoveRecoverCode(string code, CancellationToken cancellationToken)
        {
            await jobStorage.Delete(code, cancellationToken);
        }
    }
}
