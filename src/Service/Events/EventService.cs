using AutoMapper;
using Domain.Events;
using Domain.Events.Input;
using Domain.Users;
using Service.Cups.Models;
using Service.Exceptions;

namespace Service.Cups
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

            if (Event.OwnerUserId != ownerUserId)
            {
                throw new AppException($"Cant remove participant to Event because the current user is not the owner of this Event");
            }

            Event.RemoveParticipant(input);

            await EventRepository.SaveChangesAsync(cancellationToken);

            return mapper.Map<EventDto>(Event);
        }
    }
}
