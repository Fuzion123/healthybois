using Domain.Events.Input;
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

				public ActivitiesController(IHttpContextAccessor accessor, EventService eventService) : base(accessor)
				{
						this.eventService = eventService;
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

						if (activity != null)
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

				[HttpGet("{eventId}/eventlistingviewmodel")]
				public async Task<IActionResult> GetAllForEventListingViewmodel(int eventId, CancellationToken cancellationToken)
				{
						var activities = await eventService.GetAllActivities(eventId, cancellationToken).ConfigureAwait(false);
						var participants = await eventService.GetAllParticipants(eventId, cancellationToken);
						var participantsById = participants.ToDictionary(x => x.Id);

						var mappedActivities = activities.Select(activity =>
						{
								int? winnerParticipantId = activity.Completed ? activity.Results.OrderByDescending(x => x.Score).First().ParticipantId : null;

								return new
								{
										activity.Id,
										activity.Title,
										activity.Completed,
										CompletedOnPrettyText = CompletedOnToPrettyText(activity.CompletedOn),
										Winner = winnerParticipantId.HasValue ? new
										{
												participantsById[winnerParticipantId.Value].FirstName,
												participantsById[winnerParticipantId.Value].LastName,
												participantsById[winnerParticipantId.Value].ProfilePictureUrl
										} : null
								};
						});

						return Ok(mappedActivities);
				}

				private string CompletedOnToPrettyText(DateTime? completedOn)
				{
						if (!completedOn.HasValue)
								return "";

						var difference = DateTime.Now - completedOn.Value;

						if (difference.Days > 3)
						{
								return completedOn.Value.ToString();
						}
						else if (difference.Days > 0 && difference.Days <= 3)
						{
								return $"completed {difference.Days} day{(difference.Days == 1 ? "" : "s")} ago";
						}
						else if (difference.Hours > 0)
						{
								return $"completed {difference.Hours} hour{(difference.Hours == 1 ? "" : "s")} ago";
						}
						else if (difference.Minutes > 0)
						{
								return $"completed {difference.Minutes} minute{(difference.Minutes == 1 ? "" : "s")} ago";
						}
						else if (difference.Seconds > 10)
						{
								return $"completed {difference.Seconds} second{(difference.Seconds == 1 ? "" : "s")} ago";
						}
						else
						{
								return $"completed a moment ago";
						}
				}
		}
}
