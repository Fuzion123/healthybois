namespace Domain.Events.Input
{
    public class ResultInput
    {
        public int EventId { get; set; }
        public int ActivityId { get; set; }
        public int ParticipantId { get; set; }
        public double Score { get; set; }
    }
}
