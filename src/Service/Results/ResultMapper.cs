using Domain.Events;
using Service.Results.Models;

namespace Service.Results
{
    public class ResultMapper
    {
        public ResultMapper()
        {

        }

        public ResultDto MapResult(int eventId, Result result)
        {
            if (result == null)
                return null;

            return new ResultDto()
            {
                Id = result.Id,
                Score = result.Score,
                EventId = eventId,
                ActivityId = result.ActivityId,
                CreatedAt = result.CreatedAt,
                UpdatedAt = result.UpdatedAt,
                ParticipantId = result.ParticipantId
            };
        }
    }
}
