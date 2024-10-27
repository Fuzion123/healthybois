namespace Domain.Events.Input
{
    public class ActivityInput
    {
        public int EventId { get; set; }
        public int OwnerUserId { get; set; }
        public string Title { get; set; }
    }
}