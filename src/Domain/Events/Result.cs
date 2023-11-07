using Domain.Events.Input;

namespace Domain.Events
{
    public class Result
    {
        public int Id { get; private set; }
        public int ActivityId { get; private set; }
        public int ParticipantId { get; private set; }
        public double Score { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        private Result()
        {
        }

        public Result(int activityId, ResultInput input) : this()
        {
            if (input is null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            ActivityId = activityId;
            ParticipantId = input.ParticipantId;
            Score = input.Score;
            CreatedAt = DateTime.Now;
            UpdatedAt = CreatedAt;
        }

        public bool Update(double score)
        {
            var updated = false;

            if (Score != score)
            {
                updated = true;

                Score = score;

                UpdatedAt = DateTime.Now;
            }

            return updated;
        }
    }
}
