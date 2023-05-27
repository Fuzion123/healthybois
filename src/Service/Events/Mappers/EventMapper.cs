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
            if(@event == null) throw new ArgumentNullException(nameof(@event));

            var participants = await userRepository.GetByIds(@event.Participants.Select(x => x.UserId).ToArray(), cancellationToken);

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
                Participants = participants.Select(x => MapParticipant(x)).ToList()
            };
        }

        public EventOwnerDto MapEventOwner(int eventId, User owner)
        {
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

        public ParticipantDto MapParticipant(User user)
        {
            return new ParticipantDto()
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Id = user.Id,
                ProfilePictureUrl = pictureService.GetPicture(user.ProfilePictureId)
            };
        }

        public EventListingDto MapEventListing(Event @event)
        {
            if (@event == null) throw new ArgumentNullException(nameof(@event));

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
