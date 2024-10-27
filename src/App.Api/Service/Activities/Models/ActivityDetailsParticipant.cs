using Service.Results.Models;

namespace Service.Events.Models
{
    public class ActivityDetailsParticipant
    {
        public EventUserParticipantDto Participant { get; set; }
        public ResultDto Result { get; set; }
    }
}
