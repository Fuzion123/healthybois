using Microsoft.AspNetCore.Mvc;
using Service.Events;
using Service.Events.Models;
using WebApi.Authorization;

namespace WebApi.Controllers
{
		[Authorize]
		[ApiController]
		[Route("[controller]")]
		public class ScoreboardController : ControllerWithUserBase
		{
				private readonly EventService EventService;

				public ScoreboardController(IHttpContextAccessor accessor, EventService EventService) : base(accessor)
				{
						this.EventService = EventService;
				}

				[HttpGet("{eventId}")]
				[Produces(typeof(ScoreboardSummaryDto))]
				public async Task<IActionResult> GetById(int eventId, [FromQuery] string limitedToActivities, CancellationToken cancellationToken)
				{
						var limited = new List<string>();

						if (!string.IsNullOrEmpty(limitedToActivities))
						{
								limited.AddRange(limitedToActivities.Split(',').Where(x => !string.IsNullOrEmpty(x)).Select(x => x.Trim()));
						}

						var summary = await EventService.GetScoreboardSummary(eventId, CurrentUser.Id, limited, cancellationToken);

						if (summary == null)
						{
								return NotFound();
						}

						return Ok(summary);
				}
		}
}
