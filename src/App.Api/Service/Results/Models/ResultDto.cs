namespace Service.Results.Models
{
    public class ResultDto
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public int ActivityId { get; set; }
        public int ParticipantId { get; set; }
        public double Score { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}