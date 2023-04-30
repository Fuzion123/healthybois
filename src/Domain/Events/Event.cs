using Domain.Events.Input;
using Domain.Exceptions;

namespace Domain.Events
{
    public class Event
    {
        public int Id { get; private set; }
        public string Title { get; private set; }
        public int OwnerUserId { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }
        public DateTime StartsAt { get; private set; }
        public DateTime EndsAt { get; private set; }
        public bool EventIsActive => DateTime.UtcNow >= StartsAt && DateTime.UtcNow >= EndsAt;

        private readonly List<Participant> _participants;
        public IReadOnlyList<Participant> Participants => _participants.AsReadOnly();

        public Event()
        {
            _participants = new List<Participant>();
        }

        public Event(int EventOwner, EventInput input) : this()
        {
            if (input is null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            if (string.IsNullOrEmpty(input.Title))
            {
                throw new ArgumentException($"'{nameof(input.Title)}' cannot be null or empty.", nameof(input.Title));
            }

            Title = input.Title;
            StartsAt = input.StartsAt;
            EndsAt = input.EndsAt;
            OwnerUserId = EventOwner;
            AddParticipant(new ParticipantInput() { UserId = OwnerUserId }); // add the owner as the first participant as default. (can be removed after again).
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = CreatedAt;
        }

        public bool Update(EventInput input)
        {
            if (input is null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            var updated = false;

            if (Title != input.Title)
            {
                Title = input.Title;

                updated = true;
            }

            if (updated)
            {
                UpdatedAt = DateTime.UtcNow;
            }

            return updated;
        }

        public void AddParticipant(ParticipantInput input)
        {
            if (input is null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            if (_participants.Any(x => x.UserId == input.UserId))
            {
                throw new DomainException($"User with id {input.UserId} already exists as participant on Event {Title}");
            }

            _participants.Add(new Participant(Id, input));

            UpdatedAt = DateTime.UtcNow;
        }

        public bool RemoveParticipant(ParticipantInput input)
        {
            var removed = false;

            if (input is null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            var p = _participants.FirstOrDefault(x => x.UserId == input.UserId);

            if (p != null)
            {
                removed = true;

                _participants.Remove(p);

                UpdatedAt = DateTime.UtcNow;
            }

            return removed;
        }
    }
}
