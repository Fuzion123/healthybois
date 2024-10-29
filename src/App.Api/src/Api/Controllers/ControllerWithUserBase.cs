using Domain.Users;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    public class ControllerWithUserBase : ControllerBase
    {
        public User CurrentUser;

        public ControllerWithUserBase(IHttpContextAccessor accessor)
        {
            // authorization
            var user = (User)accessor.HttpContext.Items["User"];

            if (user != null)
                CurrentUser = user;
        }
    }
}
