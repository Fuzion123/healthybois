namespace Service.Participants.Models
{
    public class UserParticipantDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public Uri ProfilePictureUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
    }
}
