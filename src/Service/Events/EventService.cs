using Domain.Events;
using Domain.Events.Input;
using Domain.Pictures.Inputs;
using Domain.Users;
using Service.Activities;
using Service.Events.Mappers;
using Service.Events.Models;
using Service.Exceptions;
using Service.Participants;
using Service.Participants.Models;
using Service.Results;
using Service.Results.Models;
using static Service.Events.Mappers.EventMapper;

namespace Service.Events
{
    public class EventService
    {
        private readonly IEventRepository eventRepository;
        private readonly IUserRepository userRepository;
        private readonly PictureService pictureService;
        private readonly EventMapper eventMapper;
        private readonly ActivityMapper activityMapper;
        private readonly ParticipantMapper participantMapper;
        private readonly ResultMapper resultMapper;

        public EventService(IEventRepository EventRepository,
                            IUserRepository userRepository,
                            PictureService pictureService,
                            EventMapper eventMapper,
                            ActivityMapper activityMapper,
                            ParticipantMapper participantMapper,
                            ResultMapper resultMapper)
        {
            this.eventRepository = EventRepository;
            this.userRepository = userRepository;
            this.pictureService = pictureService;
            this.eventMapper = eventMapper;
            this.activityMapper = activityMapper;
            this.participantMapper = participantMapper;
            this.resultMapper = resultMapper;
        }

        public async Task<EventDetailDto> Create(int EventOwner, EventInput EventInput, CancellationToken cancellationToken)
        {
            if (EventInput == null) throw new AppException("EventInput was null");

            if (string.IsNullOrEmpty(EventInput.Title)) throw new AppException("Title on Event cant be null or empty");

            if (await eventRepository.Exists(EventInput.Title, cancellationToken))
                throw new AppException($"Event with title {EventInput.Title} already exists");

            // image
            string eventPictureId = default;

            if (EventInput.Picture != null)
            {
                eventPictureId = await pictureService.AddPicture(EventInput.Picture, cancellationToken);
            }

            var Event = new Event(EventOwner, EventInput, eventPictureId);

            eventRepository.Add(Event);

            await eventRepository.SaveChangesAsync(cancellationToken);

            return await eventMapper.Map(Event, cancellationToken);
        }

        public async Task<EventDetailDto> Update(int eventId, int eventOwnerId, EventInput EventInput, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event == null)
                throw new AppException($"No event found for event id {eventId}");

            if (@event.OwnerUserId != eventOwnerId)
            {
                throw new AppException($"Cant update the event because the current user is not the owner of Event");
            }

            // image
            string eventPictureId = default;

            if (EventInput.Picture != null)
            {
                eventPictureId = await pictureService.AddPicture(EventInput.Picture, cancellationToken);
            }

            var updated = @event.Update(EventInput);

            updated |= @event.SetOrUpdatePicture(eventPictureId);

            if (updated)
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            return await eventMapper.Map(@event, cancellationToken);
        }

        public async Task<EventDetailDto> SetOrUpdateEventPicture(int eventId, int eventOwnerId, PictureInput picture, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event == null)
                throw new AppException($"No event found for event id {eventId}");

            if (@event.OwnerUserId != eventOwnerId)
            {
                throw new AppException($"Cant update the event because the current user is not the owner of Event");
            }

            // image
            string eventPictureId = default;

            if (picture != null)
            {
                eventPictureId = await pictureService.AddPicture(picture, cancellationToken);
            }

            if (@event.SetOrUpdatePicture(eventPictureId))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            return await eventMapper.Map(@event, cancellationToken);
        }

        public async Task<List<EventDetailDto>> GetAllEventsReferencedByUser(int userId, CancellationToken cancellationToken)
        {
            var Events = await eventRepository.GetAllReferencedEvents(userId, cancellationToken);

            return Events
                .Select(async x => await eventMapper.Map(x, cancellationToken))
                .Select(x => x.Result)
                .OrderByDescending(x => x.StartsAt)
                .ToList();
        }

        public async Task<EventDetailDto> GetByTitle(string title, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(title))
            {
                throw new ArgumentException($"'{nameof(title)}' cannot be null or empty.", nameof(title));
            }

            var Event = await eventRepository.GetByTitle(title, cancellationToken);

            return await eventMapper.Map(Event, cancellationToken);
        }

        public async Task<EventDetailDto> GetById(int EventId, int userId, CancellationToken cancellationToken)
        {
            var Event = await eventRepository.GetById(EventId, cancellationToken);

            if (Event == null)
                return null;

            if (Event.OwnerUserId == userId || Event.Participants.Any(x => x.UserId == userId))
                return await eventMapper.Map(Event, cancellationToken);

            throw new AppException($"Current user does not have access to Event with id {EventId}");
        }

        public async Task Remove(int EventId, int ownerUserId, CancellationToken cancellationToken)
        {
            var Event = await eventRepository.GetById(EventId, cancellationToken);

            if (Event == null)
                return;

            if (Event.OwnerUserId != ownerUserId)
            {
                throw new AppException($"Cant remove Event because the current user is not the owner of Event with id '{EventId}'");
            }

            eventRepository.Remove(Event);

            await eventRepository.SaveChangesAsync(cancellationToken);
        }

        public async Task<UserParticipantDto> AddParticipant(int eventId, ParticipantInput input, int ownerUserId, CancellationToken cancellationToken)
        {
            var user = await userRepository.GetById(input.UserId, cancellationToken);

            if (user == null)
                throw new AppException($"No user with id {input.UserId} exist. Cant add this participant to the Event");

            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event.OwnerUserId != ownerUserId)
            {
                throw new AppException($"Cant add participant to Event because the current user is not the owner of this Event");
            }

            var participant = @event.AddParticipant(input);

            await eventRepository.SaveChangesAsync(cancellationToken);

            return participantMapper.MapParticipantFromUser(participant.Id, user);
        }

        public async Task<EventDetailDto> RemoveParticipant(int eventId, int participantId, int ownerUserId, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event.RemoveParticipant(participantId, ownerUserId))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            return await eventMapper.Map(@event, cancellationToken);
        }

        public async Task<ActivityListingDto> AddActivity(ActivityInput input, CancellationToken cancellationToken)
        {
            var exist = await userRepository.Exists(input.OwnerUserId, cancellationToken);

            if (!exist)
                throw new AppException($"No user with id {input.OwnerUserId} exist. Cant add an activity for a owner user that does not exist to this Event");

            var Event = await eventRepository.GetById(input.EventId, cancellationToken);

            var activity = Event.AddActivity(input);

            await eventRepository.SaveChangesAsync(cancellationToken);

            return activityMapper.MapActivity(activity);
        }

        public async Task<ActivityListingDto> UpdateActivity(int eventId, ActivityUpdateInput input, CancellationToken cancellationToken)
        {
            var Event = await eventRepository.GetById(eventId, cancellationToken);

            if (Event.UpdateActivity(input))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            var activity = Event.Activities.FirstOrDefault(x => x.Id == input.ActivityId);

            if (activity == null)
                return null;

            return activityMapper.MapActivity(activity);
        }

        public async Task<ActivityListingDto> MarkComplete(int eventId, int activityId, CancellationToken cancellationToken)
        {
            var Event = await eventRepository.GetById(eventId, cancellationToken);

            var activity = Event.Activities.FirstOrDefault(x => x.Id == activityId);

            if (activity == null)
                return null;

            activity.SetCompleted(DateTime.Now);

            await eventRepository.SaveChangesAsync(cancellationToken);

            return activityMapper.MapActivity(activity);
        }

        public async Task<ActivityListingDto> MarkUnComplete(int eventId, int activityId, CancellationToken cancellationToken)
        {
            var Event = await eventRepository.GetById(eventId, cancellationToken);

            var activity = Event.Activities.FirstOrDefault(x => x.Id == activityId);

            if (activity == null)
                return null;

            activity.SetUnCompleted();

            await eventRepository.SaveChangesAsync(cancellationToken);

            return activityMapper.MapActivity(activity);
        }

        public async Task<EventDetailDto> RemoveActivity(int eventId, int activityId, int userId, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event.RemoveActivity(activityId, userId))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            return await eventMapper.Map(@event, cancellationToken);
        }

        public async Task<ActivityListingDto> AddOrUpdateResult(int eventId, int activityId, ResultInput input, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event == null)
                throw new AppException($"Found no event with id {eventId}.");

            if (@event.AddOrUpdateActivityResult(activityId, input))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            var activity = @event.Activities.FirstOrDefault(x => x.Id == activityId);

            return activityMapper.MapActivity(activity);
        }

        public async Task<EventDetailDto> RemoveResult(int eventId, int activityId, int resultId, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event == null)
                throw new AppException($"Found no event with id {eventId}.");

            if (@event.RemoveActivityResult(activityId, resultId))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            return await eventMapper.Map(@event, cancellationToken);
        }

        public async Task<List<ActivityListingDto>> GetAllActivities(int eventId, CancellationToken cancellationToken)
        {
            var activities = await eventRepository.GetAllActivities(eventId, cancellationToken);

            return activities.Select(activity =>
            {
                return new ActivityListingDto()
                {
                    CreatedAt = activity.CreatedAt,
                    UpdatedAt = activity.UpdatedAt,
                    EventId = activity.EventId,
                    Id = activity.Id,
                    OwnerUserId = activity.OwnerUserId,
                    Title = activity.Title,
                    Results = activity.Results.Select(x => resultMapper.MapResult(eventId, x)).ToList()
                };
            }).ToList();
        }

        public async Task<ActivityDetailsDto> GetActivityById(int eventId, int activityId, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);
            var userIds = @event.Participants.Select(x => x.UserId).ToArray();
            var participantIdsByUserId = @event.Participants.ToDictionary(x => x.UserId, x => x.Id);
            var users = await userRepository.GetByIds(userIds, cancellationToken);
            var activity = await eventRepository.GetActivityById(eventId, activityId, cancellationToken);
            var resultByParticipantId = activity.Results.ToDictionary(key => key.ParticipantId);

            if (activity != null)
            {
                var participants = new List<ActivityDetailsParticipant>();

                foreach (var user in users)
                {
                    var participantId = participantIdsByUserId[user.Id];
                    var result = resultByParticipantId.ContainsKey(participantId) ? resultByParticipantId[participantId] : null;
                    var participant = activityMapper.MapActivityDetailsParticipant(@event.Id, participantId, user, result);

                    participants.Add(participant);
                }

                return new ActivityDetailsDto()
                {
                    CreatedAt = activity.CreatedAt,
                    UpdatedAt = activity.UpdatedAt,
                    EventId = activity.EventId,
                    Id = activity.Id,
                    OwnerUserId = activity.OwnerUserId,
                    Title = activity.Title,
                    CompletedOn = activity.CompletedOn,
                    Participants = participants.OrderBy(x => x.Participant.FirstName).ToList(),
                };
            }

            return null;
        }

        public async Task<UserParticipantDto> GetParticipantById(int eventId, int participantId, CancellationToken cancellationToken)
        {
            var participant = await eventRepository.GetParticipantById(eventId, participantId, cancellationToken);

            if (participant != null)
            {
                var user = await userRepository.GetById(participant.UserId, cancellationToken);

                if (user != null)
                {
                    return participantMapper.MapParticipantFromUser(participant.Id, user);
                }
            }

            return null;
        }

        public async Task<List<UserParticipantDto>> GetAllParticipants(int eventId, CancellationToken cancellationToken)
        {
            var participants = await eventRepository.GetAllParticipants(eventId, cancellationToken);

            var ids = participants.Select(x => x.UserId).ToArray();

            var users = await userRepository.GetByIds(ids, cancellationToken);

            var participantsByUserId = participants.ToDictionary(x => x.UserId);

            return users.Select(user => participantMapper.MapParticipantFromUser(participantsByUserId[user.Id].Id, user)).ToList();
        }

        public async Task<ResultDto> GetResultById(int eventId, int activityId, int resultId, CancellationToken cancellationToken)
        {
            var result = await eventRepository.GetResultById(eventId, activityId, resultId, cancellationToken);

            if (result != null)
            {
                return resultMapper.MapResult(eventId, result);
            }

            return null;
        }

        public async Task<ResultDto> GetResultByParticipantId(int eventId, int activityId, int participantId, CancellationToken cancellationToken)
        {
            var result = await eventRepository.GetResultByParticipantId(eventId, activityId, participantId, cancellationToken);

            if (result != null)
            {
                return resultMapper.MapResult(eventId, result);
            }

            return null;
        }

        public async Task<List<ResultDto>> GetAllResults(int eventId, int activityId, CancellationToken cancellationToken)
        {
            var results = await eventRepository.GetAllResultsForActivity(eventId, activityId, cancellationToken);

            return results.Select(x => resultMapper.MapResult(eventId, x)).ToList();
        }

        public async Task<ScoreboardSummaryDto> GetScoreboardSummary(int eventId, int currentUserId, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event == null)
                return null;

            if (@event.OwnerUserId != currentUserId && !@event.Participants.Any(x => x.UserId == currentUserId))
                throw new AppException($"Current user does not have access to the event.");

            var ids = @event.Participants.Select(x => x.UserId).ToArray();

            var users = await userRepository.GetByIds(ids, cancellationToken);

            var usersById = users.ToDictionary(x => x.Id);

            var results = await eventRepository.GetAllResultsForEvent(eventId, cancellationToken);

            var totalScoreByUserId = results
                .GroupBy(x => x.ParticipantId)
                .ToDictionary(x => x.Key, value => value.Sum(u => u.Score));

            var participantResults = eventMapper.MapParticipantResults(@event);

            var participantResultsByParticipantId = participantResults.ToDictionary(x => x.Id);


            return new ScoreboardSummaryDto()
            {
                EventId = eventId,
                Results = @event.Participants.Select(x =>
                {
                    double score = 0;
                    var participantId = x.Id;

                    if (totalScoreByUserId.ContainsKey(participantId))
                    {
                        score = totalScoreByUserId[participantId];
                    }

                    ParticipantResult result;

                    if (participantResultsByParticipantId.ContainsKey(participantId))
                    {
                        result = participantResultsByParticipantId[participantId];
                    }
                    else
                    {
                        result = new ParticipantResult()
                        {
                            Id = participantId,
                            TotalScore = 0,
                            EventPlacement = null
                        };
                    }

                    return new ScoreboardSummaryResultDto()
                    {
                        Participant = eventMapper.MapParticipantFromUser(usersById[x.UserId], result),
                        TotalScoreSum = score
                    };

                }).ToList()
            };
        }
    }
}
