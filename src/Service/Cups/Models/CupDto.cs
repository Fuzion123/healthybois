namespace Service.Cups.Models
{
    public class CupDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public List<ParticipantDto> Participants { get; set; }
    }
}
