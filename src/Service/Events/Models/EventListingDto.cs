
namespace Service.Events.Models
{
    public class EventListingDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public bool EventIsActive { get; set; }
        public Uri EventPictureUrl { get; set; }
    }
}