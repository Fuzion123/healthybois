using Azure;
using Azure.Communication.Email;
using Service.Email;

namespace Infrastructure.EmailService
{
    public class AzureEmailService : IEmailService
    {
        private readonly AzureEmailSettings settings;

        public AzureEmailService(AzureEmailSettings settings)
        {
            this.settings = settings;
        }

        public async Task ForgotPassword(string email, string recoverCode, CancellationToken cancellationToken)
        {
            if (!IsValidEmail(email))
            {
                throw new Exception($"Email '{email}' is not a valid email.");
            }

            EmailClient emailClient = new EmailClient(settings.AzureEmailAccount);

            var resetUrl = $"{settings.ResetPasswordUrl}/{recoverCode}";

            try
            {
                var emailSendOperation = await emailClient.SendAsync(
                    wait: WaitUntil.Completed,
                    senderAddress: "DoNotReply@7d25d5e4-e5b7-4ea8-8420-cac38e9b29b8.azurecomm.net",
                    recipientAddress: $"{email}",
                    subject: "Forgot you password?",
                    htmlContent: $"<html><body>Recover here: <a href=\"{resetUrl}\">Reset password</a></body></html>");

                if(!emailSendOperation.HasValue || emailSendOperation.Value.Status != EmailSendStatus.Succeeded)
                {
                    throw new Exception($"Failed to send out email with error code '{emailSendOperation.Value.Status}'");
                }
            }
            catch (RequestFailedException ex)
            {
                throw new Exception($"Email send operation failed with error code: {ex.ErrorCode}, message: {ex.Message}");
            }
        }

        public Task Invite(string email, CancellationToken cancellationToken)
        {
            if (!IsValidEmail(email))
            {
                throw new Exception($"Email '{email}' is not a valid email.");
            }

            throw new NotImplementedException();
        }

        bool IsValidEmail(string email)
        {
            var trimmedEmail = email.Trim();

            if (trimmedEmail.EndsWith("."))
            {
                return false; // suggested by @TK-421
            }
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == trimmedEmail;
            }
            catch
            {
                return false;
            }
        }
    }
}
