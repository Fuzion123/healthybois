
namespace Service.Events.Models
{
    public class ActivityListingDto
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public int OwnerUserId { get; set; }
        public string Title { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? CompletedOn { get; set; }
        public List<ResultDto> Results { get; set; }
    }
}