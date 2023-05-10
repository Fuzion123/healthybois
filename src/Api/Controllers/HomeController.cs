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
        public IActionResult Index()
        {
            return Ok("Hello from Healthybois!");
        }
    }
}
