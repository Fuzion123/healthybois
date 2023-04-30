using System.ComponentModel.DataAnnotations;

namespace Domain.Events.Input
{
    public class EventInput
    {
        public string Title { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
    }
}