using Domain.Events.Input;
using Domain.Exceptions;

namespace Domain.Events
{
    public class Event
    {
        public int Id { get; private set; }
        public string Title { get; private set; }
        public string Description { get; private set; }
        public int OwnerUserId { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }
        public DateTime StartsAt { get; private set; }
        public DateTime EndsAt { get; private set; }
        public string EventPictureId { get; private set; }
        private readonly List<Participant> _participants;
        public IReadOnlyList<Participant> Participants => _participants.AsReadOnly();

        private readonly List<Activity> _activities;
        public IReadOnlyList<Activity> Activities => _activities.AsReadOnly();

        public Event()
        {
            _participants = new List<Participant>();
            _activities = new List<Activity>();
        }

        public Event(int EventOwner, EventInput input, string pictureId) : this()
        {
            if (input is null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            if (string.IsNullOrEmpty(input.Title))
            {
                throw new ArgumentException($"'{nameof(input.Title)}' cannot be null or empty.", nameof(input.Title));
            }

            if (input.EndsAt <= input.StartsAt)
            {
                throw new DomainException("End date needs to be after start date");
            }

            Title = input.Title;
            Description = input.Description;
            StartsAt = input.StartsAt;
            EndsAt = input.EndsAt;
            OwnerUserId = EventOwner;

            input.Participants.Add(new ParticipantInput() { UserId = OwnerUserId }); // add the owner as the first participant as default. (can be removed after again).

            if (input.Participants.Count > 0)
            {
                foreach (var p in input.Participants.GroupBy(x => x.UserId).Select(i => i.First()))
                {
                    AddParticipant(new ParticipantInput() { UserId = p.UserId });
                }
            }

            CreatedAt = DateTime.Now;
            UpdatedAt = CreatedAt;
            EventPictureId = pictureId;
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

            if (Description != input.Description)
            {
                Description = input.Description;

                updated = true;
            }

            var inputParticipantUserIds = input.Participants.Select(x => x.UserId).ToArray();
            var existingParticipantUserIds = Participants.Select(x => x.UserId).ToList();

            var newParticipants = input.Participants.Where(x => !existingParticipantUserIds.Contains(x.UserId));
            var removes = existingParticipantUserIds.Where(x => !inputParticipantUserIds.Contains(x));

            if (removes.Any())
            {
                updated = true;
            }

            _participants.RemoveAll(x => removes.Contains(x.UserId));

            foreach (var add in newParticipants)
            {
                AddParticipant(add);

                updated = true;
            }

            if (updated)
            {
                UpdatedAt = DateTime.Now;
            }

            return updated;
        }

        public Participant AddParticipant(ParticipantInput input)
        {
            if (input is null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            if (_participants.Any(x => x.UserId == input.UserId))
            {
                throw new DomainException($"User with id {input.UserId} already exists as participant on Event {Title}");
            }

            var participant = new Participant(Id, input);

            _participants.Add(participant);

            UpdatedAt = DateTime.Now;

            return participant;
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

                UpdatedAt = DateTime.Now;
            }

            return removed;
        }

        public Activity AddActivity(ActivityInput input)
        {
            if (input is null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            if (_activities.Any(x => x.Title == input.Title))
            {
                throw new DomainException($"Activity with title {input.Title} already exists on Event {Title}");
            }

            var activity = new Activity(input);

            _activities.Add(activity);

            UpdatedAt = DateTime.Now;

            return activity;
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
                UpdatedAt = DateTime.Now;

                return true;
            }

            return false;
        }

        public bool RemoveActivity(int activityId, int userId)
        {
            var removed = false;

            var a = _activities.FirstOrDefault(x => x.Id == activityId);

            if (a.OwnerUserId != userId)
            {
                throw new DomainException($"Cant remove Activity from this Event, because the current user is not the owner of this Event");
            }

            if (a != null)
            {
                removed = true;

                _activities.Remove(a);

                UpdatedAt = DateTime.Now;
            }

            return removed;
        }

        public bool AddOrUpdateActivityResult(int activityId, ResultInput resultInput)
        {
            var activity = _activities.FirstOrDefault(x => x.Id == activityId);

            if (activity == null)
                throw new DomainException($"Found no activity with id {activityId} on event with id {Id}.");

            if (!_participants.Any(x => x.Id == resultInput.ParticipantId))
            {
                throw new DomainException($"No Participant found on the event with that id");
            }

            return activity.AddOrUpdateResult(resultInput);
        }

        public bool RemoveActivityResult(int activityId, int resultId)
        {
            var activity = _activities.FirstOrDefault(x => x.Id == activityId);

            if (activity == null)
                throw new DomainException($"Found no activity with id {activityId} on event with id {Id}.");

            return activity.RemoveResult(resultId);
        }

        public bool SetOrUpdatePicture(string eventPictureId)
        {
            if (EventPictureId != eventPictureId)
            {
                EventPictureId = eventPictureId;
                UpdatedAt = DateTime.Now;
                return true;
            }

            return false;
        }
    }
}
