using Domain.Events.Input;
using Microsoft.AspNetCore.Mvc;
using Service.Events;
using WebApi.Authorization;
using WebApi.Models.Events;

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

        [HttpGet("{eventId}")]
        public async Task<IActionResult> GetById(int eventId, CancellationToken cancellationToken)
        {
            var Event = await EventService.GetById(eventId, CurrentUser.Id, cancellationToken);

            if(Event == null)
            {
                return NotFound();
            }

            return Ok(Event);
        }

        [HttpDelete("{eventId}")]
        public async Task<IActionResult> Delete(int eventId, CancellationToken cancellationToken)
        {
            await EventService.Remove(eventId, CurrentUser.Id, cancellationToken);

            return Ok(new { message = "Event deleted successfully" });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEventsReferencedByUser(CancellationToken cancellationToken)
        {
            var Events = await EventService.GetAllEventsReferencedByUser(CurrentUser.Id, cancellationToken);

            return Ok(Events);
        }
    }
}
