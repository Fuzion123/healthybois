using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Service.Users;
using Service.Users.Models;
using System.Threading;
using System.Threading.Tasks;

namespace api.Functions
{
    public class UserAuthenticate
    {
        private readonly IUserService userService;

        public UserAuthenticate(IUserService userService)
        {
            this.userService = userService;
        }

        [FunctionName("UserAuthenticate")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "users/authenticate")] AuthenticateRequest req, CancellationToken cancellationToken)
        {
            var response = await userService.Authenticate(req, cancellationToken);

            //string requestBody = String.Empty;

            //using (StreamReader streamReader = new StreamReader(req.Body))
            //{
            //    requestBody = await streamReader.ReadToEndAsync();
            //}

            //dynamic data = JsonConvert.DeserializeObject(requestBody);

            return new JsonResult(response);
        }
    }
}
