
namespace Service.Events.Models
{
    public class EventListingDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public Uri EventPictureUrl { get; set; }
        public bool Completed => DateTime.Now > EndsAt;
        public bool Active => DateTime.Now >= StartsAt && DateTime.Now < EndsAt;
        public bool Upcoming => DateTime.Now < StartsAt;
    }
}