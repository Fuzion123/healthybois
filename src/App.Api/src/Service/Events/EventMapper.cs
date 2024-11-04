using Domain.Events;
using Domain.Exceptions;
using Domain.Users;
using Service.Activities;
using Service.Events.Models;

namespace Service.Events.Mappers
{
		public class EventMapper
		{
				private readonly PictureService pictureService;
				private readonly IUserRepository userRepository;
				private readonly ActivityMapper activityMapper;

				public EventMapper(PictureService pictureService, IUserRepository userRepository, ActivityMapper activityMapper)
				{
						this.pictureService = pictureService;
						this.userRepository = userRepository;
						this.activityMapper = activityMapper;
				}

				public async Task<EventDetailDto> Map(Event @event, CancellationToken cancellationToken)
				{
						if (@event == null)
								return null;

						var ids = @event.Participants.Select(x => x.UserId).ToArray();

						var participantIdByUserId = @event.Participants.ToDictionary(k => k.UserId, v => v.Id);

						var participants = await userRepository.GetByIds(ids, cancellationToken);

						var owner = participants.FirstOrDefault(x => x.Id == @event.OwnerUserId) ?? throw new DomainException("No owner found on event");

						var activityCount = @event.Activities.Count();

						var activityCompleted = @event.Activities.Where(x => x.CompletedOn != null).Count();

						var progress = activityCount == 0 ? 0 : ((decimal)activityCompleted / (decimal)activityCount) * 100;

						var participantResults = MapParticipantResults(@event);

						var lastPlacement = GetLastPlacement(participantResults);

						var participantResultsByParticipantId = participantResults.ToDictionary(x => x.Id);

						var leads = MapLeadingParticipantIds(participantResults);

						return new EventDetailDto()
						{
								Id = @event.Id,
								EndsAt = @event.EndsAt,
								Title = @event.Title,
								Description = @event.Description,
								StartsAt = @event.StartsAt,
								EventPictureUrl = pictureService.GetPicture(@event.EventPictureId),
								EventOwner = MapEventOwner(@event.Id, owner),
								Activities = @event.Activities.Select(x => activityMapper.MapActivity(x)).ToList(),
								Progress = Math.Round(progress, 0), //returns 2.00 progress,
								Participants = participants.Select(x =>
								{
										var id = participantIdByUserId[x.Id];

										ParticipantResult result;

										if (participantResultsByParticipantId.ContainsKey(id))
										{
												result = participantResultsByParticipantId[id];
										}
										else
										{
												result = new ParticipantResult()
												{
														Id = id,
														TotalScore = 0,
														EventPlacement = lastPlacement
												};
										}

										return MapParticipantFromUser(x, result);
								}).ToList(),
								LeadingParticipantIds = leads
						};
				}
				public int? GetLastPlacement(List<ParticipantResult> participantResults)
				{
						return participantResults.Count() == 0 ? null : participantResults.OrderByDescending(x => x.EventPlacement).First().EventPlacement.Value + 1;
				}

				public List<int> MapLeadingParticipantIds(List<ParticipantResult> participantResults)
				{
						var leaders = participantResults
										.GroupBy(x => x.TotalScore)
										.OrderByDescending(x => x.Key)
										.FirstOrDefault()
										?.Select(x => x.Id).ToList() ?? new List<int>();

						return leaders;
				}

				public List<ParticipantResult> MapParticipantResults(Event @event)
				{
						var orderGroupingOfScores = @event.Activities.Where(x => x.CompletedOn != null)
								.SelectMany(a => a.Results.Select(r =>
								{
										return new
										{
												r.ParticipantId,
												r.Score
										};
								}))
								.Where(x => x.Score > 0)
								.GroupBy(x => x.ParticipantId)
								.Select(x => new { x.Key, TotalScore = x.Sum(p => p.Score) })
								.GroupBy(p => p.TotalScore)
								.OrderByDescending(p => p.Key)
								.SelectMany((p, i) =>
								{
										var placement = i;

										return p.Select(i =>
										{
												return new ParticipantResult()
												{
														Id = i.Key,
														EventPlacement = placement + 1, // first is 0.
														TotalScore = i.TotalScore
												};
										});
								}).ToList();

						return orderGroupingOfScores;
				}

				public class ParticipantResult
				{
						public int Id { get; set; }
						public double TotalScore { get; set; }
						public int? EventPlacement { get; set; }
				}

				public EventOwnerDto MapEventOwner(int eventId, User owner)
				{
						if (owner == null)
								return null;

						return new EventOwnerDto
						{
								Email = owner.Email,
								FirstName = owner.FirstName,
								LastName = owner.LastName,
								Id = eventId,
								UserId = owner.Id,
								ProfilePictureUrl = pictureService.GetPicture(owner.ProfilePictureId)
						};
				}

				public EventUserParticipantDto MapParticipantFromUser(User user, ParticipantResult participantResult)
				{
						if (user == null)
								return null;

						return new EventUserParticipantDto()
						{
								Id = participantResult.Id,
								Email = user.Email,
								FirstName = user.FirstName,
								LastName = user.LastName,
								UserId = user.Id,
								ProfilePictureUrl = pictureService.GetPicture(user.ProfilePictureId),
								EventPlacement = participantResult.EventPlacement,
								TotalEventScore = participantResult.TotalScore
						};
				}

				public EventListingDto MapEventListing(Event @event)
				{
						if (@event == null)
								return null;

						return new EventListingDto()
						{
								Id = @event.Id,
								EndsAt = @event.EndsAt,
								Title = @event.Title,
								StartsAt = @event.StartsAt,
								EventPictureUrl = pictureService.GetPicture(@event.EventPictureId)
						};
				}
		}
}
