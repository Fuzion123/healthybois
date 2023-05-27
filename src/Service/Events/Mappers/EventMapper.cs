using Domain.Events;
using Domain.Exceptions;
using Domain.Users;
using Service.Events.Models;

namespace Service.Events.Mappers
{
    public class EventMapper
    {
        private readonly PictureService pictureService;
        private readonly IUserRepository userRepository;

        public EventMapper(PictureService pictureService, IUserRepository userRepository)
        {
            this.pictureService = pictureService;
            this.userRepository = userRepository;
        }

        public async Task<EventDetailDto> Map(Event @event, CancellationToken cancellationToken)
        {
            if (@event == null)
                return null;

            var ids = @event.Participants.Select(x => x.UserId).ToArray();

            var participantIdByUserId = @event.Participants.ToDictionary(k => k.UserId, v => v.Id);

            var participants = await userRepository.GetByIds(ids, cancellationToken);

            var owner = participants.FirstOrDefault(x => x.Id == @event.OwnerUserId) ?? throw new DomainException("No owner found on event");

            return new EventDetailDto()
            {
                Id = @event.Id,
                EndsAt = @event.EndsAt,
                EventIsActive = @event.EventIsActive,
                Title = @event.Title,
                Description = @event.Description,
                StartsAt = @event.StartsAt,
                EventPictureUrl = pictureService.GetPicture(@event.EventPictureId),
                EventOwner = MapEventOwner(@event.Id, owner),
                Activities = @event.Activities.Select(x => MapActivity(x)).ToList(),
                Participants = participants.Select(x =>
                {
                    var id = participantIdByUserId[x.Id];

                    return MapParticipantFromUser(id, x);
                }).ToList()
            };
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
                ProfilePictureUrl = pictureService.GetPicture(owner.ProfilePictureId)
            };
        }

        public ActivityDto MapActivity(Activity activity)
        {
            if (activity == null)
                return null;

            return new ActivityDto()
            {
                Id = activity.Id,
                Title = activity.Title,
                CreatedAt = activity.CreatedAt,
                EventId = activity.EventId,
                OwnerUserId = activity.OwnerUserId,
                UpdatedAt = activity.UpdatedAt,
                Results = activity.Results.Select(y => MapResult(y)).ToList(),
            };
        }

        public ResultDto MapResult(Result result)
        {
            if (result == null)
                return null;

            return new ResultDto()
            {
                Id = result.Id,
                Score = result.Score,
                ActivityId = result.ActivityId,
                CreatedAt = result.CreatedAt,
                UpdatedAt = result.UpdatedAt,
                ParticipantId = result.ParticipantId
            };
        }

        public UserParticipantDto MapParticipantFromUser(int particiopantId, User user)
        {
            if (user == null)
                return null;

            return new UserParticipantDto()
            {
                Id = particiopantId,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserId = user.Id,
                ProfilePictureUrl = pictureService.GetPicture(user.ProfilePictureId)
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
                EventIsActive = @event.EventIsActive,
                Title = @event.Title,
                StartsAt = @event.StartsAt,
                EventPictureUrl = pictureService.GetPicture(@event.EventPictureId)
            };
        }
    }
}
