using Domain.Events;

namespace Service.Events.Models
{
    public class EventDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public bool EventIsActive { get; set; }
        public List<ParticipantDto> Participants { get; set; }
        public List<ActivityDto> Activities { get; set; }
    }
}