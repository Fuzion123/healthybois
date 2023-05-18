using Domain.Events.Input;
using Microsoft.AspNetCore.Mvc;
using Service.Events;
using WebApi.Authorization;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ResultsController : ControllerWithUserBase
    {
        private readonly EventService eventService;

        public ResultsController(IHttpContextAccessor accessor, EventService eventService) : base(accessor)
        {
            this.eventService = eventService;
        }

        [HttpPut("{eventId}/{activityId}")]
        public async Task<IActionResult> AddOrUpdateResult(int eventId, int activityId, ResultInput resultInput, CancellationToken cancellationToken)
        {
            await eventService.AddOrUpdateResult(eventId, activityId, resultInput, cancellationToken);

            return Ok(new { message = "Result added/updated successfully" });
        }

        [HttpGet("{eventId}/{activityId}")]
        public async Task<IActionResult> GetAll(int eventId, int activityId, CancellationToken cancellationToken)
        {
            var results = await eventService.GetAllResults(eventId, activityId, cancellationToken).ConfigureAwait(false);

            return Ok(results);
        }

        [HttpGet("{eventId}/{activityId}/{resultId}")]
        public async Task<IActionResult> GetById(int eventId, int activityId, int resultId, CancellationToken cancellationToken)
        {
            var result = await eventService.GetResultById(eventId, activityId, resultId, cancellationToken);

            if (result != null)
                return Ok(result);

            return NotFound();
        }

        //[HttpGet("{eventId}/{activityId}/{participantId}")]
        //public async Task<IActionResult> GetByParticipantId(int eventId, int activityId, int participantId, CancellationToken cancellationToken)
        //{
        //    var result = await eventService.GetResultByParticipantId(eventId, activityId, participantId, cancellationToken);

        //    if (result != null)
        //        return Ok(result);

        //    return NotFound();
        //}

        [HttpDelete("{eventId}/{activityId}/{resultId}")]
        public async Task<IActionResult> RemoveResult(int eventId, int activityId, int resultId, CancellationToken cancellationToken)
        {
            await eventService.RemoveResult(eventId, activityId, resultId, cancellationToken);

            return Ok(new { message = "Result removed successfully!" });
        }
    }
}
