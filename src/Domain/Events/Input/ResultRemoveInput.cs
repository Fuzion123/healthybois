
namespace Domain.Events.Input
{
    public class ResultRemoveInput
    {
        public int EventId { get; set; }
        public int ActivityId { get; set; }
        public int ResultId { get; set; }
    }
}
