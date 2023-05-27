using Domain.Events.Input;
using Microsoft.AspNetCore.Mvc;
using Service.Events;
using Service.Events.Models;
using WebApi.Authorization;
using WebApi.Models.Participants;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ParticipantsController : ControllerWithUserBase
    {
        private readonly EventService eventService;

        public ParticipantsController(IHttpContextAccessor accessor, EventService EventService) : base(accessor)
        {
            eventService = EventService;
        }

        [HttpPost("{eventId}")]
        [Produces(typeof(ParticipantDto))]
        public async Task<IActionResult> AddParticipant(int eventId, [FromBody] CreateParticipantRequest request, CancellationToken cancellationToken)
        {
            var input = new ParticipantInput()
            {
                UserId = request.ParticipantUserId,
            };

            var participant = await eventService.AddParticipant(eventId, input, CurrentUser.Id, cancellationToken);

            return Ok(participant);
        }

        [HttpGet("{eventId}")]
        [Produces(typeof(List<ParticipantDto>))]
        public async Task<IActionResult> GetAll(int eventId, CancellationToken cancellationToken)
        {
            var participants = await eventService.GetAllParticipants(eventId, cancellationToken).ConfigureAwait(false);

            return Ok(participants);
        }

        [HttpGet("{eventId}/{participantId}")]
        [Produces(typeof(ParticipantDto))]
        public async Task<IActionResult> GetById(int eventId, int participantId, CancellationToken cancellationToken)
        {
            var participant = await eventService.GetParticipantById(eventId, participantId, cancellationToken);

            if (participant != null)
                return Ok(participant);

            return NotFound();
        }


        [HttpDelete("{eventId}/{participantId}")]
        public async Task<IActionResult> RemoveParticipant(int eventId, int participantId, CancellationToken cancellationToken)
        {
            await eventService.RemoveParticipant(eventId, participantId, CurrentUser.Id, cancellationToken);

            return Ok();
        }
    }
}
