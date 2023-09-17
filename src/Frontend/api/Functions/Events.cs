using Domain.Events.Input;
using Domain.Pictures.Inputs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Service.Events;
using System.Linq;
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

        [FunctionName("Events_Create")]
        public async Task<IActionResult> Create(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "events/{userId:int}")] EventInput req, int userId, CancellationToken cancellationToken)
        {
            var @event = await eventService.Create(userId, req, cancellationToken);

            return new JsonResult(@event);
        }

        [FunctionName("Events_Update")]
        public async Task<IActionResult> Update(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "events/{userId:int}/{eventId:int}")] EventInput req, int userId, int eventId, CancellationToken cancellationToken)
        {
            var @event = await eventService.Update(eventId, userId, req, cancellationToken);

            return new JsonResult(@event);
        }

        [FunctionName("Events_GetById")]
        public async Task<IActionResult> GetById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "events/{userId:int}/{eventId:int}")] HttpRequest req, int userId, int eventId, CancellationToken cancellationToken)
        {
            var @event = await eventService.GetById(eventId, userId, cancellationToken);

            if (@event == null)
            {
                return new NotFoundResult();
            }

            return new JsonResult(@event);
        }

        [FunctionName("Events_GetAllEventsReferencedByUser")]
        public async Task<IActionResult> GetAllEventsReferencedByUser(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "events/{userId:int}")] HttpRequest req, int userId, CancellationToken cancellationToken)
        {
            var events = await eventService.GetAllEventsReferencedByUser(userId, cancellationToken);

            return new JsonResult(events);
        }

        [FunctionName("Events_AddOrUpdatePicture")]
        public async Task<IActionResult> AddOrUpdatePicture(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "events/{userId:int}/{eventId:int}/addOrUpdatePicture")] PictureInput pictureInput, int userId, int eventId, CancellationToken cancellationToken)
        {
            var @event = await eventService.SetOrUpdateEventPicture(eventId, userId, pictureInput, cancellationToken);

            if (@event == null)
            {
                return new NotFoundResult();
            }

            return new JsonResult(@event);
        }

        [FunctionName("Events_Scores")]
        public async Task<IActionResult> Scores(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "events/{userId:int}/{eventId:int}/scores")] HttpRequest req, int userId, int eventId, CancellationToken cancellationToken)
        {
            var @event = await eventService.GetById(eventId, userId, cancellationToken);

            if (@event == null)
            {
                return new NotFoundResult();
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

            return new JsonResult(participantScores);
        }
    }
}
