using Domain.Users;
using Microsoft.AspNetCore.Mvc;
using Service.Email;
using WebApi.Authorization;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EmailController : ControllerWithUserBase
    {
        private readonly IEmailService emailService;
        private readonly IUserRepository userRepository;
        private readonly IRecoverCodeService recoverCodeService;

        public EmailController(IHttpContextAccessor accessor, IEmailService emailService, IUserRepository userRepository, IRecoverCodeService recoverCodeService) : base(accessor)
        {
            this.emailService = emailService;
            this.userRepository = userRepository;
            this.recoverCodeService = recoverCodeService;
        }

        [AllowAnonymous]
        [HttpPost("forgotpassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email, CancellationToken cancellationToken)
        {
            if(!(await userRepository.Exists(email, cancellationToken)))
            {
                return Ok(); // dont sent an email for a restore password if no user is found for that email.
            }

            var recoverCode = await recoverCodeService.GenerateRecoverCodeForEmail(email, cancellationToken);

            await emailService.ForgotPassword(email, recoverCode, cancellationToken).ConfigureAwait(false);

            return Ok();
        }

        //[HttpPost("invite")]
        //public Task<IActionResult> Invite(string email, CancellationToken cancellationToken)
        //{
        //    return Ok("Email has been sent to you");
        //}
    }
}
