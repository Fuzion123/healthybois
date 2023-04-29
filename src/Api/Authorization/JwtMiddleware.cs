using Domain.Users;
using Service.Users;
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
        var userId = jwtUtils.ValidateToken(token);
        
        if (userId != null)
        {
            // attach user to context on successful jwt validation
            context.Items["User"] = await userRepository.GetById(userId.Value, cancellationToken);
        }

        await _next(context);
    }
}