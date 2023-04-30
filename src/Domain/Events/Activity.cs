using Domain.Events.Input;

namespace Domain.Events
{
    public class Activity
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public int OwnerUserId { get; private set; }
        public string Title { get; set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        private readonly List<Result> _results;
        public IReadOnlyList<Result> Results => _results.AsReadOnly();

        private Activity()
        {
            _results = new List<Result>();
        }

        public Activity(ActivityInput input) : this()
        {
            if (input is null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            EventId = input.EventId;
            OwnerUserId = input.OwnerUserId;
            Title = input.Title;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = CreatedAt;
        }

        public void AddOrUpdateResult(ResultInput input)
        {
            var updated = false;

            var existing = _results.FirstOrDefault(x => x.ParticipantId == input.ParticipantId);

            if (existing != null)
            {
                if (existing.Update(input.Score))
                {
                    updated = true;
                }
            }
            else
            {
                _results.Add(new Result(input));

                updated = true;
            }

            if (updated)
            {
                UpdatedAt = DateTime.UtcNow;
            }
        }

        public void RemoveResult(ResultRemoveInput input)
        {
            var updated = false;

            var existing = _results.FirstOrDefault(x => x.Id == input.ResultId);

            if(existing != null)
            {
                _results.Remove(existing);

                updated = true;
            }

            if (updated)
            {
                UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
