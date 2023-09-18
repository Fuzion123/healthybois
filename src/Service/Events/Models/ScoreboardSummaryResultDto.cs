
namespace Service.Events.Models
{
    public class ScoreboardSummaryResultDto
    {
        public EventUserParticipantDto Participant { get; set; }
        public double TotalScoreSum { get; set; }
    }
}
