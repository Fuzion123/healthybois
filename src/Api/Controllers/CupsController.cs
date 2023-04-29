using Domain.Cup.Input;
using Microsoft.AspNetCore.Mvc;
using Service.Cups;
using WebApi.Authorization;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class CupsController : ControllerWithUserBase
    {
        private readonly CupService cupService;

        public CupsController(IHttpContextAccessor accessor, CupService cupService) : base(accessor)
        {
            this.cupService = cupService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CupInput request, CancellationToken cancellationToken)
        {
            var cup = await cupService.Create(CurrentUser.Id, request, cancellationToken);

            return Ok(cup);
        }

        [HttpGet("{cupId}")]
        public async Task<IActionResult> GetById(int cupId, CancellationToken cancellationToken)
        {
            var cup = await cupService.GetById(cupId, CurrentUser.Id, cancellationToken);

            if(cup == null)
            {
                return NotFound();
            }

            return Ok(cup);
        }

        [HttpDelete("{cupId}")]
        public async Task<IActionResult> Delete(int cupId, CancellationToken cancellationToken)
        {
            await cupService.Remove(cupId, CurrentUser.Id, cancellationToken);

            return Ok(new { message = "Cup deleted successfully" });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCupsReferencedByUser(CancellationToken cancellationToken)
        {
            var cups = await cupService.GetAllCupsReferencedByUser(CurrentUser.Id, cancellationToken);

            return Ok(cups);
        }

        [HttpPut("{cupId}/participants/add/{participantUserId}")]
        public async Task<IActionResult> AddParticipant(int cupId, int participantUserId, CancellationToken cancellationToken)
        {
            var input = new ParticipantInput()
            {
                UserId = participantUserId,
            };

            await cupService.AddParticipant(cupId, input, CurrentUser.Id, cancellationToken);

            return Ok(new { message = "Participant added successfully" });
        }

        [HttpPut("{cupId}/participants/remove/{participantUserId}")]
        public async Task<IActionResult> RemoveParticipant(int cupId, int participantUserId, CancellationToken cancellationToken)
        {
            var input = new ParticipantInput()
            {
                UserId = participantUserId,
            };

            await cupService.RemoveParticipant(cupId, input, CurrentUser.Id, cancellationToken);

            return Ok(new { message = "Participant removed successfully" });
        }
    }
}
