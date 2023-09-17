using Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.EntityFrameworkCore;
using Service.Events;
using System.Threading;
using System.Threading.Tasks;

namespace api.Functions
{
    public class EventGetById
    {
        private readonly EventService eventService;
        private readonly EndureanceCupDbContext endureanceCupDbContext;

        public EventGetById(EventService eventService, EndureanceCupDbContext endureanceCupDbContext)
        {
            this.eventService = eventService;
            this.endureanceCupDbContext = endureanceCupDbContext;
        }

        [FunctionName("EventGetById")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "events/{eventId:int}/{userId:int}")] HttpRequest req, int eventId, int userId, CancellationToken cancellationToken)
        {
            var @event = await endureanceCupDbContext.Events.FirstOrDefaultAsync(cancellationToken);

            return new JsonResult(@event);
        }
    }
}
