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

        private readonly List<Activity> _activities;
        public IReadOnlyList<Activity> Activities => _activities.AsReadOnly();

        public Event()
        {
            _participants = new List<Participant>();
            _activities = new List<Activity>();
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

            if(input.EndsAt <= input.StartsAt)
            {
                throw new DomainException("End date needs to be after start date");
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

        public bool RemoveParticipant(int participantId, int ownerUserId)
        {
            var removed = false;

            if (OwnerUserId != ownerUserId)
            {
                throw new DomainException($"Cant remove participant to Event because the current user is not the owner of this Event");
            }

            var p = _participants.FirstOrDefault(x => x.Id == participantId);

            if (p != null)
            {
                removed = true;

                _participants.Remove(p);

                UpdatedAt = DateTime.UtcNow;
            }

            return removed;
        }

        public void AddActivity(ActivityInput input)
        {
            if (input is null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            if (_activities.Any(x => x.Title == input.Title))
            {
                throw new DomainException($"Activity with title {input.Title} already exists on Event {Title}");
            }

            _activities.Add(new Activity(input));

            UpdatedAt = DateTime.UtcNow;
        }

        public bool UpdateActivity(ActivityUpdateInput input)
        {
            if (input is null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            var activity = _activities.FirstOrDefault(x => x.Id == input.ActivityId);

            if (activity == null) 
                throw new DomainException($"Activity with id {input.ActivityId} was not found on event with id {Id}");

            if (activity.Update(input))
            {
                UpdatedAt = DateTime.UtcNow;

                return true;
            }

            return false;
        }

        public bool RemoveActivity(int activityId, int userId)
        {
            var removed = false;

            var a = _activities.FirstOrDefault(x => x.Id == activityId);

            if(a.OwnerUserId != userId)
            {
                throw new DomainException($"Cant remove Activity from this Event, because the current user is not the owner of this Event");
            }

            if (a != null)
            {
                removed = true;

                _activities.Remove(a);

                UpdatedAt = DateTime.UtcNow;
            }

            return removed;
        }

        public bool AddOrUpdateActivityResult(int activityId, ResultInput resultInput)
        {
            var activity = _activities.FirstOrDefault(x => x.Id == activityId);

            if (activity == null)
                throw new DomainException($"Found no activity with id {activityId} on event with id {Id}.");

            return activity.AddOrUpdateResult(resultInput);
        }

        public bool RemoveActivityResult(int activityId, int resultId)
        {
            var activity = _activities.FirstOrDefault(x => x.Id == activityId);

            if (activity == null)
                throw new DomainException($"Found no activity with id {activityId} on event with id {Id}.");

            return activity.RemoveResult(resultId);
        }
    }
}
