using Domain.Events.Input;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using Service.Events;
using Service.Events.Models;
using WebApi.Authorization;
using WebApi.Models.Activities;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ActivitiesController : ControllerWithUserBase
    {
        private readonly EventService eventService;
        private readonly EndureanceCupDbContext endureanceCupDbContext;

        public ActivitiesController(IHttpContextAccessor accessor, EventService eventService, EndureanceCupDbContext endureanceCupDbContext) : base(accessor)
        {
            this.eventService = eventService;
            this.endureanceCupDbContext = endureanceCupDbContext;
        }

        [HttpGet("{eventId}")]
        [Produces(typeof(List<ActivityListingDto>))]
        public async Task<IActionResult> GetAll(int eventId, CancellationToken cancellationToken)
        {
            var activities = await eventService.GetAllActivities(eventId, cancellationToken).ConfigureAwait(false);

            return Ok(activities);
        }

        [HttpGet("{eventId}/{activityId}")]
        [Produces(typeof(ActivityListingDto))]
        public async Task<IActionResult> GetById(int eventId, int activityId, CancellationToken cancellationToken)
        {
            var activity = await eventService.GetActivityById(eventId, activityId, cancellationToken);

            if(activity != null)
                return Ok(activity);

            return NotFound();
        }

        [HttpPost("{eventId}")]
        [Produces(typeof(ActivityListingDto))]
        public async Task<IActionResult> Create(int eventId, [FromBody] CreateActivityRequest activityInput, CancellationToken cancellationToken)
        {
            if (activityInput is null)
            {
                throw new ArgumentNullException(nameof(activityInput));
            }

            var input = new ActivityInput()
            {
                EventId = eventId,
                OwnerUserId = CurrentUser.Id,
                Title = activityInput.Title,
            };

            var activity = await eventService.AddActivity(input, cancellationToken);

            return Ok(activity);
        }

        [HttpPut("{eventId}/{activityId}")]
        [Produces(typeof(ActivityListingDto))]
        public async Task<IActionResult> Update(int eventId, int activityId, [FromBody] UpdateActivityRequest request, CancellationToken cancellationToken)
        {
            if (request is null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            var input = new ActivityUpdateInput()
            {
                Title = request.Title,
                ActivityId = activityId,
            };

            var activity = await eventService.UpdateActivity(eventId, input, cancellationToken);

            return Ok(activity);
        }


        [HttpDelete("{eventId}/{activityId}")]
        public async Task<IActionResult> RemoveParticipant(int eventId, int activityId, CancellationToken cancellationToken)
        {
            var currentUserId = CurrentUser.Id;

            await eventService.RemoveActivity(eventId, activityId, currentUserId, cancellationToken);

            return Ok();
        }
    }
}
