using Domain.Users;
using Service.Users.Dependencies;

namespace WebApi.Authorization;


public class JwtMiddleware
{
    private readonly RequestDelegate _next;

    public JwtMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, IUserRepository userRepository, IJwtUtils jwtUtils)
    {
        CancellationToken cancellationToken = context?.RequestAborted ?? CancellationToken.None;

        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        var response = jwtUtils.ValidateToken(token);

        if (response != null && response.UserId.HasValue)
        {
            // attach user to context on successful jwt validation
            var user = await userRepository.GetById(response.UserId.Value, cancellationToken);

            if (user != null && user.PasswordHash == response.PasswordHash)
            {
                context.Items["User"] = user;
            }
        }

        await _next(context);
    }
}