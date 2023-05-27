using Domain.Events;
using Domain.Exceptions;
using Domain.Users;
using Service.Events.Models;
using System.Threading;

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
                EventOwner = new EventOwnerDto
                {
                    Email = owner.Email,
                    FirstName = owner.FirstName,
                    LastName = owner.LastName,
                    Id = @event.Id,
                    ProfilePictureUrl = pictureService.GetPicture(owner.ProfilePictureId)
                },
                Activities = @event.Activities.Select(x =>
                {
                    return new ActivityDto()
                    {
                        Id = x.Id,
                        Title = x.Title,
                        CreatedAt = x.CreatedAt,
                        EventId = x.EventId,
                        OwnerUserId = x.OwnerUserId,
                        UpdatedAt = x.UpdatedAt,
                        Results = x.Results.Select(y =>
                        {
                            return new ResultDto()
                            {
                                Id = y.Id,
                                Score = y.Score,
                                ActivityId = y.ActivityId,
                                CreatedAt = y.CreatedAt,
                                UpdatedAt = y.UpdatedAt,
                                ParticipantId = y.ParticipantId
                            };
                        }).ToList(),
                    };
                }).ToList(),
                Participants = participants.Select(x =>
                {
                    return new ParticipantDto()
                    {
                        Email = x.Email,
                        FirstName = x.FirstName,
                        LastName = x.LastName,
                        Id = x.Id,
                        ProfilePictureUrl = pictureService.GetPicture(x.ProfilePictureId)
                    };
                }).ToList()
            };
        }

        public EventListingDto Map(Event @event)
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
