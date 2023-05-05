using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Users.Models;

namespace WebApi.Controllers
{
    [AllowAnonymous]
    [ApiController]
    public class HomeController : ControllerBase
    {
        public HomeController()
        {
            
        }

        [HttpGet("")]
        public async Task<IActionResult> Index(CancellationToken cancellationToken)
        {
            return Ok(Task.FromResult("Hello from Healthybois").Result);
        }
    }
}
