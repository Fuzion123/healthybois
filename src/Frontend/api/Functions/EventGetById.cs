using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Service.Events;
using System.Threading;
using System.Threading.Tasks;

namespace api.Functions
{
    public class EventGetById
    {
        private readonly EventService eventService;

        public EventGetById(EventService eventService)
        {
            this.eventService = eventService;
        }

        [FunctionName("EventGetById")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "events/{eventId:int}/{userId:int}")] HttpRequest req, int eventId, int userId, CancellationToken cancellationToken)
        {
            var @event = await eventService.GetById(eventId, userId, cancellationToken);

            return new JsonResult(@event);
        }
    }
}
