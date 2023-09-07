using Domain.Events.Input;
using Domain.Pictures.Inputs;
using Microsoft.AspNetCore.Mvc;
using Service.Events;
using Service.Events.Models;
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
        [Produces(typeof(EventDetailDto))]
        public async Task<IActionResult> Create(EventInput request, CancellationToken cancellationToken)
        {
            var Event = await EventService.Create(CurrentUser.Id, request, cancellationToken);

            return Ok(Event);
        }

        [HttpPut("{eventId}")]
        [Produces(typeof(EventDetailDto))]
        public async Task<IActionResult> Update(int eventId, EventInput request, CancellationToken cancellationToken)
        {
            var @event = await EventService.Update(eventId, CurrentUser.Id, request, cancellationToken);

            return Ok(@event);
        }

        [HttpGet("{eventId}")]
        [Produces(typeof(EventDetailDto))]
        public async Task<IActionResult> GetById(int eventId, CancellationToken cancellationToken)
        {
            var Event = await EventService.GetById(eventId, CurrentUser.Id, cancellationToken);

            if (Event == null)
            {
                return NotFound();
            }

            return Ok(Event);
        }

        [HttpDelete("{eventId}")]
        public async Task<IActionResult> Delete(int eventId, CancellationToken cancellationToken)
        {
            await EventService.Remove(eventId, CurrentUser.Id, cancellationToken);

            return Ok();
        }

        [HttpGet]
        [Produces(typeof(List<EventDetailDto>))]
        public async Task<IActionResult> GetAllEventsReferencedByUser(CancellationToken cancellationToken)
        {
            var Events = await EventService.GetAllEventsReferencedByUser(CurrentUser.Id, cancellationToken);

            return Ok(Events);
        }

        [HttpPut("{eventId}/addOrUpdatePicture")]
        [Produces(typeof(EventDetailDto))]
        public async Task<IActionResult> GetById(int eventId, [FromBody] PictureInput pictureInput, CancellationToken cancellationToken)
        {
            var @event = await EventService.SetOrUpdateEventPicture(eventId, CurrentUser.Id, pictureInput, cancellationToken);

            if (@event == null)
            {
                return NotFound();
            }

            return Ok(@event);
        }

        [HttpGet("{eventId}/scores")]
        [Produces(typeof(EventDetailDto))]
        public async Task<IActionResult> ScoresByEventId(int eventId, CancellationToken cancellationToken)
        {
            var @event = await EventService.GetById(eventId, CurrentUser.Id, cancellationToken);

            if (@event == null)
            {
                return NotFound();
            }

            var participantScores = @event.Participants.Select(p =>
            {
                var overAllPoints = @event.Activities.SelectMany(x => x.Results.Where(r => r.ParticipantId == p.Id)).Sum(r => r.Score);

                return new
                {
                    Points = overAllPoints,
                    p.Id,
                    p.FirstName,
                    p.LastName,
                    p.ProfilePictureUrl
                };

            }).OrderByDescending(x => x.Points).ToList();

            return Ok(participantScores);
        }
    }
}
