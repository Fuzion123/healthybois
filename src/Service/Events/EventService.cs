﻿using AutoMapper;
using Domain.Events;
using Domain.Events.Input;
using Domain.Pictures.Inputs;
using Domain.Users;
using Microsoft.Extensions.Logging;
using Service.Events.Mappers;
using Service.Events.Models;
using Service.Exceptions;

namespace Service.Events
{
    public class EventService
    {
        private readonly IEventRepository eventRepository;
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;
        private readonly PictureService pictureService;
        private readonly EventMapper eventMapper;

        public EventService(IEventRepository EventRepository,
                            IUserRepository userRepository,
                            IMapper mapper,
                            PictureService pictureService,
                            EventMapper eventMapper)
        {
            this.eventRepository = EventRepository;
            this.userRepository = userRepository;
            this.mapper = mapper;
            this.pictureService = pictureService;
            this.eventMapper = eventMapper;
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

            return Events.Select(async x => await eventMapper.Map(x, cancellationToken)).Select(x => x.Result).ToList();
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

        public async Task<ParticipantDto> AddParticipant(int eventId, ParticipantInput input, int ownerUserId, CancellationToken cancellationToken)
        {
            var exist = await userRepository.Exists(input.UserId, cancellationToken);

            if (!exist)
                throw new AppException($"No user with id {input.UserId} exist. Cant add this participant to the Event");

            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event.OwnerUserId != ownerUserId)
            {
                throw new AppException($"Cant add participant to Event because the current user is not the owner of this Event");
            }

            var participant = @event.AddParticipant(input);

            await eventRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<ParticipantDto>(participant);
        }

        public async Task<EventDetailDto> RemoveParticipant(int eventId, int participantId, int ownerUserId, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if(@event.RemoveParticipant(participantId, ownerUserId))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            return mapper.Map<EventDetailDto>(@event);
        }

        public async Task<ActivityDto> AddActivity(ActivityInput input, CancellationToken cancellationToken)
        {
            var exist = await userRepository.Exists(input.OwnerUserId, cancellationToken);

            if (!exist)
                throw new AppException($"No user with id {input.OwnerUserId} exist. Cant add an activity for a owner user that does not exist to this Event");

            var Event = await eventRepository.GetById(input.EventId, cancellationToken);

            var activity = Event.AddActivity(input);

            await eventRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<ActivityDto>(activity);
        }

        public async Task<ActivityDto> UpdateActivity(int eventId, ActivityUpdateInput input, CancellationToken cancellationToken)
        {
            var Event = await eventRepository.GetById(eventId, cancellationToken);

            if (Event.UpdateActivity(input))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            var activity = Event.Activities.Where(x => x.Id == input.ActivityId);

            if (activity == null)
                return null;

            return mapper.Map<ActivityDto>(activity);
        }

        public async Task<EventDetailDto> RemoveActivity(int eventId, int activityId, int userId, CancellationToken cancellationToken)
        {
            var Event = await eventRepository.GetById(eventId, cancellationToken);

            if(Event.RemoveActivity(activityId, userId))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            return mapper.Map<EventDetailDto>(Event);
        }

        public async Task<ActivityDto> AddOrUpdateResult(int eventId, int activityId, ResultInput input, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event == null)
                throw new AppException($"Found no event with id {eventId}.");

            if(@event.AddOrUpdateActivityResult(activityId, input))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            var activity = @event.Activities.Where(x => x.Id == activityId);

            return mapper.Map<ActivityDto>(activity);
        }

        public async Task<EventDetailDto> RemoveResult(int eventId, int activityId, int resultId, CancellationToken cancellationToken)
        {
            var @event = await eventRepository.GetById(eventId, cancellationToken);

            if (@event == null)
                throw new AppException($"Found no event with id {eventId}.");

            if(@event.RemoveActivityResult(activityId, resultId))
            {
                await eventRepository.SaveChangesAsync(cancellationToken);
            }

            return await eventMapper.Map(@event, cancellationToken);
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
            {
                var user = await userRepository.GetById(participant.UserId, cancellationToken); 

                if(user != null)
                {
                    return new ParticipantDto()
                    {
                        Email = user.Email,
                        FirstName = user.FirstName,
                        Id = user.Id,
                        LastName = user.LastName,
                        ProfilePictureUrl = pictureService.GetPicture(user.ProfilePictureId)
                    };
                }
            }

            return null;
        }

        public async Task<List<ParticipantDto>> GetAllParticipants(int eventId, CancellationToken cancellationToken)
        {
            var participants = await eventRepository.GetAllParticipants(eventId, cancellationToken);

            var ids = participants.Select(x => x.Id).ToArray();

            var users = await userRepository.GetByIds(ids, cancellationToken);

            return users.Select(x => new ParticipantDto()
            {
                Email= x.Email,
                FirstName = x.FirstName,
                Id = x.Id,
                LastName = x.LastName,
                ProfilePictureUrl = pictureService.GetPicture(x.ProfilePictureId)
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
            var results = await eventRepository.GetAllResultsForActivity(eventId, activityId, cancellationToken);

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

            return new ScoreboardSummaryDto()
            {
                EventId = eventId,
                Results = @event.Participants.Select(x =>
                {
                    double score = 0;

                    if (totalScoreByUserId.ContainsKey(x.Id))
                    {
                        score = totalScoreByUserId[x.Id];
                    }

                    return new ScoreboardSummaryResultDto()
                    {
                        Participant = eventMapper.MapParticipant(usersById[x.UserId]),
                        TotalScoreSum = score
                    };

                }).ToList()
            };
        }
    }
}
