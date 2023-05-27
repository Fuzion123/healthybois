
namespace Service.Events.Models
{
    public class EventOwnerDto
    {
        public int Id { get; set; }
        public Uri ProfilePictureUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
    }
}
