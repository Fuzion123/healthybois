using Domain.Events.Input;
using Microsoft.AspNetCore.Mvc;
using Service.Events;
using WebApi.Authorization;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventsController : ControllerWithUserBase
    {
        private readonly EventService EventService;

        public EventsController(IHttpContextAccessor accessor, EventService EventService) : base(accessor)
        {
            this.EventService = EventService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(EventInput request, CancellationToken cancellationToken)
        {
            var Event = await EventService.Create(CurrentUser.Id, request, cancellationToken);

            return Ok(Event);
        }

        [HttpGet("{EventId}")]
        public async Task<IActionResult> GetById(int EventId, CancellationToken cancellationToken)
        {
            var Event = await EventService.GetById(EventId, CurrentUser.Id, cancellationToken);

            if(Event == null)
            {
                return NotFound();
            }

            return Ok(Event);
        }

        [HttpDelete("{EventId}")]
        public async Task<IActionResult> Delete(int EventId, CancellationToken cancellationToken)
        {
            await EventService.Remove(EventId, CurrentUser.Id, cancellationToken);

            return Ok(new { message = "Event deleted successfully" });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEventsReferencedByUser(CancellationToken cancellationToken)
        {
            var Events = await EventService.GetAllEventsReferencedByUser(CurrentUser.Id, cancellationToken);

            return Ok(Events);
        }

        [HttpPost("{EventId}/participants/add/{participantUserId}")]
        public async Task<IActionResult> AddParticipant(int EventId, int participantUserId, CancellationToken cancellationToken)
        {
            var input = new ParticipantInput()
            {
                UserId = participantUserId,
            };

            await EventService.AddParticipant(EventId, input, CurrentUser.Id, cancellationToken);

            return Ok(new { message = "Participant added successfully" });
        }

        [HttpDelete("{EventId}/participants/remove/{participantUserId}")]
        public async Task<IActionResult> RemoveParticipant(int EventId, int participantUserId, CancellationToken cancellationToken)
        {
            var input = new ParticipantInput()
            {
                UserId = participantUserId,
            };

            await EventService.RemoveParticipant(EventId, input, CurrentUser.Id, cancellationToken);

            return Ok(new { message = "Participant removed successfully" });
        }

        [HttpPost("activities/add")]
        public async Task<IActionResult> AddActivity(ActivityInput activityInput, CancellationToken cancellationToken)
        {
            await EventService.AddActivity(activityInput, cancellationToken);

            return Ok(new { message = "Activity added successfully" });
        }

        [HttpDelete("activities/remove")]
        public async Task<IActionResult> RemoveParticipant(ActivityInput input, CancellationToken cancellationToken)
        {
            await EventService.RemoveActivity(input, cancellationToken);

            return Ok(new { message = "Activity removed successfully" });
        }

        [HttpPut("activities/results/addOrUpdate")]
        public async Task<IActionResult> AddOrUpdateResult(ResultInput resultInput, CancellationToken cancellationToken)
        {
            await EventService.AddOrUpdateResult(resultInput, cancellationToken);

            return Ok(new { message = "Result added/updated successfully" });
        }

        [HttpDelete("activities/results/remove")]
        public async Task<IActionResult> RemoveResult(ResultRemoveInput input, CancellationToken cancellationToken)
        {
            await EventService.RemoveResult(input, cancellationToken);

            return Ok(new { message = "Result removed successfully" });
        }
    }
}
