namespace WebApi.Controllers;

using Domain.Pictures.Inputs;
using Microsoft.AspNetCore.Mvc;
using Service.Email;
using Service.Events;
using Service.Users;
using Service.Users.Models;
using WebApi.Authorization;
using WebApi.Models.Users;
using WebApi.Models.Users.Edits;

[Authorize]
[ApiController]
[Route("[controller]")]
public class UsersController : ControllerWithUserBase
{
    private IUserService _userService;
    private readonly EventService eventService;
    private readonly IRecoverCodeService recoverCodeService;

    public UsersController(IUserService userService, EventService eventService, IRecoverCodeService recoverCodeService, IHttpContextAccessor httpContextAccessor)
        : base(httpContextAccessor)
    {
        _userService = userService;
        this.eventService = eventService;
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
    public async Task<IActionResult> Resetpassword(string code, [FromBody] ResetPasswordRequest model, CancellationToken cancellationToken)
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
        var userId = id;

        var events = await eventService.GetAllEventsReferencedByUser(userId, cancellationToken);

        foreach (var @event in events)
        {
            if (@event.EventOwner.UserId == userId)
            {
                await eventService.Remove(@event.Id, userId, cancellationToken);

                continue;
            }

            var participantId = @event.Participants.FirstOrDefault(x => x.UserId == userId);

            if (participantId == null)
                continue;

            await eventService.RemoveParticipant(@event.Id, participantId.Id, @event.EventOwner.UserId, cancellationToken);
        }

        await _userService.Delete(userId, cancellationToken);

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

    [HttpPost("exists")]
    [AllowAnonymous]
    public async Task<IActionResult> Exists(UserExistsRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.UserName) && string.IsNullOrEmpty(request.Email))
        {
            return BadRequest("user name and email was both null/empty");
        }

        return Ok(await _userService.IsUserNameTaken(request.UserName, request.Email, cancellationToken));
    }

    [HttpPut("edit/firstname")]
    public async Task<IActionResult> EditFirstName(UserEditFirstName request, CancellationToken cancellationToken)
    {
        await _userService.Update(CurrentUser.Id, new UpdateRequest()
        {
            EditType = EditType.FirstName,
            FirstName = request.FirstName
        }, cancellationToken);

        return Ok();
    }

    [HttpPut("edit/lastname")]
    public async Task<IActionResult> EditLastName(UserEditLastName request, CancellationToken cancellationToken)
    {
        await _userService.Update(CurrentUser.Id, new UpdateRequest()
        {
            EditType = EditType.LastName,
            LastName = request.LastName
        }, cancellationToken);

        return Ok();
    }

    [HttpPut("edit/password")]
    public async Task<IActionResult> EditPassword(UserEditPassword request, CancellationToken cancellationToken)
    {
        await _userService.Update(CurrentUser.Id, new UpdateRequest()
        {
            EditType = EditType.Password,
            Password = request.Password,
            PasswordConfirm = request.PasswordConfirm
        }, cancellationToken);

        return Ok();
    }

    [HttpPut("edit/profilepicture")]
    public async Task<IActionResult> EditProfilePicture(UserEditProfilePicture request, CancellationToken cancellationToken)
    {
        await _userService.Update(CurrentUser.Id, new UpdateRequest()
        {
            EditType = EditType.ProfilePicture,
            ProfilePicture = new PictureInput()
            {
                Base64 = request.Base64,
                Name = request.Name,
            }
        }, cancellationToken);

        return Ok();
    }
}