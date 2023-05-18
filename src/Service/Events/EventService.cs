using AutoMapper;
using Domain.Events;
using Domain.Events.Input;
using Domain.Users;
using Microsoft.Data.SqlClient.DataClassification;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Service.Events.Models;
using Service.Exceptions;
using System.Diagnostics;

namespace Service.Events
{
    public class EventService
    {
        private readonly IEventRepository eventRepository;
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public EventService(IEventRepository EventRepository, IUserRepository userRepository, IMapper mapper)
        {
            this.eventRepository = EventRepository;
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        public async Task<EventDto> Create(int EventOwner, EventInput EventInput, CancellationToken cancellationToken)
        {
            if (EventInput == null) throw new AppException("EventInput was null");

            if (string.IsNullOrEmpty(EventInput.Title)) throw new AppException("Title on Event cant be null or empty");

            if (await eventRepository.Exists(EventInput.Title, cancellationToken))
                throw new AppException($"Event with title {EventInput.Title} already exists");

            var Event = new Event(EventOwner, EventInput);

            eventRepository.Add(Event);

            await eventRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<EventDto>(Event);
        }

        public async Task<List<EventDto>> GetAllEventsReferencedByUser(int userId, CancellationToken cancellationToken)
        {
            var Events = await eventRepository.GetAllReferencedEvents(userId, cancellationToken);

            return Events.Select(x => mapper.Map<EventDto>(x)).ToList();
        }

        public async Task<EventDto> GetByTitle(string title, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(title))
            {
                throw new ArgumentException($"'{nameof(title)}' cannot be null or empty.", nameof(title));
            }

            var Event = await eventRepository.GetByTitle(title, cancellationToken);

            return mapper.Map<EventDto>(Event);
        }

        public async Task<EventDto> GetById(int EventId, int userId, CancellationToken cancellationToken)
        {
            var Event = await eventRepository.GetById(EventId, cancellationToken);

            if (Event == null)
                return null;

            if (Event.OwnerUserId == userId || Event.Participants.Any(x => x.UserId == userId))
                return mapper.Map<EventDto>(Event);

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

        public async Task<EventDto> AddParticipant(int eventId, ParticipantInput input, int ownerUserId, CancellationToken cancellationToken)
        {
            var exist = await userRepository.Exists(input.UserId, cancellationToken);

            if (!exist)
                throw new AppException($"No user with id {input.UserId} exist. Cant add this participant to the Event");

            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event.OwnerUserId != ownerUserId)
            {
                throw new AppException($"Cant add participant to Event because the current user is not the owner of this Event");
            }

            @event.AddParticipant(input);

            await eventRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<EventDto>(@event);
        }

        public async Task<EventDto> RemoveParticipant(int eventId, int participantId, int ownerUserId, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if(@event.RemoveParticipant(participantId, ownerUserId))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            return mapper.Map<EventDto>(@event);
        }

        public async Task<EventDto> AddActivity(ActivityInput input, CancellationToken cancellationToken)
        {
            var exist = await userRepository.Exists(input.OwnerUserId, cancellationToken);

            if (!exist)
                throw new AppException($"No user with id {input.OwnerUserId} exist. Cant add an activity for a owner user that does not exist to this Event");

            var Event = await eventRepository.GetById(input.EventId, cancellationToken);

            Event.AddActivity(input);

            await eventRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<EventDto>(Event);
        }

        public async Task<EventDto> UpdateActivity(int eventId, ActivityUpdateInput input, CancellationToken cancellationToken)
        {
            var Event = await eventRepository.GetById(eventId, cancellationToken);

            if (Event.UpdateActivity(input))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            return mapper.Map<EventDto>(Event);
        }

        public async Task<EventDto> RemoveActivity(int eventId, int activityId, int userId, CancellationToken cancellationToken)
        {
            var Event = await eventRepository.GetById(eventId, cancellationToken);

            if(Event.RemoveActivity(activityId, userId))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            return mapper.Map<EventDto>(Event);
        }

        public async Task<EventDto> AddOrUpdateResult(int eventId, int activityId, ResultInput input, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event == null)
                throw new AppException($"Found no event with id {eventId}.");

            if(@event.AddOrUpdateActivityResult(activityId, input))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            return mapper.Map<EventDto>(@event);
        }

        public async Task<EventDto> RemoveResult(int eventId, int activityId, int resultId, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event == null)
                throw new AppException($"Found no event with id {eventId}.");

            if(@event.RemoveActivityResult(activityId, resultId))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            return mapper.Map<EventDto>(@event);
        }

        public async Task<List<ActivityDto>> GetAllActivities(int eventId, CancellationToken cancellationToken)
        {
            var activities = await eventRepository.GetAllActivities(eventId, cancellationToken);

            return activities.Select(activity =>
            {
                return new ActivityDto()
                {
                    CreatedAt = activity.CreatedAt,
                    UpdatedAt = activity.UpdatedAt,
                    EventId = activity.EventId,
                    Id = activity.Id,
                    OwnerUserId = activity.OwnerUserId,
                    Title = activity.Title,
                    Results = activity.Results.Select(x => new ResultDto()
                    {
                        Id = x.Id,
                        ActivityId = x.ActivityId,
                        CreatedAt = x.CreatedAt,
                        ParticipantId = x.ParticipantId,
                        Score = x.Score,
                        UpdatedAt = x.UpdatedAt
                    }).ToList()
                };
            }).ToList(); 
        }

        public async Task<ActivityDto> GetActivityById(int eventId, int activityId, CancellationToken cancellationToken)
        {
            var activity = await eventRepository.GetActivityById(eventId, activityId, cancellationToken);

            if (activity != null)
                return new ActivityDto()
                {
                    CreatedAt = activity.CreatedAt,
                    UpdatedAt = activity.UpdatedAt,
                    EventId = activity.EventId,
                    Id = activity.Id,
                    OwnerUserId = activity.OwnerUserId,
                    Title = activity.Title,
                    Results = activity.Results.Select(x => new ResultDto()
                    {
                        Id = x.Id,
                        ActivityId = x.ActivityId,
                        CreatedAt = x.CreatedAt,
                        ParticipantId = x.ParticipantId,
                        Score = x.Score,
                        UpdatedAt = x.UpdatedAt 
                    }).ToList()
                };

            return null;
        }

        public async Task<ParticipantDto> GetParticipantById(int eventId, int participantId, CancellationToken cancellationToken)
        {
            var participant = await eventRepository.GetParticipantById(eventId, participantId, cancellationToken);

            if (participant != null)
                return new ParticipantDto()
                {
                    UserId = participant.UserId
                };

            return null;
        }

        public async Task<List<ParticipantDto>> GetAllParticipants(int eventId, CancellationToken cancellationToken)
        {
            var participants = await eventRepository.GetAllParticipants(eventId, cancellationToken);

            return participants.Select(x => new ParticipantDto()
            {
                UserId = x.UserId,
            }).ToList();
        }

        public async Task<ResultDto> GetResultById(int eventId, int activityId, int resultId, CancellationToken cancellationToken)
        {
            var result = await eventRepository.GetResultById(eventId, activityId, resultId, cancellationToken);

            if (result != null)
                return new ResultDto()
                {
                    ActivityId = result.ActivityId,
                    CreatedAt = result.CreatedAt,
                    UpdatedAt = result.UpdatedAt,
                    Id = result.Id,
                    ParticipantId = result.ParticipantId,
                    Score = result.Score
                };

            return null;
        }

        public async Task<ResultDto> GetResultByParticipantId(int eventId, int activityId, int participantId, CancellationToken cancellationToken)
        {
            var result = await eventRepository.GetResultByParticipantId(eventId, activityId, participantId, cancellationToken);

            if (result != null)
                return new ResultDto()
                {
                    ActivityId = result.ActivityId,
                    CreatedAt = result.CreatedAt,
                    UpdatedAt = result.UpdatedAt,
                    Id = result.Id,
                    ParticipantId = result.ParticipantId,
                    Score = result.Score
                };

            return null;
        }

        public async Task<List<ResultDto>> GetAllResults(int eventId, int activityId, CancellationToken cancellationToken)
        {
            var results = await eventRepository.GetAllResults(eventId, activityId, cancellationToken);

            return results.Select(x => new ResultDto()
            {
               Score = x.Score,
               ParticipantId = x.ParticipantId,
               Id = x.Id,
               UpdatedAt = x.UpdatedAt,
               CreatedAt = x.CreatedAt,
               ActivityId = x.ActivityId    
            }).ToList();
        }
    }
}
