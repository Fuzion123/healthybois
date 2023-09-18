
namespace Service.Events.Models
{
    public class EventDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public bool EventIsActive { get; set; }
        public Uri EventPictureUrl { get; set; }
        public EventOwnerDto EventOwner { get; set; }
        public List<EventUserParticipantDto> Participants { get; set; }
        public List<ActivityListingDto> Activities { get; set; }
        public decimal Progress { get; set; }
        public List<int> LeadingParticipantIds { get; set; } = new List<int>();
    }
}