using Domain.Pictures.Inputs;

namespace Domain.Events.Input
{
    public class EventInput
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public PictureInput Picture { get; set; }
        public List<ParticipantInput> Participants { get; set; } = new List<ParticipantInput>();
    }
}