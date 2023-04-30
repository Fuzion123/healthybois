using AutoMapper;
using Domain.Events;
using Domain.Events.Input;
using Domain.Users;
using Service.Events.Models;
using Service.Exceptions;

namespace Service.Events
{
    public class EventService
    {
        private readonly IEventRepository EventRepository;
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public EventService(IEventRepository EventRepository, IUserRepository userRepository, IMapper mapper)
        {
            this.EventRepository = EventRepository;
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        public async Task<EventDto> Create(int EventOwner, EventInput EventInput, CancellationToken cancellationToken)
        {
            if (EventInput == null) throw new AppException("EventInput was null");

            if (string.IsNullOrEmpty(EventInput.Title)) throw new AppException("Title on Event cant be null or empty");

            if (await EventRepository.Exists(EventInput.Title, cancellationToken))
                throw new AppException($"Event with title {EventInput.Title} already exists");

            var Event = new Event(EventOwner, EventInput);

            EventRepository.Add(Event);

            await EventRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<EventDto>(Event);
        }

        public async Task<List<EventDto>> GetAllEventsReferencedByUser(int userId, CancellationToken cancellationToken)
        {
            var Events = await EventRepository.GetAllReferencedEvents(userId, cancellationToken);

            return Events.Select(x => mapper.Map<EventDto>(x)).ToList();
        }

        public async Task<EventDto> GetByTitle(string title, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(title))
            {
                throw new ArgumentException($"'{nameof(title)}' cannot be null or empty.", nameof(title));
            }

            var Event = await EventRepository.GetByTitle(title, cancellationToken);

            return mapper.Map<EventDto>(Event);
        }

        public async Task<EventDto> GetById(int EventId, int userId, CancellationToken cancellationToken)
        {
            var Event = await EventRepository.GetById(EventId, cancellationToken);

            if (Event == null)
                return null;

            if (Event.OwnerUserId == userId || Event.Participants.Any(x => x.UserId == userId))
                return mapper.Map<EventDto>(Event);

            throw new AppException($"Current user does not have access to Event with id {EventId}");
        }

        public async Task Remove(int EventId, int ownerUserId, CancellationToken cancellationToken)
        {
            var Event = await EventRepository.GetById(EventId, cancellationToken);

            if (Event == null)
                return;

            if (Event.OwnerUserId != ownerUserId)
            {
                throw new AppException($"Cant remove Event because the current user is not the owner of Event with id '{EventId}'");
            }

            EventRepository.Remove(Event);

            await EventRepository.SaveChangesAsync(cancellationToken);
        }

        public async Task<EventDto> AddParticipant(int EventId, ParticipantInput input, int ownerUserId, CancellationToken cancellationToken)
        {
            var exist = await userRepository.Exists(input.UserId, cancellationToken);

            if (!exist)
                throw new AppException($"No user with id {input.UserId} exist. Cant add this participant to the Event");

            var Event = await EventRepository.GetById(EventId, cancellationToken);

            if (Event.OwnerUserId != ownerUserId)
            {
                throw new AppException($"Cant add participant to Event because the current user is not the owner of this Event");
            }

            Event.AddParticipant(input);

            await EventRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<EventDto>(Event);
        }

        public async Task<EventDto> RemoveParticipant(int EventId, ParticipantInput input, int ownerUserId, CancellationToken cancellationToken)
        {
            var Event = await EventRepository.GetById(EventId, cancellationToken);

            Event.RemoveParticipant(input, ownerUserId);

            await EventRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<EventDto>(Event);
        }

        public async Task<EventDto> AddActivity(ActivityInput input, CancellationToken cancellationToken)
        {
            var exist = await userRepository.Exists(input.OwnerUserId, cancellationToken);

            if (!exist)
                throw new AppException($"No user with id {input.OwnerUserId} exist. Cant add an activity for a owner user that does not exist to this Event");

            var Event = await EventRepository.GetById(input.EventId, cancellationToken);

            Event.AddActivity(input);

            await EventRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<EventDto>(Event);
        }

        public async Task<EventDto> RemoveActivity(ActivityInput input, CancellationToken cancellationToken)
        {
            var Event = await EventRepository.GetById(input.EventId, cancellationToken);

            Event.RemoveActivity(input);

            await EventRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<EventDto>(Event);
        }

        public async Task<EventDto> AddOrUpdateResult(ResultInput input, CancellationToken cancellationToken)
        {
            var exist = await userRepository.Exists(input.ParticipantId, cancellationToken);

            if (!exist)
                throw new AppException($"No user with id {input.ParticipantId} exist. Cant add a result to an activity for a owner user that does not exist to this Event");

            var Event = await EventRepository.GetById(input.EventId, cancellationToken);

            if (Event == null)
                throw new AppException($"Found no event with id {input.EventId}. Cant add result");

            var activity = Event.Activities.FirstOrDefault(x => x.Id == input.ActivityId);

            if (activity == null)
                throw new AppException($"Found no activity with id {input.ActivityId} on event with id {input.EventId}. Cant add result");

            activity.AddOrUpdateResult(input);

            await EventRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<EventDto>(Event);
        }

        public async Task<EventDto> RemoveResult(ResultRemoveInput input, CancellationToken cancellationToken)
        {
            var Event = await EventRepository.GetById(input.EventId, cancellationToken);

            if (Event == null)
                throw new AppException($"Found no event with id {input.EventId}. Cant remove result");

            var activity = Event.Activities.FirstOrDefault(x => x.Id == input.ActivityId);

            if (activity == null)
                throw new AppException($"Found no activity with id {input.ActivityId} on event with id {input.EventId}. Cant add result");

            activity.RemoveResult(input);

            await EventRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<EventDto>(Event);
        }
    }
}
