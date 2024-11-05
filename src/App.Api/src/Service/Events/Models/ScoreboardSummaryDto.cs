
namespace Service.Events.Models
{
		public class ScoreboardSummaryDto
		{
				public int EventId { get; set; }
				public List<ScoreboardSummaryResultDto> Results { get; set; }
				public List<string> ActivityNames { get; set; }
		}
}
