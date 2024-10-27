namespace WebApi.Authorization;

using Domain.Users;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AllowAdminOnlyAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = (User)context.HttpContext.Items["User"];

        if (user == null || user.Role != Role.Admin)
            context.Result = new JsonResult(new { message = "Status403Forbidden" }) { StatusCode = StatusCodes.Status403Forbidden };
    }
}