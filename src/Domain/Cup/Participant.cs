
using Domain.Cup.Input;

namespace Domain.Cup
{
    public class Participant
    {
        public int Id { get; private set; }
        public int CupId { get; private set; }
        public int UserId { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        private Participant()
        {
        }

        public Participant(int cupId, ParticipantInput input) : base()
        {
            if (input is null)
            {
                throw new ArgumentNullException(nameof(input));
            }
        
            UserId = input.UserId;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = CreatedAt;
            CupId = cupId;
        }
    }
}
