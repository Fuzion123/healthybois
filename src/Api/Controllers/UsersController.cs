namespace WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using Service.Email;
using Service.Users;
using Service.Users.Models;
using WebApi.Authorization;
using WebApi.Models.Users;

[Authorize]
[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private IUserService _userService;
    private readonly IRecoverCodeService recoverCodeService;

    public UsersController(IUserService userService, IRecoverCodeService recoverCodeService)
    {
        _userService = userService;
        this.recoverCodeService = recoverCodeService;
    }

    [AllowAnonymous]
    [HttpPost("authenticate")]
    public async Task<IActionResult> Authenticate(AuthenticateRequest model, CancellationToken cancellationToken)
    {
        var response = await _userService.Authenticate(model, cancellationToken);

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest model, CancellationToken cancellationToken)
    {
        await _userService.Register(model, cancellationToken);

        return Ok(new { message = "Registration successful" });
    }

    [AllowAnonymous]
    [HttpPost("resetpassword/{code}")]
    public async Task<IActionResult> Register(string code, [FromBody] ResetPasswordRequest model, CancellationToken cancellationToken)
    {
        var recoverCode = await recoverCodeService.GetRecoverCode(code, cancellationToken);

        await _userService.ResetPassword(recoverCode.Email, model, cancellationToken);

        await recoverCodeService.RemoveRecoverCode(code, cancellationToken);

        return Ok(new { message = "Reset was successful" });
    }

    [AllowAdminOnlyAttribute]
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var users = await _userService.GetAll(cancellationToken);

        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var user = await _userService.GetById(id, cancellationToken);

        return Ok(user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateRequest model, CancellationToken cancellationToken)
    {
        await _userService.Update(id, model, cancellationToken);

        return Ok(new { message = "User updated successfully" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        await _userService.Delete(id, cancellationToken);
        return Ok(new { message = "User deleted successfully" });
    }

    [HttpGet("search/{term}")]
    public async Task<IActionResult> Search(string term, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(term))
        {
            return Ok(new List<UserSearchResponseDto>());
        }

        return Ok(await _userService.Search(term, cancellationToken));
    }
}