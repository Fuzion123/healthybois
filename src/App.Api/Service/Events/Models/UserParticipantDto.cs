namespace Service.Events.Models
{
    public class EventUserParticipantDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public Uri ProfilePictureUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public double TotalEventScore { get; set; }
        public int? EventPlacement { get; set; }
    }
}