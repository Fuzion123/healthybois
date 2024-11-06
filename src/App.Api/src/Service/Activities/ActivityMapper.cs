using Domain.Events;
using Domain.Users;
using Service.Events.Models;
using Service.Results;

namespace Service.Activities
{
		public class ActivityMapper
		{
				private readonly PictureService pictureService;
				private readonly ResultMapper resultMapper;

				public ActivityMapper(PictureService pictureService, ResultMapper resultMapper)
				{
						this.pictureService = pictureService;
						this.resultMapper = resultMapper;
				}

				public ActivityListingDto MapActivity(Activity activity)
				{
						if (activity == null)
								return null;

						return new ActivityListingDto()
						{
								Id = activity.Id,
								Title = activity.Title,
								CreatedAt = activity.CreatedAt,
								EventId = activity.EventId,
								OwnerUserId = activity.OwnerUserId,
								UpdatedAt = activity.UpdatedAt,
								CompletedOn = activity.CompletedOn,
								Results = activity.Results.Select(y => resultMapper.MapResult(activity.EventId, y)).ToList()
						};
				}

				public ActivityDetailsParticipant MapActivityDetailsParticipant(int eventId, int particiopantId, User user, Result result)
				{
						return new ActivityDetailsParticipant()
						{
								Participant = MapParticipantFromUser(particiopantId, user),
								Result = resultMapper.MapResult(eventId, result)
						};
				}

				public EventUserParticipantDto MapParticipantFromUser(int partipantId, User user)
				{
						if (user == null)
								return null;

						return new EventUserParticipantDto()
						{
								Id = partipantId,
								Email = user.Email,
								UserName = user.UserName,
								FirstName = user.FirstName,
								LastName = user.LastName,
								UserId = user.Id,
								ProfilePictureUrl = pictureService.GetPicture(user.ProfilePictureId)
						};
				}
		}
}
